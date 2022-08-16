import React, { useContext } from 'react'
import ShoppingCartContext from '../contexts/ShoppingCartContext'
import ProductsList from '../components/productsManager/productsList';
import styles from '../styles/checkout.module.css'
import Head from 'next/head'
import EmptyCart from '../components/productsManager/EmptyCart';
const Checkout = () => {
    const { products, addProduct, removeProduct } = useContext(ShoppingCartContext);
    return (
        <>
            <Head>
                <title>Shopee - Checkout</title>
            </Head>
            <div className={styles.container + ' navbarFix'}>
                <h1 className={styles.checkoutTitle}>Checkout</h1>
                <p className={styles.cartCountText}>
                    {products.items.length} {products.items.length == 1 ? "product" : "products"} in cart
                </p>
                <div className={styles.cartTable}>
                    {products.items.length === 0 ? <EmptyCart /> : <>
                        <ProductsList />
                        <div className={styles.productManagerTotalContainer}>
                            <p>Total:</p>
                            <span>${products.items.reduce((sum, prod) => sum + (prod.quantity * prod.prize), 0)}</span>
                        </div>
                        <button className={styles.cartBuyButton}>Order now</button>
                    </>}
                </div>
            </div>
        </>
    )
}

export default Checkout