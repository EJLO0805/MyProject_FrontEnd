import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const productsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    var totalPage = 0;
    const indexOfFirstProduct = currentPage * productsPerPage - productsPerPage;
    const indexOfLastProduct = currentPage * productsPerPage;
    var currentProducts = [];
    var pageNumber = []

    const fetchProduct = async () => {
        try {
            await axios.get("http://localhost:8080/products").then((response) => {
                setProducts(response.data);
            });
        } catch (error) {
            console.log("Fetch Product Error", error);
        }
    }

    useEffect(() => { fetchProduct() }, []);



    if (products) {
        totalPage = Math.ceil(products.length / productsPerPage);
        currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
        for (var i = 1; i <= totalPage; i++) {
            pageNumber.push(i);
        }
    }

    return (
        products.length > 0 ? (
            <div className="container position-relative">
                <p></p>
                <h3 className="text-center">Product List</h3>
                <div className="row">
                    {
                        currentProducts.map(p =>
                            <div key={p.productId} className="col-md-3">
                                <div className="card position-relative">
                                    <img style={{ width: '80%', height: '280px' }} src={`http://localhost:8080/products/image?id=${p.productId}`} className="card-img-top position-relative start-50 translate-middle-x" ></img>
                                    <div className="card-body">
                                        <Link to={`/products/${p.productId}`} className="nav-link">
                                            <div className="card-title">{p.productName}</div>
                                        </Link>
                                        <div className="card-text">Price : {p.productPrice.toFixed(2)}</div>
                                    </div>
                                </div>
                                <p></p>
                            </div>
                        )
                    }
                </div>
                <p></p>
                <ul className="pagination position-absolute top-80 start-50 translate-middle-x">
                    {
                        pageNumber.map(n =>
                            <li key={n} className={n === currentPage ? "active" : ""}>
                                <a className="page-link" onClick={() => { setCurrentPage(n) }}>{n}</a>
                            </li>
                        )
                    }
                </ul>
            </div>
        ) : (
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <p></p>
                No Data
            </div>
        )
    );

};

export default Products;