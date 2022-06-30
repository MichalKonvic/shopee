import React from 'react'
import styles from './../styles/layout.module.css'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <div className={styles.container}>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}

export default Layout