import React from 'react'
import styles from './../styles/layout.module.css'
import Image from 'next/image'
const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerLogoContainer}>
                    <Image src="/textLogo.svg" alt='Shopee' width="200" height="100" layout="fixed" />
            </div>
            <div className={styles.footerListsContainer}>
                <ul>
                    <h1>Explore</h1>
                    <li>Home</li>
                    <li>Products</li>
                    <li>About</li>
                </ul>
                <ul>
                    <h1>Products</h1>
                    <li>New</li>
                    <li>Trending</li>
                    <li>Sales</li>
                </ul>
                <ul>
                    <h1>Help</h1>
                    <li>Refund</li>
                    <li>Service</li>
                    <li>Chat</li>
                </ul>
            </div>
            <div className={styles.footerCopyrightContainer}>
                <hr className={styles.footerLine} />
                <h3 className={styles.footerCopyright}>Copyright Shopee {new Date().getFullYear().toString()}</h3>
            </div>
        </div>
    )
}

export default Footer