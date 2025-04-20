import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Context} from "../Context";
import Header from "./Header";

function FileInfoPage() {
  const [fileInfo, setFileInfo] = useState({
      id: 7,
      name: "fl1",
      owner: "Artem",
      creationDate: new Date(),
      lastModifiedDate: new Date(),
      tags: ["Work", "Study", "Pleasure"],
      accessLevel: "private"
  });
  const [newFileName, setNewFileName] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch(`http://localhost:5432/api/v1/info/file/${state.data.fileId}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setFileInfo(response.result);
      })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated, fileInfo]);

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

  function renameFile(bucketName, fileName) {
      console.log(bucketName + ": " + fileName);
      fetch(`http://localhost:5432/api/v1/files/rename/${bucketName}/${fileName}?newKey=${newFileName}`, {
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

  return (
    <>
        <Header />
        <main>
            <div>
                <div>
                    <input type={"text"} value={newFileName} onChange={(event) => setNewFileName(() => event.target.value)} placeholder={"Введите новое название файла: "}/>
                    <button id="renameFile" onClick={() => renameFile(state.data.bucketName, fileInfo.name)}>Переименовать файл</button>
                </div>
                <div>
                    <button id="downloadFile" onClick={() => downloadFile(state.data.bucketName, fileInfo.name)}>Скачать файл</button>
                    <button id="deleteFile" onClick={() => deleteFile(state.data.bucketName, fileInfo.name)}>Удалить файл</button>
                    <button id="addTags">Добавить теги</button>
                </div>
            </div>
            <div
                style={{
                    marginLeft: "2%",
                    color: "red",
                    fontFamily: "Montserrat, serif",
                }}
            >
                <h1
                    style={{
                        fontOpticalSizing: "auto",
                        fontWeight: "300",
                        fontStyle: "normal",
                    }}
                >
                    Сведения о файле
                </h1>
                <hr style={{ width: "40%", marginRight: "60%", borderColor: "red" }} />
                <h3>Владелец: {fileInfo.owner}</h3>
                <h3>Дата добавления: {fileInfo.creationDate}</h3>
                <h3>Последнее обновление: {fileInfo.lastModifiedDate}</h3>
                <h3>Теги: {fileInfo.tags.toString()}</h3>
                <h3>Разрешение на скачивание: {fileInfo.accessLevel}</h3>
            </div>
        </main>
    </>
  );
}

export default FileInfoPage;
