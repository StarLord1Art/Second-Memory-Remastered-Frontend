import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {Context} from "../Context";

function Header() {
    const [searchedFileName, setSearchedFileName] = useState("");
    const {isUserAuthenticated, setIsUserAuthenticated} = useContext(Context);

    function logout() {
        fetch("http://localhost:5432/api/v1/logout")
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    setIsUserAuthenticated(() => false);
                } else {
                    alert("Что-то пошло не так, попробуйте снова позже")
                }
            }).catch((error) => console.log(error));
    }

    function searchFile(fileName) {
        console.log(fileName);
        fetch("http://localhost:5432/api/v1/file-search", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name: fileName})
        }).then((response) => response.json()).then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.result) // Доделать
            } else {
                alert("Что-то пошло не так, попробуйте снова позже")
            }
        }).catch((error) => console.log(error));
    }

    return (
        <>
            <header>
                <div id="header">
                    <button id="openSideMenu">Открыть меню</button>
                    <div id="search">
                        <input type={"text"} value={searchedFileName} onChange={(event) => setSearchedFileName(() => event.target.value)} placeholder={"Введите название файла: "}/>
                        <button id="searchFile" onClick={() => searchFile(searchedFileName)}>Поиск</button>
                    </div>
                    {isUserAuthenticated ? (
                        <button id="logout" onClick={logout}>Выйти</button>
                    ) : (
                        <Link to={{ pathname: "/signup" }}>
                            <button id="register">Зарегистрироваться</button>
                        </Link>
                    )}
                </div>
            </header>
        </>
    )
}

export default Header;
