import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import {Context} from "../Context";
import Header from "./Header";

function Main() {
  const [bucketsList, setBucketsList] = useState([
      "Buck1",
      "Buck2",
      "Buck3",
  ]);
  const [bucketName, setBucketName] = useState("");
  const navigate = useNavigate();
  const {isUserAuthenticated} = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:5432/api/v1/buckets")
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setBucketsList(response.result);
      })
        .catch((error) => console.log(error));
  }, [isUserAuthenticated, bucketsList]);

  function createBucket(bucketName) {
      console.log(bucketName);
      fetch(`http://localhost:5432/api/v1/buckets/${bucketName}`, {
          method: "POST",
      })
        .then((response) => response.json())
        .then((response) => {
            console.log(response)
            setBucketsList((bucketsList) => [...bucketsList, response.result]);
        }).catch((error) => {console.log(error)})
  }

  return (
    <>
        <Header />
      <main>
        <div>
          <h1 id="welcome">Добрый день!</h1>
            <div>
                <input type="text" value={bucketName} onChange={(event) => setBucketName(() => event.target.value)} placeholder="Введите название бакета: "/>
                <button id="createBucket" onClick={() => createBucket(bucketName)}>Создать бакет</button>
            </div>
          <ul style={{ listStyle: "none", padding: "0px", marginTop: "0px" }}>
            {bucketsList.map((bucket) => {
              console.log(bucket);
              return (
                <li>
                  <h2
                    className="item"
                    onClick={() => {
                      navigate("root/directories", {
                        state: {
                          data: {
                            bucketName: bucket,
                          },
                        },
                      });
                    }}
                  >
                    {bucket}
                  </h2>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
}

export default Main;
