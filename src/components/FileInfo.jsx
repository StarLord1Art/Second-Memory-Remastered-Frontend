import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function FileInfo() {
  const [fileInfo, setFileInfo] = useState({});
  const { state } = useLocation();

  useEffect(() => {
    fetch(`http://localhost:5432/info/file/${state.data.fileId}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setFileInfo(response.result);
      });
  }, []);

  return (
    <>
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
        <h3>Теги: {fileInfo.tags}</h3>
        <h3>Разрешение на скачивание: {fileInfo.accessLevel}</h3>
      </div>
    </>
  );
}

export default FileInfo;
