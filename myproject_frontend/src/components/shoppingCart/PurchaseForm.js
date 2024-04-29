import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PurchaseForm = ({ changeShopItems }) => {
    const myCart = JSON.parse(localStorage.getItem("localCart"));
    const tp = useLocation().state;
    const [user, setUser] = useState({});
    const [totalPrice,setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState({
        purchaseProducts: [],
        userEmail: "",
        orderTotalPrice: 0.0,
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerAddress: ""
    });

    useEffect(() => {
        const loginUser = JSON.parse(localStorage.getItem("user"));
        if(tp){
            setTotalPrice(tp);
        }
        if (loginUser) {
            setUser(loginUser);
        }
    }, []);
    useEffect(() => {
        setOrderList({
            purchaseProducts: myCart,
            userEmail: user.userEmail,
            orderTotalPrice: totalPrice,
            customerName: "",
            customerPhone: "",
            customerEmail: "",
            customerAddress: ""
        });

    }, [user]);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setOrderList((preValue) => ({ ...preValue, [name]: value }));
        console.log(name, value);
    };

    const saveOrder = async () => {
        try {
            var result = null;
            console.log(JSON.parse(localStorage.getItem("user")).userRole);
            await axios.post("http://localhost:8080/purchaseProduct", orderList, {
                headers: {
                    "Authorization": user.userRole
                }
            }).then(response =>
                result = response.data
            );
            return result;
        } catch (error) {
            console.log("Save Order List Error", error);
        }
    }

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(orderList);
        const data = saveOrder();
        if (data) {
            alert("訂購成功！");
            localStorage.setItem("localCart", null);
            localStorage.setItem("totalQuantity", 0);
            changeShopItems(localStorage.getItem("totalQuantity"));
            navigate("/products");
        } else {
            alert("訂購失敗！")
            navigate("/products");
        }
    }


    return (
        (user.userRole && myCart) ?
            <div>
                <div className="container mt-5 row justify-content-left col-md-4">
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label className="form-label">Customer Name：</label>
                            <input type="text" className="form-control" name="customerName" onChange={changeHandler} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Customer Phone：</label>
                            <input type="text" className="form-control" name="customerPhone" onChange={changeHandler} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Customer Email：</label>
                            <input type="email" className="form-control" name="customerEmail" onChange={changeHandler} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Customer Address：</label><br />
                            <textarea className="form-control" name="customerAddress" onChange={changeHandler} required />
                        </div>
                        <button type="submit" className="btn btn-primary" >Confirm Order</button>
                    </form>
                </div>
                <div className="position-relative">
                    {
                        myCart ? (
                            <table className="table table-stripe">
                                <thead>
                                    <tr>
                                        <th width="40%">Product Name</th><th style={{ textAlign: "center" }}>Product Image</th><th style={{ textAlign: "center" }}>Product Price</th><th style={{ textAlign: "center" }}>Quantity</th><th style={{ textAlign: "center" }}>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        myCart.map(p =>
                                            <tr key={p.productId}>
                                                <td width="40%"><Link to={`/products/${p.productId}`} className="nav-link">{p.productName}</Link></td>
                                                <td style={{ textAlign: "center" }}><img src={`http://localhost:8080/products/image?id=${p.productId}`} style={{ width: '50px', height: '50px' }}></img></td>
                                                <td style={{ textAlign: "center" }}>{p.productPrice}</td>
                                                <td style={{ textAlign: "center" }}>{p.quantity}</td>
                                                <td style={{ textAlign: "center" }}>{p.totalPricePerProduct.toFixed(2)}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th scope="row" colSpan={5} style={{ textAlign: "right" }}>Total Price : {totalPrice.toFixed(2)}</th>
                                    </tr>
                                </tfoot>
                            </table>

                        ) : (
                            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>No Items</div>
                        )
                    }
                </div>
            </div> :
            <div><p></p><h2 className="text-center">請登入後購買，謝謝。</h2></div>
    );
}

export default PurchaseForm;