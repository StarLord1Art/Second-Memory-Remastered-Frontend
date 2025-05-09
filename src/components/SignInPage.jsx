import React, {useContext} from "react";
import {Context} from "../Context";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, Typography} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";

const {Title} = Typography;

function SignInPage() {
    const {setIsUserAuthenticated} = useContext(Context);
    const navigate = useNavigate();

    function authenticateUser(formData) {
        console.log(formData);
        fetch("http://localhost:8080/api/v1/users/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        }).then((response) => {
            if (response.status === 200) {
                response.text().then(data => {
                    console.log(data);
                    setIsUserAuthenticated(() => true);
                    navigate("/");
                })
            } else {
                alert(response.statusText);
            }
        }).catch((error) => console.log(error));
    }

    return <>
        <Form name={'login'} style={{ maxWidth: 360, margin: '0 auto', marginTop: '15%'}} onFinish={(values) => authenticateUser(values)}>
            <Title>Вход</Title>
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Пожалуйста введите свою почту!' }]}
            >
                <Input prefix={<MailOutlined />} placeholder="Почта" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Пожалуйста введите свой пароль!' }]}
            >
                <Input prefix={<LockOutlined />} type="password" placeholder="Пароль" />
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Войти
                </Button>
            </Form.Item>
        </Form>
    </>
}

export default SignInPage;
