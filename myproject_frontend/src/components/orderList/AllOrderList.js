import { useEffect, useState } from "react";
import OrderList from "./OrderList";
import axios from "axios";

const AllOrderList = () => {
    const [allOrder, setAllOrder] = useState(null);
    const [user, setUser] = useState(null);
    const loginUser = JSON.parse(localStorage.getItem("user"));

    const fetchAllOrderList = async () => {
        try {
            await axios.get("http://localhost:8080/allOrderList", {
                headers: {
                    "Authorization": user.userRole
                }
            }).then(response => {
                setAllOrder(response.data);
            });
        } catch (error) {
            console.log("Fetch My Order Error", error);
        }
    }

    useEffect(() => {
        if (loginUser) {
            setUser(loginUser);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchAllOrderList();
        }
    }, [user]);


    const deliveredItems = async (orderId,user) => {
        const confirmDelivery = window.confirm("確定是否寄送？");
        if (confirmDelivery) {
            try {
                await axios.put(`http://localhost:8080/allOrderList?orderId=${orderId}`,null,{
                    headers:{
                        "Authorization":user.userRole
                    }
                }).then(response => {
                    const updateOrder = allOrder.map(o => {
                        if(o.orderId == response.data.orderId){
                            return response.data;
                        }
                        return o;
                    });
                    setAllOrder(updateOrder);
                });
            } catch (error) {
                console.log("update delivery error",error);
            }

        }
    }

    return (<OrderList order={allOrder} user={user} deliveredItems={deliveredItems} />);

}

export default AllOrderList;
