import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductForm = () => {
    const [product, setProduct] = useState({
        productId: 0,
        productName: "",
        productPrice: 0.00,
        category: "",
        image: null,
        description: ""
    });
    const productId = useLocation().state;
    const loginUser = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState({});
    const [image, setImage] = useState();
    const navigate = useNavigate();
    const fetchProductById = async () => {
        try {
            await axios.get(`http://localhost:8080/products/${productId}`).then(response => {
                setProduct({
                    productId:response.data.productId,
                    productName: response.data.productName,
                    productPrice: response.data.productPrice,
                    category: response.data.category,
                    image: null,
                    description: response.data.description
                });
            });
        } catch (error) {
            console.log("Fetch Product By Id failed", error);
        }
    }

    useEffect(() => {
        if (productId) {
            fetchProductById();
        }
    }, [productId]);

    useEffect(() => {
        if (loginUser) {
            setUser(loginUser);
        }
    }, []);

    const changeHandler = async (event) => {
        var { name, value } = event.target;
        var file = null;
        var blob = null;
        var bytes = null;
        if (name === "image") {
            file = event.target.files[0];
            try {
                blob = await convertImageToByte(file);
                setImage(URL.createObjectURL(file));
                bytes = Array.from(blob);
            } catch (error) {
                console.log("convert error", error);
            }
        }
        setProduct((preValue) => ({ ...preValue, [name]: (name === "image") ? bytes : value }));
    };

    const convertImageToByte = (file) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        const id = parseInt(product.productId);
        const price = parseFloat(product.productPrice);
        setProduct((preValue) => ({ ...preValue, productId: id, productPrice: price }));
        if (productId) {
            setProduct((preValue)=>({...preValue,productId:productId}));
            try {
                console.log(product);
                await axios.put(`http://localhost:8080/products/${productId}`,product,{
                    headers:{
                        "Authorization": user.userRole
                    }
                }).then(response => {
                    if(response.status === 200){
                        navigate("/productTable");
                    }else{
                        alert("修改商品錯誤。");
                    }
                });
            }catch (error){
                console.log("Update Product failed", error);
            }
        } else {
            try {
                await axios.post("http://localhost:8080/products/addnewproduct", product, {
                    headers: {
                        "Authorization": user.userRole
                    }
                }).then(response => {
                    if (response.status === 200) {
                        navigate("/productTable");
                    }else{
                        alert("修改商品錯誤。");
                    }
                });
            } catch (error) {
                console.log("Inser New Product failed", error);
            }
        }
    };

    return (
        (user.userRole === "ADMIN" || user.userRole === "EMPLOYEE") ? <div className="container mt-5 row justify-content-left col-md-5">
            <form onSubmit={submitHandler} encType='multipart/form-data'>
                <div className="mb-3">
                    <label className="form-label">Product Id</label>&nbsp;
                    <input className="form-control" type="text" name="productId" value={product.productId} disabled={productId ? true : false} onChange={changeHandler} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Product Name</label>&nbsp;
                    <input className="form-control" type="text" name="productName" value={product.productName} onChange={changeHandler} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Product Price</label>&nbsp;
                    <input className="form-control" type="text" name="productPrice" value={product.productPrice} onChange={changeHandler} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Product Category</label>&nbsp;
                    <input className="form-control" type="text" name="category" value={product.category} onChange={changeHandler} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image</label><br />
                    <img src={image ? image : `http://localhost:8080/products/image?id=${productId}`} style={{ width: "150px", height: "150px" }}></img>
                    <p></p>
                    <input id="upload" type="file" name="image" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={changeHandler} hidden /><label htmlFor="upload" className="btn btn-primary">Upload Image</label>
                </div>
                <div className="mb-3">
                    <label className="form-label">Product Description</label>&nbsp;
                    <textarea className="form-control" name="description" value={product.description} style={{ height: "200px" }} onChange={changeHandler} />
                </div>
                <button className="btn btn-primary" type="submit">儲存</button>
                <p></p>
            </form>
        </div> : <div>
            <p></p>
            <h2 className="text-center">權限不足，請登入後再操作。</h2>
        </div>
    );


}

export default ProductForm;