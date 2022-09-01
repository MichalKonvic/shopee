import React, { useContext, useEffect,useState } from 'react'
import styles from '../../styles/AdminDashboard.module.css';
import { ModalContext } from '../../contexts/ModalContext';
import ProductItem from './Products/ProductItem';
const ProductsDashboard = () => {
    const [products, setProducts] = useState([]);
    const { addMessage} = useContext(ModalContext);
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetch('/api/products/list', { signal }).then(res => {
            if (res.ok) return res.json();
            Promise.reject(res);
        }).then(res => setProducts(res)).catch(err => {
            if (err.name === "AbortError") return;
            addMessage({
                type: 'ERR',
                message: "Cannot load products",
                hideAfter: 3000,
                title: "Load error"
            });
        })
    },[]);
    return (
        <div className={styles.productsDashboardContainer}>
            <h1 className={styles.productDashboardTitle}>Products</h1>
            <div className={styles.productsList}>
                {products.map(product => <ProductItem product={product} />)}
            </div>
        </div>
    )
}

export default ProductsDashboard