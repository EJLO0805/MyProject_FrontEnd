import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductTableForEmp = () => {

    const [allProduct, setAllProduct] = useState(null);
    const [user, setUser] = useState(null);
    const loginUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const fetchAllProduct = async () => {
        try {
            await axios.get("http://localhost:8080/products").then(reposnse =>
                setAllProduct(reposnse.data)
            );
        } catch (error) {
            console("Fetch All Product failed", error);
        }
    }

    useEffect(() => {
        if (loginUser) {
            setUser(loginUser);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchAllProduct();
        }
    }, [user]);

    const insertProduct = (productId) => {
        navigate("/productForm",{state:productId});
    }

    const deleteProduct = async(productId) => {
        try {
            await axios.delete(`http://localhost:8080/products/${productId}`,{
                headers:{
                    "Authorization":user.userRole
                }
            }).then(response=>{
                if(response.status === 200){
                    const newProduct = allProduct.filter(p => p.productId != productId);
                    setAllProduct(newProduct);
                }else{
                    alert("權限不足");
                }
            });
        } catch (error) {
            console.log("Delete Product Falied Error",error);
        }
    }

    return (
        (allProduct && (user.userRole == "ADMIN" || user.userRole == "EMPLOYEE")) ?
            <div>
                <p></p>
                <div className="position-relative" style={{ textAlign: "center" }}>
                    <span >Product Manage Page</span>
                    <button className="btn btn-primary btn-sm position-absolute transaction end-0" onClick={()=>{insertProduct(0)}}>Add New Product</button>
                </div>
                <p></p>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th width="10%" style={{ textAlign: "center" }}>Product Id</th><th width="10%" style={{ textAlign: "center" }}>Image</th><th style={{ textAlign: "center" }}>Name</th><th width="10%" style={{ textAlign: "center" }}>Price</th><th width="15%" style={{ textAlign: "center" }}>Category</th><th width="15%" style={{ textAlign: "center" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allProduct.map(p =>
                                <tr key={p.productId}>
                                    <td style={{ textAlign: "center" }}>{p.productId}</td>
                                    <td style={{ textAlign: "center" }}><img src={`http://localhost:8080/products/image?id=${p.productId}`} style={{ width: '50px', height: '50px' }}></img></td>
                                    <td >{p.productName}</td>
                                    <td style={{ textAlign: "center" }}>{p.productPrice}</td>
                                    <td style={{ textAlign: "center" }}>{p.category}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button className="btn btn-warning btn-sm" onClick={()=>{insertProduct(p.productId)}}>Update</button> &nbsp;&nbsp;
                                        <button className="btn btn-danger btn-sm" onClick={()=>{deleteProduct(p.productId)}}>Delete</button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div> : <div>
                <p></p>
                <h2>權限不足，請登入再操作</h2>
            </div>
    );

}

export default ProductTableForEmp;