import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {Button, Dropdown, Input, List, Typography} from "antd";
import {DeleteOutlined, FileOutlined, FolderOutlined, PlusOutlined} from "@ant-design/icons";
import ModalAntd from "./UI/ModalAntd";

const {Title} = Typography;

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

function FilesInDirectoryList({data, setData}) {
  const navigate = useNavigate();
  const [filesInDirectoryList, setFilesInDirectoryList] = useState([]);
  const [file, setFile] = useState(null);
  const [directoryName, setDirectoryName] = useState('');
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [chosenOption, setChosenOption] = useState('');
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/directory/${data.folderId}`, {
      method: "POST",
      headers: {
        contentType: "application/json",
      }
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then(data => {
            console.log(data);
            setFilesInDirectoryList(data);
          })
        } else {
          alert("Что-то пошло не так, попробуйте снова позже")
        }
      }).catch((error) => console.log(error));
  }, [isUserAuthenticated, data]);

  function uploadFile() {
    console.log(file);
    setConfirmLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    console.log(formData.has('file'));
    const uploadedFile = formData.get('file');
    console.log("Файл в FormData:", uploadedFile?.name, uploadedFile?.size);

    fetch(`http://localhost:8080/api/v1/files/upload/folder/${data.folderId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          setFilesInDirectoryList((prevState) => {
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
    fetch(`http://localhost:8080/api/v1/folders/create/${data.bucketId}/${data.folderId}?folderName=${directoryName}`, {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          setFilesInDirectoryList((prevState) => {
            return {...prevState, folders: [...prevState.folders, data]}
          })
        })
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
      handleCancel()
    }).catch((error) => {console.log(error)})
  }

  function deleteDirectory(folderId) {
    fetch(`http://localhost:8080/api/v1/folders/delete/${folderId}`, {
      method: "DELETE",
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          setFilesInDirectoryList((prevState) => {
            return {...prevState, folders: prevState.folders.filter(f => f.folderId !== folderId)};
          })
        })
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
    })
  }

  const handleCancel = () => {
    setOpen(false);
    setConfirmLoading(false);
    setDirectoryName('')
    setFile(null);
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

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-evenly"}}>
        <Title>Все файлы</Title>
        <Dropdown.Button icon={<PlusOutlined />} style={{alignSelf: 'center', width: 'auto'}} menu={{items, onClick: handleMenuClick}}>Добавить</Dropdown.Button>
      </div>
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
      {filesInDirectoryList.files?.length > 0 || filesInDirectoryList.folders?.length > 0 ? (
          <>
            {filesInDirectoryList.folders?.length > 0 && (
                <List
                    style={{width:'50%', marginLeft: '25%'}}
                    bordered
                    dataSource={filesInDirectoryList.folders}
                    renderItem={directory => (
                        <List.Item key={directory.folderId} style={{display: 'flex', justifyContent: 'left'}}>
                          <FolderOutlined /> <span style={{cursor: 'pointer'}} onClick={() => setData((prevState) => {
                            return {...prevState, folderId: directory.folderId};
                        })}>{directory.name}</span>
                          <Button type={'text'} style={{marginLeft: "auto"}} icon={<DeleteOutlined />} onClick={() => deleteDirectory(directory.folderId)}/>
                        </List.Item>
                    )}
                />
            )}
            {filesInDirectoryList.files?.length > 0 && (
                <List style={{width:'50%', marginLeft: '25%'}}
                      bordered
                      dataSource={filesInDirectoryList.files}
                      renderItem={file => (
                          <List.Item key={file.fileId} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                            navigate(`file/${file.fileId}`, {
                              state: {
                                fileId: file.fileId,
                                folderId: data.folderId,
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
          // <Title>Бакет пуст</Title>
          <Title>Папка пуста</Title>
      )}
    </>
  );
}

export default FilesInDirectoryList;
