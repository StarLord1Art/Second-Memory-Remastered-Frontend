import React, {useState, useEffect, useContext, useRef} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {Breadcrumb, Button, Divider, Input, Layout, Select, Tag, theme, Typography} from 'antd';
import {DownloadOutlined, EditOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";
import FooterAntd from "./UI/FooterAntd";
import ModalAntd from "./UI/ModalAntd";

const { Header, Content } = Layout;
const {Title} = Typography;

function FileInfoPage() {
  const [fileInfo, setFileInfo] = useState({});
  const [newFileName, setNewFileName] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const {isUserAuthenticated} = useContext(Context);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [chosenOption, setChosenOption] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
        let _a;
        if (inputVisible) {
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [inputVisible]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/info/file/${state.fileId}`, {
        method: 'POST',
        credentials: 'include'
    })
      .then((response) => {
          if (response.status === 200) {
              response.json().then(data => {
                  console.log(data);
                  setFileInfo(data);
              })
          } else if (response.status === 400) {
              alert("Пожалуйста, войдите в аккаунт или зарегистрируйтесь!");
              navigate("/signup")
          } else if (response.status === 404) {
              alert("У Вас нет прав доступа для просмотра информации об этом файле!");
              navigate("/");
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
              navigate("/");
          }
      }).catch((error) => console.log(error));
  }, [isUserAuthenticated, navigate, state.bucket, state.fileId]);

  function deleteFile() {
      fetch(`http://localhost:8080/api/v1/files/delete?fileId=${state.fileId}`, {
          method: "DELETE",
          credentials: 'include',
      }).then((response) => {
          if (response.status === 200) {
              response.json().then((data) => {
                  console.log(data);
                  navigate("/");
              })
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
      }).catch((error) => {
          console.log(error);
      })
  }

  function downloadFile() {
      window.location.href = `http://localhost:8080/api/v1/files/download?fileId=${state.fileId}`;
  }

  function renameFile() {
      console.log(newFileName);
      setConfirmLoading(true);
      fetch(`http://localhost:8080/api/v1/files/rename/${state.fileId}?newFileName=${newFileName}`, {
          method: "PUT",
          credentials: 'include'
      }).then(response => {
          if (response.status === 200) {
              response.json().then((data) => {
                  console.log(data);
                  setFileInfo((prevState) => {
                      return {...prevState, fileName: newFileName, lastModifiedTs: data.fileLastModifiedDate}
                  });
              })
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
          handleCancel()
      }).catch((error) => {
          console.log(error); // Добавить страницу "Ошибка прав доступа"
      })
  }

  function addTag() {
      if (inputValue.trim() !== "") {
          fetch(`http://localhost:8080/api/v1/tags/add/tag/to/file?fileId=${state.fileId}&tagName=${inputValue}`, {
              method: "POST",
              credentials: 'include',
          }).then((response) => {
              if (response.status === 201) {
                  response.json().then((data) => {
                      console.log(data);
                      setFileInfo({...fileInfo, lastModifiedTs: data.lastModifiedTime, tags: [...fileInfo.tags, data]});
                  })
              } else {
                  alert("Что-то пошло не так, попробуйте снова позже");
              }
          }).catch((error) => {
              console.log(error);
          })
      }
      setInputVisible(false);
      setInputValue('');
  }

  function removeTag(tagId) {
      fetch(`http://localhost:8080/api/v1/tags/delete/by/file?tagId=${tagId}&fileId=${state.fileId}`, {
          method: "DELETE",
          credentials: 'include',
      }).then((response) => {
          if (response.status === 200) {
              response.json().then((data) => {
                  console.log(data);
                  setFileInfo({...fileInfo, lastModifiedTs: data.lastModifiedTime, tags: fileInfo.tags.filter((tg) => tg.id !== tagId)});
              })
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
      }).catch((error) => {
          console.log(error);
      })
  }

  function configureFileAccess() {
      fetch("http://localhost:8080/api/v1/roles/creation", {
          method: "POST",
          credentials: "include",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({email: email, fileId: state.fileId, Role: role})
      }).then((response) => {
          if (response.status === 201) {
              response.text().then((data) => {
                  console.log(data);
              })
          } else {
              alert("Что-то пошло не так, попробуйте снова позже")
          }
          handleCancel()
      }).catch((error) => {
          console.log(error);
      })
  }

  const handleCancel = () => {
      setOpen(false);
      setConfirmLoading(false);
      setNewFileName('');
      setEmail('')
      setRole('')
  }

  const handleChange = value => {
      console.log(`selected ${value}`);
      setRole(value)
  };

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
        <Content style={{ padding: '0 48px', paddingTop: '48px' }}>
            <Breadcrumb style={{ margin: '16px 0', marginTop: '0' }}>
                <Breadcrumb.Item>
                    <Link to={{ pathname: '/' }}>Главная</Link>
                </Breadcrumb.Item>
                {/*<Breadcrumb.Item>*/}
                {/*    <Link to={{ pathname: `/bucket/${state.bucket.name}` }} state={{bucket: state.bucket}}>Бакет</Link>*/}
                {/*</Breadcrumb.Item>*/}
                {/*<Breadcrumb.Item>*/}
                {/*    <Link to={{ pathname: `/bucket/${state.bucket.name}/file/${fileInfo.fileId}` }} state={{bucket: state.bucket, fileId: fileInfo.fileId}}>Файл</Link>*/}
                {/*</Breadcrumb.Item>*/}
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
                    <div>
                        <Title style={{justifySelf: "left"}}>
                            Информация о файле
                        </Title>
                        <Divider />
                        <h2 style={{justifySelf: "left"}}>Название файла: {fileInfo.fileName}</h2>
                        <h2 style={{justifySelf: "left"}}>Владелец: {fileInfo.ownerName}</h2>
                        <h2 style={{justifySelf: "left"}}>Размер: {Math.ceil(fileInfo.size / 1024)} КБ</h2>
                        <h2 style={{justifySelf: "left"}}>Дата добавления: {new Date(fileInfo.creationTs).toLocaleString()}</h2>
                        <h2 style={{justifySelf: "left"}}>Последнее обновление: {new Date(fileInfo.lastModifiedTs).toLocaleString()}</h2>
                        <h2 style={{justifySelf: "left"}}>Доступ к файлу: {fileInfo.role}</h2>
                        <div style={{display: 'flex', justifyContent: 'left'}}>
                            {fileInfo.tags?.map(tag => (
                                <span key={tag.id} style={{ display: 'inline-block' }}>
                                    <Tag bordered={false} color={'blue'} closable onClose={e => {
                                        e.preventDefault();
                                        removeTag(tag.id);
                                    }}
                                    >
                                        {tag.name}
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
                    <div style={{width: "48%"}}>
                        <Button type={'primary'} icon={<EditOutlined />} onClick={() => {
                            setChosenOption("1")
                            setOpen(true)
                        }}>Переименовать файл</Button>
                        <Button type={"primary"} icon={<SettingOutlined />} style={{marginLeft: "1%"}} onClick={() => {
                            setChosenOption("2")
                            setOpen(true)
                        }}>Настроить доступ</Button>
                        <ModalAntd
                            title={chosenOption === "1" ? "Переименовать файл" : "Настроить доступ к файлу"}
                            open={open}
                            onOk={chosenOption === "1" ? renameFile : configureFileAccess}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                    Отменить
                                </Button>,
                                <Button key="submit" type="primary" loading={confirmLoading} onClick={chosenOption === "1" ? renameFile : configureFileAccess}>
                                    {chosenOption === "1" ? "Переименовать" : "Настроить"}
                                </Button>
                            ]}
                        >
                            {chosenOption === "1" ? (
                                <Input type={"text"} value={newFileName} onChange={(event) => setNewFileName(() => event.target.value)} placeholder={"Введите новое название файла"}/>
                            ) : (
                                <>
                                    <Input type={"text"} value={email} onChange={(event) => setEmail(event.target.value)} placeholder={"Введите почту пользователя"}/>
                                    <Select
                                        prefix="Уровень доступа: "
                                        style={{ width: 200, marginTop: "2%" }}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'WRITER', label: 'Изменение файла' },
                                            { value: 'READER', label: 'Просмотр файла' },
                                        ]}
                                    />
                                </>
                            )}
                        </ModalAntd>

                        <Button type="primary" style={{margin: "0 1%"}} icon={<DownloadOutlined />} onClick={downloadFile}>
                            Скачать файл
                        </Button>
                        <Button type="primary" onClick={deleteFile} danger>
                            Удалить файл
                        </Button>
                    </div>
                </div>
            </div>
        </Content>
        <FooterAntd/>
    </Layout>
  );
}

export default FileInfoPage;
