import React, { useContext, useEffect, useState } from 'react'
import ShoppingCartContext from '../contexts/ShoppingCartContext'
import styles from '../styles/checkout.module.css'
const ProcessOrder = () => {
    const { orderState } = useContext(ShoppingCartContext);
    //@ts-ignore Cuz vscode is mismatchin orderState type
    if (orderState !== "PROCESSING") return null;
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