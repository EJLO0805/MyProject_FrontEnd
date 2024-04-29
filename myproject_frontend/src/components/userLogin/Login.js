import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin, isLogin }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({ userEmail: "", userPassword: "" });

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setUser((old) => ({ ...old, [name]: value }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8080/login", user).then((response) => {
                if(response.status === 200){
                    onLogin(response.data);
                    navigate("/products");
                }else{
                    alert("帳號或密碼錯誤，請重新輸入");
                }
            });
        } catch (error) {
            console.log("Login Error" + error);
        }
    };

    return (isLogin ? (
        navigate("/")
    ) : (
        <div className="container mt-5 row justify-content-left col-md-4">
            <h3>Login Form</h3 >
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">Account:</label>
                    <input type="text" className="form-control" name="userEmail" value={user.userEmail} onChange={changeHandler} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-control" name="userPassword" value={user.userPassword} onChange={changeHandler} required />
                </div>
                <p></p>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div >
    ));

};

export default Login;