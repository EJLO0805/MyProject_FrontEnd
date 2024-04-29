import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [user, setUser] = useState({
        userEmail: "",
        userName: "",
        userPassword: "",
        userPhone: ""
    })
    const url = "http://localhost:8080/user/signup";
    const navigate = useNavigate();
    const [successUser, setSuccessUser] = useState(null);

    const changeValueHandler = (event) => {
        setUser((preData) => ({ ...preData, [event.target.name]: event.target.value }));
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            await axios.post(url, user).then(response => {
                setSuccessUser(response.data);
                if (successUser != null) {
                    navigate("/login");
                } else {
                    alert("User Email has already existed, please change your Email");
                    setUser({
                        userEmail: "",
                        userName: "",
                        userPassword: "",
                        userPhone: ""
                    })
                }
            });
        } catch (error) {
            console.log("Sign up Error", error);
        }
    }

    return (
        <div className="container mt-5 row justify-content-left col-md-4">
            <h2>Sign Up Form</h2>
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">User Account</label>
                    <input type="email" className="form-control" name="userEmail" value={user.userEmail} placeholder="enter email" onChange={changeValueHandler} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">User Password</label>
                    <input type="password" className="form-control" name="userPassword" value={user.userPassword} onChange={changeValueHandler} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">User Name</label>
                    <input type="text" className="form-control" name="userName" value={user.userName} onChange={changeValueHandler} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">User Phone</label>
                    <input type="text" className="form-control" name="userPhone" value={user.userPhone} onChange={changeValueHandler} required />
                </div>
                <p></p>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );

};

export default SignUp;