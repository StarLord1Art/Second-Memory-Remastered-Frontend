import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {List, Typography} from "antd";
import {FileOutlined} from "@ant-design/icons";

const {Title} = Typography;

function FilesInDirectoryList(props) {
  const navigate = useNavigate();
  const [filesInDirectoryList, setFilesInDirectoryList] = useState([]);
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/info/directory", {
      method: "POST",
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
                    style={{width:'50%', marginLeft: '25%'}}
                    bordered
                    dataSource={filesInDirectoryList}
                    renderItem={file => (
                        <List.Item key={file.id} style={{display: 'flex', justifyContent: 'left', cursor: 'pointer'}} onClick={() => {
                            navigate(`file/${file.id}`, {
                                state: {
                                    fileId: file.id,
                                    bucketName: props.data.bucketName,
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
