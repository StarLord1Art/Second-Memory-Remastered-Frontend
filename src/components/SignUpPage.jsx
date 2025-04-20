import React from "react";
import {Link, useNavigate} from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();

  function registerUser(formData) {
    console.log(formData);
    fetch("http://localhost:5432/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    }).then((response) => response.json()).then((response) => {
      console.log(response);
      if (response.status === 201) {
        navigate("/signin");
      } else {
        alert(response.statusText);
      }
    }).catch((error) => console.log(error));
  }

  return <>
    <h1>Регистрация</h1>
    <form action={(formData) => registerUser(formData)}>
      <label htmlFor="username">Как вас зовут?</label>
      <input name="username" id="username" type="text" required/>
      <label htmlFor="email">Ваша почта:</label>
      <input name="email" id="email" type="email" required/>
      <label htmlFor="password">Придумайте пароль:</label>
      <input name="password" id="password" type="password"
             pattern="(?=.*[A-Z])(?=.*[@_!#$%^*?&\(\)\/\|\}\{~:\<]).{8,}"
             required title="Пароль должен соответствовать формату."/>
      <label htmlFor="repeatPassword">Повторите пароль:</label>
      <input name="repeatPassword" id="repeatPassword" type="password"
             pattern="(?=.*[A-Z])(?=.*[@_!#$%^*?&\(\)\/\|\}\{~:\<]).{8,}" required
             title="Пароль должен соответствовать формату."/>
      <h4>Уже есть аккаунт?</h4><Link to={{pathname: "/signin"}}><h4>Войти</h4></Link>
      <button type={"submit"}>Зарегистрироваться</button>
    </form>
  </>;
}

export default SignUpPage;
