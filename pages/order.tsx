import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import ProcessOrder from '../components/ProcessOrder';
import { ModalContext } from '../contexts/ModalContext';
import ShoppingCartContext from '../contexts/ShoppingCartContext';
import { OrderI } from '../models/Order';
import styles from '../styles/order.module.css'

interface ItemI {
    id: string;
    title: string;
    quantity: number;
    prize: number;
}

const Order = () => {
    const router = useRouter();
    const { order_id } = router.query;
    const [orderData, setOrder] = useState<OrderI>({
        state: "PAYMENT_REQUIRED",
        items: [],
        sessionId: "",
        createdAt: "",
        sessionExpirationAt: ""
    });
    const { addMessage } = useContext(ModalContext);
    const { orderState } = useContext(ShoppingCartContext);
    useEffect(() => {
        if (!order_id) {
            return;
        };
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(`/api/checkout/check-session-state?orderId=${order_id}`, {
            method: 'GET',
            signal
        }).then(res => {
            if (res.ok) return res.json();
            Promise.reject(res);
        }).then(res => {
            setOrder(res);
        }).catch(err => {
            if (err.name === "AbortError") return;
            console.log(err);
            addMessage({
                title: "Error",
                message: "Cannot get information about your order. Please contact support.",
                type: "ERR",
                hideAfter: 5000
            });
        });
        return () => {
            controller.abort();
        }
    }, [order_id]);
    return (
        <div className={styles.container + ' navbarFix'}>
            <div className={styles.orderInfo}>
                <h1>Your order:</h1>
                <h2>{order_id}</h2>
                <span className={styles.divider}></span>
                {orderData.state === "PAID" && <div>
                    <span className={styles.orderInfoField}>Order State: Paid</span>
                    <br />
                    <span className={styles.orderInfoField}>Shipping Adress: {orderData.address}</span>
                    <br />
                    <span className={styles.orderInfoField}>Total: ${orderData.total}</span>
                    <p className={styles.disclaimer}>
                        In case of problems, please contact our {" "}
                        <Link href="/customerService">
                            <span className={styles.customerServiceUrl}>Customer Service</span>
                        </Link>
                    </p>
                </div>
                }
                {orderData.state === "PAYMENT_REQUIRED" && <div>
                    <p className={styles.orderStateText}>We still haven&apos;t recieved your payment.
                        <br />
                        This process usually takes up to 2 minutes.
                        <br />
                    </p>
                    <p className={styles.disclaimer}>
                        If this page doesn&apos;t change after 30 minutes, please contact our {" "}
                        <Link href="/customerService">
                            <span className={styles.customerServiceUrl}>Customer Service</span>
                        </Link>
                    </p>
                </div>
                }
                <span className={styles.divider}></span>
                <h2>Thank you for your order on Shopee.</h2>
            </div>
        </div >
    )
}

export default Order