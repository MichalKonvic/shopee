import React from 'react'
import styles from '../../styles/checkout.module.css'
import Link from 'next/link'
const EmptyCart = () => {
    return (
        <div>
            <h1 className={styles.emptyTitle}>It's empty 😭</h1>
            <Link href="/RandomProduct">
                <p className={styles.linkButton}>Show me random product</p>
            </Link>
        </div>
    )
}

export default EmptyCart