import React, { useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Context} from "../../Context";
import {Button, Layout} from "antd";

const {Header} = Layout;

function HeaderAntd({bgColor, children}) {
    const {isUserAuthenticated, setIsUserAuthenticated} = useContext(Context);
    const navigate = useNavigate();

    function logout() {
        fetch("http://localhost:8080/api/v1/users/logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 200) {
                    response.text().then((data) => {
                        console.log(data);
                        setIsUserAuthenticated(() => false);
                        navigate("/");
                    })
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
                {children}
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
