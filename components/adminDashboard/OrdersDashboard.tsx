import React, { useContext, useEffect,useState } from 'react'
import styles from '../../styles/AdminDashboard.module.css';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import OrderItem from './Orders/OrderItem';
const OrdersDashboard = () => {
    const [orders, setOrders] = useState([]);
    const { accessToken } = useContext(AuthContext);
    const { addMessage} = useContext(ModalContext);
    useEffect(() => {
        fetch('/api/orders/list', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            } }).then(res => {
            if (res.ok) return res.json();
            Promise.reject(res);
        }).then(res => setOrders(res)).catch(err => {
            if (err.name === "AbortError") return;
            addMessage({
                type: 'ERR',
                message: "Cannot load Orders",
                hideAfter: 3000,
                title: "Load error"
            });
        })
    },[]);
    return (
        <div className={styles.productsDashboardContainer}>
            <h1 className={styles.productDashboardTitle}>Orders</h1>
            <div className={styles.productsList}>
                {orders?.map(order => <OrderItem key={order._id} order={order} />)}
            </div>
        </div>
    )
}

export default OrdersDashboard