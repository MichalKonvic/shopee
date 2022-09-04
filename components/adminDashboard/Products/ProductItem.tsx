import React, { useContext } from 'react'
import useMounted from '../../../hooks/useMounted';
import { AuthContext } from '../../../contexts/AuthContext';
import { ProductI } from '../../../models/Product'
import styles from '../../../styles/AdminDashboard.module.css'
import { ModalContext } from '../../../contexts/ModalContext';
import { useRouter } from 'next/router';
const ProductItem = ({ product }: { product: ProductI }) => {
    const isMountedRef = useMounted();
    const router = useRouter();
    const { accessToken } = useContext(AuthContext);
    const { addMessage } = useContext(ModalContext);
    const deleteItem = (productId:string): void => {
        fetch(`/api/products/delete?id=${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            if (res.ok) return res.json();
            return Promise.reject(res);
        }).then(jsonData => {
            if (!isMountedRef.current) return;
            router.reload();
        }).catch(err => {
            if (!isMountedRef.current) return;
            addMessage({
                type: 'ERR',
                hideAfter: 3000,
                message: 'Something went wrong',
                title: 'Error'
            });
        })
    }
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
                <span className='material-icons' onClick={() => deleteItem(product._id)}>delete</span>
            </div>
        </div>
    )   
}

export default ProductItem