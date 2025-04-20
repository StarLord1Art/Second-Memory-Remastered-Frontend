import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import Header from "./Header";

function BucketPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [bucketRootDirectoriesList, setBucketRootDirectoriesList] = useState(
    [
      {
        id: 1,
        name: "dir1",
        path: "G/dir1",
      },
      {
        id: 2,
        name: "dir2",
        path: "G/dir2",
      },
    ]
  );
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:5432/api/v1/root/directories", {
      method: "GET",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({ bucketName: `${state.data.bucketName}` }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setBucketRootDirectoriesList(response.result);
      })
      .catch((error) => console.log(error));
  }, [isUserAuthenticated]);

  function deleteBucket() {
    fetch(`http://localhost:5432/api/v1/buckets/${state.data.bucketName}`, {
      method: "DELETE",
    }).then((response) => response.json()).then((response) => {
      console.log(response);
      if (response.status === 200) {
        navigate("/");
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
    }).catch((error) => {console.log(error)})
  }

  function uploadFile(file) {
    console.log(file);
    fetch(`http://localhost:5432/api/v1/files/upload/${state.data.bucketName}`, {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({file: file}),
    }).then((response) => response.json()).then((response) => {
      console.log(response);
      if (response.status === 200) {
        console.log(response.result); // Доделать
      } else {
        alert("Что-то пошло не так, попробуйте снова позже")
      }
    }).catch((error) => {console.log(error)})
  }

  return (
    <>
      <Header />
      <main>
        <div>
          <div className="sidebar">
            <button id="close">Закрыть</button>
            <button id="deleteBucket" onClick={deleteBucket}>Удалить бакет</button>
            <ul style={{ listStyle: "none", padding: "0px" }}>
              {bucketRootDirectoriesList.map((directory) => {
                console.log(directory);
                return (
                  <li>
                    <h2
                      className="item"
                      onClick={() => {
                        navigate("info/directory", {
                          state: {
                            data: {
                              path: directory.path,
                              bucketName: state.data.bucketName,
                            },
                          },
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
          <div>
            <input type="file" onChange={(event) => setFile(() => event.target.files[0])} />
            <button id="uploadFile" onClick={() => uploadFile(file)}>Загрузить файл</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default BucketPage;
