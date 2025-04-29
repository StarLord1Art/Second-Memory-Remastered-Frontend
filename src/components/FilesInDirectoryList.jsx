import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {List, Typography} from "antd";
import {FileOutlined} from "@ant-design/icons";

const {Title} = Typography;

function FilesInDirectoryList(props) {
  const navigate = useNavigate();
  const [filesInDirectoryList, setFilesInDirectoryList] = useState([
      {
          id: 1,
          name: "File 1",
          owner: "Artem",
          creationDate: new Date(),
          lastModifiedDate: new Date(),
          tags: ["Work", "Study", "Pleasure"],
          accessLevel: "private"
      },
      {
          id: 2,
          name: "File 2",
          owner: "Artem",
          creationDate: new Date(),
          lastModifiedDate: new Date(),
          tags: ["Work", "Study", "Pleasure"],
          accessLevel: "private"
      },
      {
          id: 3,
          name: "File 3",
          owner: "Artem",
          creationDate: new Date(),
          lastModifiedDate: new Date(),
          tags: ["Work", "Study", "Pleasure"],
          accessLevel: "private"
      }
  ]);
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:5432/api/v1/info/directory", {
      method: "GET",
        headers: {
          contentType: "application/json",
        },
      body: JSON.stringify({
        path: props.data.path,
        bucketName: props.data.bucketName,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setFilesInDirectoryList(response.result);
      })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated, props.data]);

  return (
    <>
        {filesInDirectoryList ? (
            <>
                <List
                    style={{width:'50%', margin: '3% 0 0 25%'}}
                    bordered
                    dataSource={filesInDirectoryList}
                    renderItem={file => (
                        <List.Item key={file.id} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                            navigate(`info/file/${file.id}`, {
                                state: {
                                    data: {
                                        fileId: file.id,
                                        bucketName: props.data.bucketName,
                                    },
                                },
                            });
                        }}>
                            <FileOutlined /> {file.name}
                        </List.Item>
                    )}
                />
            </>
        ) : (
            <Title>Папка пуста</Title>
        )}
    </>
  );
}

export default FilesInDirectoryList;
