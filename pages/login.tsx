import React, { useState } from 'react'
import styles from '../styles/Login.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { sessionManager } from '../lib/storageManager'
import { useRouter } from 'next/router'
const Login = () => {
    const [loginState, setLoginState] = useState("");
    const router = useRouter();
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginState("");
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (!validateEmail(email)) {
            setLoginState("invalid-email");
            return;
        }
        if (!password) {
            setLoginState("invalid-password");
            return;
        }
        fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        }).then(async response => {
            if (response.status !== 200) {
                setLoginState("invalid-inputs");
                return;
            }
            const { data: accessToken } = await response.json();
            sessionManager("SHOPEE", {
                accessToken
            });
            router.replace("/");
        }).catch(_error => {
            console.log(_error);
            setLoginState("ERROR");
        });
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
                    <input className={loginState === "invalid-email" ? "invalid" : ""} type="email" name="email" id="email" placeholder='Email' />
                    <input className={loginState === "invalid-password" ? "invalid" : ""} type="password" name="password" id="password" placeholder='Password' />
                    {loginState != "" && <p>
                        <span className='material-icons'>error</span>
                        {loginState === "invalid-email" && "Enter valid email adress"}
                        {loginState === "invalid-password" && "Enter valid password"}
                        {loginState === "invalid-inputs" && "Unauthorized"}
                        {loginState === "ERROR" && "Error occured"}
                    </p>}
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

export default Login