import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import Header from "./Header";

function FilesPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [filesInDirectoryList, setFilesInDirectoryList] = useState([
      {
          id: 1,
          name: "fl1",
          owner: "Artem",
          creationDate: new Date(),
          lastModifiedDate: new Date(),
          tags: ["Work", "Study", "Pleasure"],
          accessLevel: "private"
      },
      {
          id: 2,
          name: "fl1",
          owner: "Artem",
          creationDate: new Date(),
          lastModifiedDate: new Date(),
          tags: ["Work", "Study", "Pleasure"],
          accessLevel: "private"
      },
      {
          id: 3,
          name: "fl1",
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
        path: state.data.path,
        bucketName: state.data.bucketName,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setFilesInDirectoryList(response.result);
      })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated]);

  return (
    <>
      <Header />
      <main>
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
            </div>
            <ul style={{ listStyle: "none", padding: "0px", marginTop: "0px" }}>
              {filesInDirectoryList.map((file) => {
                console.log(file);
                return (
                  <li>
                    <div
                      className="file"
                      onClick={() => {
                        navigate(`info/file/${file.id}`, {
                          state: {
                            data: {
                                fileId: file.id,
                                bucketName: state.data.bucketName,
                            },
                          },
                        });
                      }}
                    >
                      <h2>{file.name}</h2>
                      <h2>{file.lastModifiedDate}</h2>
                      <h2>{file.owner}</h2>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <h1>Папка не выбрана</h1>
        )}
      </main>
    </>
  );
}

export default FilesPage;
