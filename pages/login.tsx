import React from 'react'
import Layout from '../components/Layout'
import styles from '../styles/Login.module.css'
import Head from 'next/head'
import Link from 'next/link'
const login = () => {
    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }
    return (
        <>
            <Head>
                <title>Shopee - Login</title>
                <meta name="description" content="Shopee shop" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <div className={styles.container}>
                <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
                    <h1>Login</h1>
                    <input type="email" name="email" id="email" placeholder='Email' />
                    <input type="password" name="password" id="password" placeholder='Password' />
                    <input type="submit" value="Login" className={styles.submitButton} id='submit' />
                    <Link href="/register">
                        <a>
                            Don{"'"}t have an account?
                        </a>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default login