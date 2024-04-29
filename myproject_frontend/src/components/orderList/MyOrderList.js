import { useEffect, useState } from "react";
import OrderList from "./OrderList";
import axios from "axios";

const MyOrderList = () => {
    const [myOrder, setMyOrder] = useState(null);
    const [user, setUser] = useState(null);
    const loginUser = JSON.parse(localStorage.getItem("user"));
    const fetchMyOrderList = async () => {
        try {
            await axios.post("http://localhost:8080/myOrderList", user.userEmail, {
                headers: {
                    "Authorization": user.userRole,
                    "Content-Type": "text/plain"
                }
            }).then(response => {
                setMyOrder(response.data);
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
            fetchMyOrderList();
        }
    }, [user]);

    return (<OrderList order={myOrder} user={user} />);
}

export default MyOrderList;