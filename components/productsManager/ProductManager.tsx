import React, { useEffect, useState, useContext } from 'react'
import { ModalContext } from '../../contexts/ModalContext';
import Link from 'next/link';
import ShoppingCartContext from '../../contexts/ShoppingCartContext';
import { productI } from '../../hooks/useShopping'
import styles from '../../styles/checkout.module.css'
import ProductLoading from './ProductLoading';
const ProductManager = ({ productData }: { productData: productI }) => {
    const [isLoading, setLoading] = useState(true);
    const { addMessage } = useContext(ModalContext);
    const [serverData, setServerData] = useState({
        _id: "",
        prize: 0,
        inStock: 0,
        title: ""
    });
    const { removeProduct, updateProduct } = useContext(ShoppingCartContext);
    const handleProductRemove = () => {
        removeProduct(productData.id);
    }
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(`/api/products/${productData.id}`, {
            method: "GET",
            signal
        }).then(res => res.json()).then(res => {
            setServerData(res)
            setLoading(false);
        }).catch(err => {
            if (err.name === "AbortError") {
                console.log("Fetch aborted");
            } else {
                addMessage({
                    title: "Error",
                    message: "Cannot load data from server",
                    type: "ERR",
                    hideAfter: 2500
                })
            }
        });
        return () => {
            controller.abort();
        }
    }, []);

    useEffect(() => {
        if (isLoading) return;
        if (productData.quantity > serverData.inStock) {
            addMessage({
                hideAfter: 2500,
                title: "Out of stock",
                type: "WARN",
                message: `We have only ${serverData.inStock} units of ${productData.title}`
            })
            updateProduct({
                ...productData,
                quantity: serverData.inStock
            });
            return;
        }
    }, [isLoading]);

    const handleQuantityChange = (e) => {
        if (+e.target?.value < 0) {
            return;
        }
        if (+e.target?.value > serverData.inStock) {
            updateProduct({
                ...productData,
                quantity: serverData.inStock
            });
            addMessage({
                hideAfter: 2500,
                title: "Out of stock",
                type: "WARN",
                message: "Cannot buy more units"
            })
            return;
        }
        updateProduct({
            ...productData,
            quantity: +e.target?.value
        })
    }
    return (
        isLoading ? <ProductLoading /> : <div className={styles.ProductManagerContainer}>
            <div className={styles.productManagerInputContainer}>
                <input className={styles.productManagerInput} type="number" value={productData.quantity} onChange={handleQuantityChange} name="quantity" id="quantity" />
                <p className={styles.productManagerPrizeTag}>x <span>${productData.prize}</span></p>
            </div>
            <Link href={`/product/${productData.id}`}>
                <p className={styles.productManagerTitle}>{productData.title}</p>
            </Link>
            <span onClick={handleProductRemove} className={styles.productManagerDelete + ' material-icons'}>delete</span>
        </div>
    )
}

export default ProductManager