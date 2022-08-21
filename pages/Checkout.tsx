import React, { useContext, useEffect } from 'react'
import ShoppingCartContext from '../contexts/ShoppingCartContext'
import ProductsList from '../components/productsManager/productsList';
import styles from '../styles/checkout.module.css'
import Head from 'next/head'
import EmptyCart from '../components/productsManager/EmptyCart';
import AdressForm from '../components/AdressForm';
import ProcessOrder from '../components/ProcessOrder';
import { ModalContext } from '../contexts/ModalContext';
const Checkout = () => {
    const { products, processOrder, orderState } = useContext(ShoppingCartContext);
    const { addMessage } = useContext(ModalContext);
    useEffect(() => {
        // @ts-ignore
        if (orderState !== "FAILED") return;
        addMessage({
            title: "Error",
            message: "Cannot process order",
            type: "ERR",
            hideAfter: 3500
        });
    }, [orderState]);
    const handleOrder = () => {
        processOrder();
    }
    return (
        <>
            <Head>
                <title>Shopee - Checkout</title>
            </Head>
            <ProcessOrder />
            <div className={styles.container + ' navbarFix'}>
                <h1 className={styles.checkoutTitle}>Checkout</h1>
                <p className={styles.cartCountText}>
                    {products.items.length} {products.items.length == 1 ? "product" : "products"} in cart
                </p>
                <div className={styles.cartTable}>
                    {products.items.length === 0 ? <EmptyCart /> : <>
                        <AdressForm />
                        <span className={styles.divider}></span>
                        <ProductsList />
                        <div className={styles.productManagerTotalContainer}>
                            <p>Total:</p>
                            <span>${products.items.reduce((sum, prod) => sum + (prod.quantity * prod.prize), 0)}</span>
                        </div>
                        <button className={styles.cartBuyButton} onClick={handleOrder}>Order now</button>
                    </>}
                </div>
            </div>
        </>
    )
}

export default Checkout