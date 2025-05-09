import React, {useState, useEffect, useContext} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import FilesInDirectoryList from "./FilesInDirectoryList";
import {Breadcrumb, Dropdown, Input, Layout, List, theme, Typography} from 'antd';
import {ArrowLeftOutlined, FileOutlined, FolderOutlined, PlusOutlined} from '@ant-design/icons';
import { Button } from 'antd';
import FooterAntd from "./UI/FooterAntd";
import HeaderAntd from "./UI/HeaderAntd";
import ModalAntd from "./UI/ModalAntd";

const { Content, Sider } = Layout;
const {Title} = Typography;
const { Search } = Input;

const items = [
  {
    key: '1',
    label: 'Файл',
  },
  {
    key: '2',
    label: 'Папку',
  },
];

function BucketPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [directoryName, setDirectoryName] = useState('');
  const [data, setData] = useState({});
  const [collapsed, setCollapsed] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [chosenOption, setChosenOption] = useState('');
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: "FOO.png"
    },
    {
      id: 2,
      name: "FOO.json"
    }
  ]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [bucketRootDirectoriesList, setBucketRootDirectoriesList] = useState([]);
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/directory/${state.bucket.rootFolderId}`, {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
    })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setBucketRootDirectoriesList(response);
        })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated, state.bucket]);

  function uploadFile() {
    console.log(file);
    setConfirmLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    console.log(formData.has('file'));
    const uploadedFile = formData.get('file');
    console.log("Файл в FormData:", uploadedFile?.name, uploadedFile?.size);

    fetch(`http://localhost:8080/api/v1/files/upload/${state.bucket.id}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          setBucketRootDirectoriesList((prevState) => {
            return {...prevState, files: [...prevState.files, data]};
          })
        })
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
      handleCancel()
    }).catch((error) => {console.log(error)})
  }

  function createDirectory() {
    setConfirmLoading(true);
    fetch(`http://localhost:8080/api/v1/folders/create/${state.bucket.id}/${state.bucket.rootFolderId}?folderName=${directoryName}`, {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          setBucketRootDirectoriesList((prevState) => {
            return {...prevState, folders: [...prevState.folders, data]}
          })
        })
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
      handleCancel()
    }).catch((error) => {console.log(error)})
  }

  function searchFile(fileName) {
    console.log(fileName);
    fetch("http://localhost:8080/api/v1/file-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: fileName})
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          setSearchResults(data);
          setShowSearchResult(true);
        })
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
    }).catch((error) => console.log(error));
  }

  const handleMenuClick = e => {
    if (e.key === "1") {
      setChosenOption('1')
      setOpen(true);
    } else {
      setChosenOption('2');
      setOpen(true);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setConfirmLoading(false);
    setDirectoryName('')
    setFile(null);
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
      }} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}></Sider>
      <Layout>
        <HeaderAntd bgColor={colorBgContainer}>
          <Search
              placeholder="Введите название файла"
              allowClear
              enterButton="Поиск"
              size="middle"
              onSearch={(value, _e, info) => searchFile(value)}
              style={{ width: '20%' }}
          />
        </HeaderAntd>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Breadcrumb style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item>
              <Link to={{ pathname: '/' }}>Главная</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={{ pathname: `/bucket/${state.bucket.name}` }} state={{bucket: state.bucket}}>Бакет</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div style={{
            padding: 24,
            minHeight: 800,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            <ModalAntd title={chosenOption === '1' ? "Загрузить файл" : "Создать папку"}
                       open={open}
                       onOK={chosenOption === '1' ? uploadFile : createDirectory}
                       confirmLoading={confirmLoading}
                       onCancel={handleCancel}
                       footer={[
                         <Button key="back" onClick={handleCancel}>
                           Отменить
                         </Button>,
                         <Button key="submit" type="primary" loading={confirmLoading} onClick={chosenOption === '1' ? uploadFile : createDirectory}>
                           {chosenOption === '1' ? 'Загрузить' : 'Создать'}
                         </Button>
                       ]}
            >
              {chosenOption === '1' ? (
                  <input type={'file'} onChange={(event) => setFile(() => event.target.files[0])}/>
              ) : (
                  <Input type="text" value={directoryName} onChange={(event) => setDirectoryName(() => event.target.value)} placeholder="Введите название папки"/>
              )}
            </ModalAntd>
            {showSearchResult ? (
                <>
                  <div style={{display: 'flex', justifyContent: 'left'}}>
                    <Button type={'text'} icon={<ArrowLeftOutlined />} onClick={() => setShowSearchResult(false)}>Назад</Button>
                  </div>
                  <List
                      style={{width:'50%', margin: '3% 0 0 25%'}}
                      bordered
                      dataSource={searchResults}
                      renderItem={file => (
                          <List.Item key={file.id} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                            navigate(`file/${file.id}`, {
                              state: {
                                fileId: file.id,
                                bucketName: state.bucketName,
                              },
                            });
                          }}>
                            <FileOutlined /> {file.name}
                          </List.Item>
                      )}
                  />
                </>
            ) : (
                <>
                  <div style={{display: "flex", justifyContent: "space-evenly"}}>
                    <Title>Все файлы</Title>
                    <Dropdown.Button icon={<PlusOutlined />} style={{alignSelf: 'center', width: 'auto'}} menu={{items, onClick: handleMenuClick}}>Добавить</Dropdown.Button>
                  </div>
                  {bucketRootDirectoriesList.files?.length > 0 || bucketRootDirectoriesList.folders?.length > 0 ? (
                      <>
                        {bucketRootDirectoriesList.folders?.length > 0 && (
                            <List
                                style={{width:'50%', marginLeft: '25%'}}
                                bordered
                                dataSource={bucketRootDirectoriesList.folders}
                                renderItem={directory => (
                                    <List.Item key={directory.folderId} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {}}>
                                      <FolderOutlined /> {directory.name}
                                    </List.Item>
                                )}
                            />
                        )}
                        {bucketRootDirectoriesList.files?.length > 0 && (
                            <List style={{width:'50%', marginLeft: '25%'}}
                                  bordered
                                  dataSource={bucketRootDirectoriesList.files}
                                  renderItem={file => (
                                      <List.Item key={file.fileId} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                                        navigate(`file/${file.fileId}`, {
                                          state: {
                                            fileId: file.fileId,
                                            bucket: state.bucket,
                                          },
                                        });
                                      }}>
                                        <FileOutlined /> {file.fileName}
                                      </List.Item>
                                  )}
                            />
                        )}
                      </>
                  ) : (
                      <Title>Бакет пуст</Title>
                  )}
                  {/*<FilesInDirectoryList data={data} />*/}
                </>
            )}
          </div>
        </Content>
        <FooterAntd/>
      </Layout>
    </Layout>
  );
}

export default BucketPage;
