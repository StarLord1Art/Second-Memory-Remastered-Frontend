import React, { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Main(bucketName) {
  const navigate = useNavigate();
  const [bucketRootDirectoriesList, setBucketRootDirectoriesList] = useState(
    []
  );
  const [filesInDirectoryList, setFilesInDirectoryList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5432/root/directories", {
      method: "GET",
      body: JSON.stringify({ bucketName: `${bucketName}` }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.result);
        setBucketRootDirectoriesList(response.result);
      });
  }, []);

  return (
    <>
      <header>
        <div id="header">
          <button id="openSideMenu">Открыть меню</button>
          <button id="logout">Выйти</button>
        </div>
      </header>
      <main>
        <div>
          <h1 id="welcome">Добрый день, {userName}!</h1>
          <div className="sidebar">
            <button id="close">Закрыть</button>
            <ul style={{ listStyle: "none", padding: "0px" }}>
              {bucketRootDirectoriesList.forEach((directory) => {
                console.log(directory);
                return (
                  <li>
                    <h2
                      className="item"
                      onClick={() => {
                        fetch("http://localhost:5432/info/directory", {
                          method: "GET",
                          body: JSON.stringify({
                            path: directory.path,
                            bucketName: bucketName,
                          }),
                        })
                          .then((response) => response.json())
                          .then((response) => {
                            console.log(response.result);
                            setFilesInDirectoryList(response.result);
                          });
                      }}
                    >
                      {directory.name}
                    </h2>
                  </li>
                );
              })}
            </ul>
          </div>
          {filesInDirectoryList ? (
            <>
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h2>Имя файла:</h2>
                <h2>Последнее обновление:</h2>
                <h2>Владелец:</h2>
                <h2>Теги:</h2>
              </div>
              <ul
                style={{ listStyle: "none", padding: "0px", marginTop: "0px" }}
              >
                {filesInDirectoryList.forEach((file) => {
                  console.log(file);
                  return (
                    <li>
                      <div
                        className="file"
                        onClick={() => {
                          navigate(`info/file/${file.id}`, {
                            state: {
                              data: { fileId: file.id },
                            },
                          });
                        }}
                      >
                        <h2>{file.name}</h2>
                        <h2>{file.lastUpdateDate}</h2>
                        <h2>{file.owner}</h2>
                        <h2>{file.tags}</h2>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <h1>Папка не выбрана</h1>
          )}
        </div>
      </main>
    </>
  );
}

export default Main;
