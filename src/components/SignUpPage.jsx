import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Form, Input, Typography} from "antd";

const {Title} = Typography;

function SignUpPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  function registerUser(formData) {
    console.log(formData);
    fetch("http://localhost:8080/api/v1/users/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    }).then((response) => {
      if (response.status === 201) {
        response.json().then(data => {
          console.log(data)
          navigate("/signin");
        })
      } else {
        alert(response.statusText);
      }
    }).catch((error) => console.log(error));
  }

  return <>
    <Form form={form} name={'register'} style={{ maxWidth: 600, margin: "0 auto", marginTop: "10%" }} onFinish={(values) => registerUser(values)} scrollToFirstError>
      <Title>Регистрация</Title>
      <Form.Item
          name="name"
          label="Имя пользователя"
          tooltip="Как к Вам обращаться?"
          rules={[{ required: true, message: 'Пожалуйста введите имя пользователя!', whitespace: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
          name="email"
          label="Почта"
          rules={[
            {
              type: 'email',
              message: 'Некорректный адрес почты!',
            },
            {
              required: true,
              message: 'Пожалуйста введите свою почту!',
            },
          ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
          name="password"
          label="Пароль"
          rules={[
            {
              required: true,
              message: 'Пожалуйста придумайте пароль!',
            },
          ]}
          hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
          name="confirm"
          label="Подтвердите пароль"
          dependencies={['password']}
          style={{marginBottom: "0"}}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Пожалуйста подтвердите свой пароль!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли должны совпадать!'));
              },
            }),
          ]}
      >
        <Input.Password />
      </Form.Item>

      <div style={{display: "flex", justifyContent: "center"}}>
        <h4 style={{marginRight: '1%'}}>Уже есть аккаунт?</h4><Link to={{pathname: "/signin"}}><h4>Войти</h4></Link>
      </div>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  </>;
}

export default SignUpPage;
