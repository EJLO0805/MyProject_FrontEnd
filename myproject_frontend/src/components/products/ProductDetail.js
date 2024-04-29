import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const ProductDetail = ({ changeShopItems }) => {
    const items = localStorage.getItem("localCart");
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const { pid } = useParams();
    const [originQty, setQrginQty] = useState(0);
    const [purchaseProduct, setPurchaseProduct] = useState({
        productId: pid,
        productName: "",
        productPrice:0.0,
        quantity: 0,
        totalPricePerProduct: 0.0
    })

    const fetchProduct = async () => {
        try {
            await axios.get(`http://localhost:8080/products/${pid}`).then(response => {
                setProduct(response.data);
            })
        } catch (error) {
            console.log("Fetch Product By Id failed ", error);
        }
    };

    useEffect(() => {
        fetchProduct();
        if (items) {
            var arr = JSON.parse(items);
            const p = arr.find(i => i.productId === pid);
            if (p) {
                setPurchaseProduct(p);
                setQrginQty(p.quantity);
            }
        };

    }, [pid]);

    useEffect(()=>{
        if(product){
            setPurchaseProduct((old)=>({...old, productName:product.productName, productPrice:product.productPrice }));
        }
    },[product]);

    const buyItem = () => {
        if(purchaseProduct.quantity == 0){
            alert("購買數量不能為0");
            return;
        }
        var totalQuantity = localStorage.getItem("totalQuantity");
        if (items) {
            totalQuantity = parseInt(totalQuantity) + parseInt(purchaseProduct.quantity) - originQty;
            var arr = JSON.parse(items);
            arr = arr.filter(p => p.productId !== purchaseProduct.productId);
            arr.push(purchaseProduct);
            localStorage.setItem("totalQuantity", totalQuantity);
            localStorage.setItem("localCart", JSON.stringify(arr));
        } else {
            totalQuantity = purchaseProduct.quantity;
            localStorage.setItem("totalQuantity", totalQuantity);
            localStorage.setItem("localCart", JSON.stringify([purchaseProduct]));
        }
        alert("已加入購物車");
        console.log(totalQuantity);
        changeShopItems(totalQuantity);
        navigate("/products");
    }

    const valueChange = (event) => {
        const { name, value } = event.target;
        const totalPrice = parseFloat(product.productPrice) * parseFloat(value);
        setPurchaseProduct((preValue) => ({ ...preValue, [name]: parseInt(value), totalPricePerProduct: totalPrice }));
    }

    const clear = () => {
        localStorage.clear();
    }

    return (
        product ? (
            <div className="container position-relative">
                <p></p>
                <h4 className="text-center">{product.productName}</h4>
                <div key={product.productId} className="col-md-8 position-relative start-50 top-100 translate-middle-x">
                    <div className="card position-relative">
                        <img style={{ width: '60%', height: '600px' }} src={`http://localhost:8080/products/image?id=${pid}`} className="card-img-top position-relative start-50 translate-middle-x" ></img>
                        <div className="card-body">
                            <p></p>
                            <div className="card-text">{product.description}</div>
                            <p></p>
                            <div className="card-text position-relative">
                                <span>Price : {parseFloat(product.productPrice).toFixed(2)}</span>
                                <span className="position-absolute end-0 ">
                                    <button className="btn btn-primary btn-sm" onClick={buyItem}>Buy</button>&nbsp;&nbsp;
                                    <input type="number" min="0" max="100" name="quantity" value={purchaseProduct.quantity} onChange={valueChange} />
                                </span>
                            </div>

                        </div>
                    </div>
                    <p></p>
                </div>
                <button onClick={clear}>clear</button>
            </div>
        ) : (
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <p></p>
                No Data
            </div>
        )
    );

};

export default ProductDetail;