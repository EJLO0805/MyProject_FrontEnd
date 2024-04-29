import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const ShoppingCart = ({ changeShopItems, isLogin }) => {
    const navigate = useNavigate();
    const [myCart, setMyCart] = useState([]);
    const localCart = localStorage.getItem("localCart");
    const [totalPrice, settotalPrice] = useState(0);

    useEffect(() => {
        if (localCart) {
            setMyCart(JSON.parse(localCart));
        }
    }, [localCart]);

    useEffect(()=>{
        if(myCart){
            settotalPrice(myCart.reduce((preValue,current)=> preValue+current.totalPricePerProduct ,0.0))
        }
    },[myCart]);

    const purchaseItems = () => {
        isLogin ? navigate("/purchaseForm", {state:totalPrice}) : navigate("/login");
    }

    const changeQtyHandler = (id, event) => {
        const { name, value } = event.target;
        var totalQuantity = 0;
        const newCart = myCart.map(p => {
            totalQuantity += p.productId === id ? parseInt(value) : p.quantity;
            if (p.productId === id) {
                return { ...p, [name]: parseInt(value), totalPricePerProduct: (p.productPrice * value) };
            }
            return p;
        });
        setMyCart(newCart);
        localStorage.setItem("localCart", JSON.stringify(newCart));
        localStorage.setItem("totalQuantity", totalQuantity);
        changeShopItems(totalQuantity);
    }

    const deleteItemHandler = (id) => {
        const newCart = myCart.filter(p => p.productId !== id);
        localStorage.setItem("localCart", JSON.stringify(newCart));
        setMyCart(newCart);
        const totalQuantity = newCart.reduce((preValue, currentValue) => preValue + currentValue.quantity, 0);
        localStorage.setItem("totalQuantity", totalQuantity);
        changeShopItems(totalQuantity);
    }

    return (
        <div className="position-relative">
            <p></p>
            <h3 className="text-center">My Shoppin Cart</h3>
            {
                (localCart && (totalPrice !== 0)) ? (
                    <table className="table table-stripe">
                        <thead>
                            <tr>
                                <th width="40%">Product Name</th><th style={{ textAlign: "center" }}>Product Image</th><th style={{ textAlign: "center" }}>Product Price</th><th style={{ textAlign: "center" }}>Quantity</th><th style={{ textAlign: "center" }}>Total Price</th><th style={{ textAlign: "center" }}>Action</th>
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
                                        <td style={{ textAlign: "center" }}>
                                            <input type="number" name="quantity" value={p.quantity} min={1} max={100} onChange={(event) => { changeQtyHandler(p.productId, event) }} /> &nbsp;&nbsp;
                                            <button className="btn btn-danger" onClick={() => { deleteItemHandler(p.productId) }}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th scope="row" colSpan={5} style={{ textAlign: "right" }}>Total Price : {totalPrice.toFixed(2)}</th>
                                <td><button className="btn btn-primary" style={{marginLeft:"100px"}} onClick={purchaseItems}>Confirm</button></td>
                            </tr>
                        </tfoot>
                    </table>

                ) : (
                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>No Items</div>
                )
            }
        </div>

    );
};

export default ShoppingCart;