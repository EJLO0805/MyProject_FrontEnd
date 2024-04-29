import React, { useEffect, useState } from "react";
import OrderList from "./OrderList";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderListDetail = () => {
    const { orderId } = useParams();
    const [myOrderDetail, setMyOrderDetail] = useState(null);
    const [user, setUser] = useState(null);
    const loginUser = JSON.parse(localStorage.getItem("user"));
    const [myOrder, setMyOrder] = useState(null);
    const fetchMyOrderDetail = async () => {
        if (orderId != null) {
            try {
                await axios.get(`http://localhost:8080/myOrderList/order?orderId=${orderId}`, {
                    headers: {
                        "Authorization": user.userRole
                    }
                }).then(response =>
                    setMyOrderDetail(response.data)
                );
                await axios.get(`http://localhost:8080/myOrderList/${orderId}`, {
                    headers: {
                        "Authorization": user.userRole,
                    }
                }).then(response => {
                    setMyOrder(response.data);
                });
            } catch (error) {
                console.log("Fetch My Order Detail Error", error);
            }
        }
    }

    useEffect(() => {
        if (loginUser) {
            setUser(loginUser);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchMyOrderDetail();
        }
    }, [user]);


    return (
        (myOrderDetail && user && myOrder) ? <div>
            <div className="container mt-5 row justify-content-left col-md-12">
                <div className="mb-3">
                    <label className="form-label">Customer Name：</label>
                    <span>{myOrder.customerName}</span>
                </div>
                <div className="mb-3 position-relative">
                    <div style={{display:"inline-block"}}>
                        <label className="form-label">Order Id：</label>
                        <span>{myOrder.orderId}</span>
                    </div>
                    <div style={{display:"inline-block"}} className="position-absolute end-0">
                        <label className="form-label">Order Total Price：</label>
                        <span >{myOrder.orderTotalPrice}</span>
                    </div>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th></th><th style={{ textAlign: "center" }}>Product Name</th><th style={{ textAlign: "center" }}>Product Price</th><th style={{ textAlign: "center" }}>Order Quantity</th><th style={{ textAlign: "center" }}>Product Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        myOrderDetail.map(od =>
                            <tr key={od.orderDetailId}>
                                <td style={{ textAlign: "center" }}><img src={`http://localhost:8080/products/image?id=${od.product.productId}`} style={{ width: '50px', height: '50px' }}></img></td>
                                <td style={{ textAlign: "center" }}>{od.product.productName}</td>
                                <td style={{ textAlign: "center" }}>{od.product.productPrice}</td>
                                <td style={{ textAlign: "center" }}>{od.qtyPerProduct}</td>
                                <td style={{ textAlign: "center" }}>{od.totalPricePerProducts}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div> : <div>
            <p></p>
            <h2 className="text-center">請登入後查詢訂單</h2>
        </div>
    );

}

export default OrderListDetail;