import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Products from "./products/Products";
import Home from "./Home";
import ProductDetail from "./products/ProductDetail";
import ShoppingCart from "./shoppingCart/ShoppingCart";
import OrderListDetail from "./orderList/OrderListDetail";
import PurchaseForm from "./shoppingCart/PurchaseForm";
import Login from "./userLogin/Login";
import SignUp from "./userLogin/SignUp";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import MyOrderList from "./orderList/MyOrderList";
import AllOrderList from "./orderList/AllOrderList";
import ProductTableForEmp from "./products/ProductTableForEmp";
import ProductForm from "./products/ProductsForm";

const ShoppingMain = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({
        userEmail: "",
        userName: "",
        userRole: "",
        userPhone: ""
    });
    const [shopItems, setShopItems] = useState(0);

    const onLogin = (user) => {
        setUser({
            userEmail: user.userEmail,
            userName: user.userName,
            userRole: user.userRole,
            userPhone: user.userPhone,
        });
        localStorage.setItem("user", JSON.stringify(user));
        setIsLogin(true);
    }

    const logout = async () => {
        try {
            await axios.get("http://localhost:8080/logout").then((response) => {
                alert(response.data);
                setIsLogin(false);
                setUser({
                    userEmail: "",
                    userName: "",
                    userRole: "",
                    userPhone: ""
                });
                localStorage.clear();
                setShopItems(0);
            });
        } catch (error) {
            console.log("Logout Error", error);
        }
    }

    const fetchUser = () => {
        const theUser = localStorage.getItem("user");
        const jsonUser = JSON.parse(theUser);
        if (theUser != null) {
            setUser(jsonUser);
            setIsLogin(true);
        }
        const quantity = localStorage.getItem("totalQuantity");
        if (quantity != null) {
            setShopItems(quantity);
        }
    }

    useEffect(() => { fetchUser() }, [isLogin]);

    const changeShopItems = (totalQuantity) => {
        console.log("Change Quantity", totalQuantity);
        setShopItems(totalQuantity);
    };

    return (
        <BrowserRouter>
            <div className="container">
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="navbar-nav">
                            <Link to="/" className='nav-link'>Home</Link>
                            <Link to="/products" className='nav-link'>Products</Link>
                        </div>
                        <div className="navbar-nav ms-auto">
                            <Link to="/shoppingCart" className='nav-link'>購物車({shopItems})</Link>
                            {
                                isLogin ? (
                                    <div className="navbar-nav">
                                        <span className="nav-link">Welcome, {user.userName} &nbsp;</span>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                 三
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item><Link to="/myOrder" className='nav-link'>我的訂單</Link></Dropdown.Item>
                                                {
                                                    (user.userRole == "ADMIN" || user.userRole == "EMPLOYEE") ? <div>
                                                        <Dropdown.Item><Link to="/allOrder" className='nav-link'>所有訂單</Link></Dropdown.Item>
                                                        <Dropdown.Item><Link to="/productTable" className="nav-link">商品管理</Link></Dropdown.Item>
                                                    </div> : null
                                                }
                                                <Dropdown.Divider></Dropdown.Divider>
                                                <Dropdown.Item ><button className="btn btn-link" onClick={logout}>登出</button></Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                ) : (
                                    <div className="navbar-nav">
                                        <Link to="/login" className='nav-link'>登入</Link>
                                        <Link to="/signup" className='nav-link' >註冊</Link>
                                    </div>
                                )
                            }
                        </div>
                    </nav>
                </div>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={onLogin} isLogin={isLogin} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:pid" element={<ProductDetail changeShopItems={changeShopItems} />} />
                    <Route path="/shoppingCart" element={<ShoppingCart changeShopItems={changeShopItems} isLogin={isLogin} />} />
                    <Route path="/purchaseForm" element={<PurchaseForm changeShopItems={changeShopItems} />} />
                    <Route path="/myOrder" element={<MyOrderList/>} />
                    <Route path="/myOrder/:orderId" element={<OrderListDetail />} />
                    <Route path="/allOrder" element={<AllOrderList />} />
                    <Route path="/allOrder/:orderId" element={<OrderListDetail />} />
                    <Route path="/productTable" element={<ProductTableForEmp />} />
                    <Route path="/productForm" element={<ProductForm />} />
                </Routes>
            </div>
        </BrowserRouter>
    );

};

export default ShoppingMain;