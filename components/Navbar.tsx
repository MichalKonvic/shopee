import React, { useEffect, useContext, useState } from 'react'
import styles from './../styles/layout.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
const Navbar = () => {
    const router = useRouter();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [isMenuOpen, openMenu] = useState(false);
    useEffect(() => {
        const handleRouteChange = () => {
            openMenu(false);
        }
        router.events.on("routeChangeComplete", handleRouteChange,);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleCart = () => {

    }
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
                    <span className={styles.navbarCart + ' material-icons'} onClick={toggleCart}>shopping_cart</span>
                    {!isLoggedIn ? <Link href="/login">
                        <span className={'material-icons'}>login</span>
                    </Link> :
                        <span onClick={() => logout()} className='material-icons'>logout</span>
                    }
                </div>
            </div >
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
                                    <p>email@domain.com</p>
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
                </div>
            }
        </>
    )
}

export default Navbar