import React, {useContext} from "react";
import {Context} from "../Context";
import {useNavigate} from "react-router-dom";

function SignInPage() {
    const {setIsUserAuthenticated} = useContext(Context);
    const navigate = useNavigate();

    function authenticateUser(formData) {
        console.log(formData);
        fetch("http://localhost:5432/api/v1/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((response) => {
            console.log(response);
            if (response.status === 200) {
                setIsUserAuthenticated(() => true);
                navigate("/");
            } else {
                alert(response.statusText);
            }
        }).catch((error) => console.log(error));
    }

    return <>
        <form action={(formData) => authenticateUser(formData)}>
            <label className="EmailLabel" htmlFor="email">Почта:</label>
            <input name="email" id="email" className="Email" type="email" required/>
            <label className="PasswordLabel" htmlFor="password">Пароль:</label>
            <input name="password" id="password" className="Password" type="password" minLength="8" required/>
            <button type="submit" className="Submit">Войти</button>
        </form>
    </>
}

export default SignInPage;
