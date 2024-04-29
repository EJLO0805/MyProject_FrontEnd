import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const OrderList = ({ order, user, deliveredItems }) => {

    return (
        (order && user) ? <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>Order Id</th><th style={{ textAlign: "center" }}>Total Price</th><th style={{ textAlign: "center" }}>Order date</th><th style={{ textAlign: "center" }}>Is Delivery</th>
                        {
                            ((user.userRole == "ADMIN" || user.userRole == "EMPLOYEE")&&deliveredItems) ? <th style={{ textAlign: "center" }}>
                                Action
                            </th> : null
                        }
                    </tr>
                </thead>
                <tbody>
                    {

                        order.map(o =>
                            <tr key={o.orderId}>
                                <td style={{ textAlign: "center" }}><Link to={`/myOrder/${o.orderId}`} className="nav-link">{o.orderId}</Link></td>
                                <td style={{ textAlign: "center" }}>{o.orderTotalPrice}</td>
                                <td style={{ textAlign: "center" }}>{new Date(o.orderDate).toLocaleString()}</td>
                                <td style={{ textAlign: "center" }}>{o.delivered? "已寄送":"商品處理中"}</td>
                                {
                                    ((user.userRole == "ADMIN" || user.userRole == "EMPLOYEE")&&deliveredItems) ? <th style={{ textAlign: "center" }}>
                                        <button className="btn btn-secondary" onClick={()=>{deliveredItems(o.orderId,user)}} disabled={o.delivered? true:false}>Delivery</button>
                                    </th> : null
                                }
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

export default OrderList;