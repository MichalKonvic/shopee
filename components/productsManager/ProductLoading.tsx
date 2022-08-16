import React from 'react'
import styles from '../../styles/checkout.module.css'
const ProductLoading = () => {
    return (
        <div className={styles.productManagerLoading}>
            <span className={styles.spinner}></span>
        </div>
    )
}

export default ProductLoading