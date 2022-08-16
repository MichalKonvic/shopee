import React, { useEffect, useContext, useState, useRef } from 'react'
import styles from './../styles/layout.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import ShoppingCartContext from '../contexts/ShoppingCartContext'
const Navbar = () => {
    const router = useRouter();
    const { products, removeProduct } = useContext(ShoppingCartContext);
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const [isMenuOpen, openMenu] = useState(false);
    const [isProfileOpen, toggleProfileMenu] = useState(false);
    const profileMenubButtonRef = useRef(null);
    const profileMenuRef = useRef(null);
    useEffect(() => {
        if (isLoggedIn) return;
        if (isProfileOpen) toggleProfileMenu(false);
    }, [isLoggedIn]);
    useEffect(() => {
        const handleRouteChange = () => {
            openMenu(false);
            toggleProfileMenu(false);
        }
        router.events.on("routeChangeComplete", handleRouteChange,);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const onClickOutside = () => {
        toggleProfileMenu(false);
    }
    useEffect(() => {
        if (isProfileOpen) {
            const handleClickOutside = (event: any) => {
                if (profileMenubButtonRef.current && !profileMenubButtonRef.current.contains(event.target) && profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                    onClickOutside && onClickOutside();
                }
            }
            document.addEventListener('click', handleClickOutside, true);
            return () => {
                document.removeEventListener('click', handleClickOutside, true);
            }
        }
    }, [onClickOutside]);
    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.navbarLogo}>
                    <Image src="/textLogo.svg" alt="ShopeeLogo" width="100%" height="100%" layout="responsive" />
                </div>
                <div className={isMenuOpen ? styles.navbarBurgerActive : styles.navbarBurger} onClick={() => openMenu(!isMenuOpen)}>
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
                    <div className={styles.navbarCartContainer}>
                        <Link href="/Checkout">
                            <span className={styles.navbarCart + ' material-icons'} data-count={products.items.length}>shopping_cart</span>
                        </Link>
                        <p>{products.items.length > 99 ? "99+" : products.items.length}</p>
                    </div>
                    {!isLoggedIn ? <Link href="/login">
                        <span className={'material-icons'}>login</span>
                    </Link> :
                        <span ref={profileMenubButtonRef} onClick={() => toggleProfileMenu(!isProfileOpen)} className='material-icons'>person</span>
                    }
                </div>
            </div >
            {
                isProfileOpen && <div ref={profileMenuRef} className={styles.navbarProfileMenu}>
                    <div className={styles.navbarMenuBarProfileContainer}>
                        <span className='material-icons'>person</span>
                        <div>
                            <p>{user.email}</p>
                            <Link href="/profile">
                                <button>Show Profile</button>
                            </Link>
                        </div>
                    </div>
                    <button className={styles.navbarLogoutButton} onClick={() => logout()}>Logout</button>
                </div>
            }
            {
                isMenuOpen && <div
                    className={styles.navbarMenuBar}>
                    {!isLoggedIn ? <Link href="/login">
                        <button className={styles.navbarLogoutButton}>Login</button>
                    </Link> :
                        <>
                            <div className={styles.navbarMenuBarProfileContainer}>
                                <span className='material-icons'>person</span>
                                <div>
                                    <p>{user.email}</p>
                                    <Link href="/profile">
                                        <button>Show Profile</button>
                                    </Link>
                                </div>
                            </div>
                            <button className={styles.navbarLogoutButton} onClick={() => logout()}>Logout</button>
                        </>
                    }
                    <span className={styles.divider}></span>
                    <ul className={styles.navbarMenuBarList} >
                        <Link href="/">
                            <li>
                                Home
                            </li>
                        </Link>
                        <Link href="/products">
                            <li>
                                Products
                            </li>
                        </Link>
                        <Link href="/About">
                            <li>
                                About
                            </li>
                        </Link>
                    </ul>
                    {products.items.length > 0 && <div className={styles.navBarMobileCartContainer}>
                        <h1 className={styles.navBarCartTitle}>Cart</h1>
                        <ul className={styles.navbarMobileCartList}>
                            {products.items.map((product) => {
                                return (<li key={product.id}>
                                    <div className={styles.navbarCartProductHeader}>
                                        <p>{product.quantity}x</p>
                                        <Link href={`/product/${product.id}`}>
                                            <h1>{product.title}</h1>
                                        </Link>
                                    </div>
                                    <span className={styles.navbarCartProductPrize}>${product.prize}</span>
                                    <div className={styles.navbarCartProductRemoveContainer}>
                                        <span onClick={() => removeProduct(product.id)} className={styles.navbarCartProductRemove + ' material-icons'}>delete</span>
                                    </div>
                                </li>)
                            })}
                        </ul>
                        <div className={styles.navbarCartTotalContainer}>
                            <p>Total</p>
                            <p>${products.items.reduce((sum, prod) => sum + (prod.quantity * prod.prize), 0)}</p>
                        </div>
                        <Link href="/Checkout">
                            <button className={styles.navbarCheckoutButton}>Checkout</button>
                        </Link>
                    </div>
                    }
                </div>
            }
        </>
    )
}

export default Navbar