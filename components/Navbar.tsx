import React from 'react'
import styles from './../styles/layout.module.css'
import Image from 'next/image'
import Link from 'next/link'
const Navbar = () => {


    const toggleCart = () => {

    }
    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.navbarLogo}>
                    <Image src="/textLogo.svg" alt="ShopeeLogo" width="100%" height="100%" layout="responsive" />
                </div>
                <ul className={styles.navbarList}>
                    <li>
                        <Link href="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/products">
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link href="/About">
                            About
                        </Link>
                    </li>
                </ul>
                <div className={styles.navbarButtons}>
                    <span className={styles.navbarCart + ' material-icons'} onClick={toggleCart}>shopping_cart</span>
                    <Link href="/login">
                        <span className={'material-icons'}>login</span>
                    </Link>
                </div>
            </div >
        </>
    )
}

export default Navbar