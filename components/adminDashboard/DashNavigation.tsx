import React from 'react'
import styles from '../../styles/AdminDashboard.module.css'
const DashNavigation = ({ activeTab, activateTab }) => {
    return (
        <div className={styles.DashNavigation}>
            <h1 className={styles.DashTitle}>Manage</h1>
            <ul className={styles.navigationList}>
                <li onClick={() => activateTab("PRODUCTS")} className={activeTab === "PRODUCTS" && styles.activeTab}>Products</li>
                <li onClick={() => activateTab("USERS")} className={activeTab === "USERS" && styles.activeTab}>Users</li>
                <li onClick={() => activateTab("ORDERS")} className={activeTab === "ORDERS" && styles.activeTab}>Orders</li>
            </ul>
        </div>
    )
}

export default DashNavigation