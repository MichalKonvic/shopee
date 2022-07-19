import React from 'react'
import styles from '../styles/AdminDashboard.module.css'
import Link from 'next/link'
const DashboardNavbar = () => {
    return (
        <div className={styles.navbar}>
            <h3>Main</h3>
            <ul className={styles.navbarList}>
                <li>
                    <Link href="/admin/dashboard">
                        <span className='material-icons'>speed</span>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default DashboardNavbar