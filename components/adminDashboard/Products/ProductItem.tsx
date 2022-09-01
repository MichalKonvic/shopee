import React from 'react'
import { ProductI } from '../../../models/Product'
import styles from '../../../styles/AdminDashboard.module.css'
const ProductItem = ({ product }): { product: ProductI } => {
    return (
        <div className={styles.productItem} key={product._id}>
            <div>
                <label>Name</label>
                <h1>{product.name}</h1>
            </div>
            <div>
                <label>Price</label>
                <p>{product.prize}$</p>
            </div>
            <div>
                <label>In stock</label>
                <p>{product.inStock}</p>
            </div>
            <div className={styles.productItemRightButtons}>
                <span className='material-icons'>edit</span>
                <span className='material-icons'>delete</span>
            </div>
        </div>
    )   
}

export default ProductItem