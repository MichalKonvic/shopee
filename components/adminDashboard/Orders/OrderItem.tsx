import { OrderI } from '../../../models/Order'
import React, { useContext } from 'react'
import useMounted from '../../../hooks/useMounted';
import { AuthContext } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminDashboard.module.css'
import { ModalContext } from '../../../contexts/ModalContext';
import { useRouter } from 'next/router';
const OrderItem = ({order}: {order:OrderI}) => {
  const isMountedRef = useMounted();
    const router = useRouter();
    const { accessToken } = useContext(AuthContext);
    const { addMessage } = useContext(ModalContext);
    const deleteItem = (): void => {
        fetch(`/api/orders/delete?id=${order._id}`, {
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
        <div className={styles.productItem} key={order._id}>
            <div>
                <label>Id</label>
                <h1>{order._id}</h1>
            </div>
            <div>
                <label>Total</label>
                <p>{order.total}$</p>
            </div>
            <div>
                <label>State</label>
                <p>{order.state}</p>
            </div>
            <div className={styles.productItemRightButtons}>
                <span className='material-icons' onClick={deleteItem}>delete</span>
            </div>
        </div>
    )   
}

export default OrderItem