import React, {useState, useEffect, useContext, useRef} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {Breadcrumb, Button, Divider, Input, Layout, Modal, Tag, theme, Typography} from 'antd';
import {DownloadOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import FooterAntd from "./UI/FooterAntd";

const { Header, Content } = Layout;
const {Title} = Typography;

function FileInfoPage() {
  const [fileInfo, setFileInfo] = useState({
      id: 1,
      name: "fl1",
      owner: "Artem",
      creationDate: new Date().getTime(),
      lastModifiedDate: new Date().getTime(),
      tags: ["Work", "Study", "Pleasure"],
      accessLevel: "private"
  });
  const [newFileName, setNewFileName] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const {isUserAuthenticated} = useContext(Context);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
        let _a;
        if (inputVisible) {
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [inputVisible]);

  useEffect(() => {
    fetch(`http://localhost:5432/api/v1/info/file/${state.data.fileId}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setFileInfo(response.result);
      })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated, fileInfo, state.data.fileId]);

  function deleteFile(bucketName, fileName) {
      console.log(bucketName + ": " + fileName);
      fetch(`http://localhost:5432/api/v1/files/delete/${bucketName}/${fileName}`, {
          method: "DELETE",
      }).then((response) => response.json()).then((response) => {
          console.log(response);
          if (response.status === 200) {
              navigate("info/directory");
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
      }).catch((error) => {
          console.log(error);
      })
  }

  function downloadFile(bucketName, fileName) {
      console.log(bucketName + ": " + fileName);
      fetch(`http://localhost:5432/api/v1/files/download/${bucketName}/${fileName}`, {
          method: "POST",
      }).then((response) => response.json()).then((response) => {
          console.log(response);
      }).catch((error) => {
          console.log(error);
      })
  }

  function renameFile() {
      console.log(state.data.bucketName + ": " + fileInfo.name);
      fetch(`http://localhost:5432/api/v1/files/rename/${state.data.bucketName}/${fileInfo.name}?newKey=${newFileName}`, {
          method: "POST",
      }).then(response => response.json()).then((response) => {
          console.log(response);
          if (response.status === 200) {
              setFileInfo({...fileInfo, name: newFileName });
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
      }).catch((error) => {
          console.log(error);
      })
  }

  function addTag() {
      if (inputValue && fileInfo.tags.indexOf(inputValue) === -1) {
          fetch(`http://localhost:5432/api/v1/tags/add`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  fileId: fileInfo.id,
                  name: inputValue,
              })
          }).then((response) => response.json()).then((response) => {
              console.log(response);
              if (response.status === 200) {
                  setFileInfo({...fileInfo, tags: [...fileInfo.tags, inputValue]});
              } else {
                  alert("Что-то пошло не так, попробуйте снова позже")
              }
          }).catch((error) => {
              console.log(error);
          })
      }
      setInputVisible(false);
      setInputValue('');
  }

  function removeTag(tag) {
      fetch("http://localhost:5432/api/v1/tags/remove", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              fileId: fileInfo.id,
              name: tag,
          })
      }).then((response) => response.json()).then((response) => {
          console.log(response);
          if (response.status === 200) {
              setFileInfo({...fileInfo, tags: fileInfo.tags.filter((tg) => tg !== tag)});
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
      }).catch((error) => {
          console.log(error);
      })
  }

  const handleCancel = () => {
      setOpen(false);
      setNewFileName('');
  }

  const {
      token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
        <Header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div className="demo-logo" />
        </Header>
        <main>
            <Content style={{ padding: '0 48px', paddingTop: '48px' }}>
                <Breadcrumb style={{ margin: '16px 0', marginTop: '0' }}>
                    <Breadcrumb.Item>
                        <Link to={{ pathname: '/' }}>Главная</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={{ pathname: '/root/directories' }}>Бакет</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={{ pathname: `/root/directories/info/file/${fileInfo.id}` }}>Файл</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 800,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type={'primary'} icon={<EditOutlined />} onClick={() => setOpen(true)}>Переименовать файл</Button>
                        <Modal
                            title="Переименовать файл"
                            open={open}
                            onOk={renameFile}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                    Отменить
                                </Button>,
                                <Button key="submit" type="primary" loading={confirmLoading} onClick={renameFile}>
                                    Переименовать
                                </Button>
                            ]}
                        >
                            <Input type={"text"} value={newFileName} onChange={(event) => setNewFileName(() => event.target.value)} placeholder={"Введите новое название файла"}/>
                        </Modal>
                        <div>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={() => downloadFile(state.data.bucketName, fileInfo.name)}>
                                Скачать файл
                            </Button>
                            <Button type="primary" onClick={() => deleteFile(state.data.bucketName, fileInfo.name)} danger>
                                Удалить файл
                            </Button>
                        </div>
                    </div>
                    <div style={{marginTop: "7%"}}>
                        <Title>
                            Информация о файле
                        </Title>
                        <Divider />
                        <h2>Владелец: {fileInfo.owner}</h2>
                        <h2>Дата добавления: {fileInfo.creationDate.toString()}</h2>
                        <h2>Последнее обновление: {fileInfo.lastModifiedDate.toString()}</h2>
                        <h2>Разрешение на скачивание: {fileInfo.accessLevel}</h2>
                        {fileInfo.tags.map(tag => (
                            <span key={tag} style={{ display: 'inline-block' }}>
                                    <Tag closable onClose={e => {
                                        e.preventDefault();
                                        removeTag(tag);
                                    }}
                                    >
                                        {tag}
                                    </Tag>
                                </span>
                        ))}
                        {inputVisible ? (
                            <Input
                                ref={inputRef}
                                type="text"
                                size="small"
                                style={{ width: 78 }}
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                onBlur={addTag}
                                onPressEnter={addTag}
                            />
                        ) : (
                            <Tag onClick={() => setInputVisible(true)} style={{
                                background: colorBgContainer,
                                borderStyle: 'dashed',
                            }}>
                                <PlusOutlined /> Новый тег
                            </Tag>
                        )}
                    </div>
                </div>
            </Content>
        </main>
        <FooterAntd/>
    </Layout>
  );
}

export default FileInfoPage;
