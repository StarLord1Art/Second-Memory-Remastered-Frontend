import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {Context} from "../../Context";
import Search from "antd/es/input/Search";
import {Button, Layout} from "antd";

const {Header} = Layout;

function HeaderAntd({bgColor}) {
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
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: `${bgColor}`,
            }}>
                <Search
                    placeholder="Введите название файла"
                    allowClear
                    enterButton="Поиск"
                    size="middle"
                    onSearch={searchFile}
                    style={{ width: '20%' }}
                />
                {isUserAuthenticated ? (
                    <Button type="primary" onClick={logout}>Выйти</Button>
                ) : (
                    <Link to={{ pathname: "/signup" }}>
                        <Button type="primary">Зарегистрироваться</Button>
                    </Link>
                )}
            </Header>
        </>
    )
}

export default HeaderAntd;
