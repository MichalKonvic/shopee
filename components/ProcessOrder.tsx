import React, { useContext, useEffect, useState } from 'react'
import ShoppingCartContext from '../contexts/ShoppingCartContext'
import styles from '../styles/checkout.module.css'
const ProcessOrder = () => {
    const { orderState } = useContext(ShoppingCartContext);
    //@ts-ignore Cuz vscode is mismatchin orderState type
    if (orderState !== "PROCESSING") return null;
    if (orderState === "FAILED") return (
        <div className={styles.processOrderContainer}>
            <p>Failed</p>
            {/*TODO add error animation  */}
        </div>
    )
    if (orderState === "COMPLETED") return (
        <div className={styles.processOrderContainer}>
            <p>Ordered</p>
            {/*TODO add checkmark animation  */}
        </div>
    )
    return (
        <div
            className={styles.processOrderContainer}
        >
            <p>Processing</p>
            <div className={styles.processOrderLoader}></div>
        </div>
    );
}

export default ProcessOrder