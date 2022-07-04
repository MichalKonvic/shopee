import React, { useState } from 'react'
import styles from '../styles/Login.module.css'
import Head from 'next/head'
import { sessionManager } from '../lib/storageManager'
import Router from 'next/router'
import Link from 'next/link'
const login = () => {
    const [registerState, setRegisterState] = useState("");
    const router = Router;
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegisterState("");
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (!validateEmail(email)) {
            setRegisterState("invalid-email");
            return;
        }
        if (!password) {
            setRegisterState("invalid-password");
            return;
        }
        fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        }).then(async response => {
            if (response.status !== 201) {
                setRegisterState("ERROR");
                return;
            }
            const { data: accessToken } = await response.json();
            sessionManager("SHOPEE", {
                accessToken
            });
            router.replace("/");
        }).catch(_error => {
            console.log(_error);
            setRegisterState("ERROR");
        });
    }
    return (
        <>
            <Head>
                <title>Shopee - Register</title>
                <meta name="description" content="Shopee shop" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <div className={styles.container}>
                <form className={styles.loginForm} onSubmit={handleRegisterSubmit}>
                    <h1>Register</h1>
                    <input className={registerState === "invalid-email" ? "invalid" : ""} type="email" name="email" id="email" placeholder='Email' />
                    <input className={registerState === "invalid-password" ? "invalid" : ""} type="password" name="password" id="password" placeholder='Password' />
                    {registerState != "" && <p>
                        <span className='material-icons'>error</span>
                        {registerState === "invalid-email" && "Enter valid email adress"}
                        {registerState === "invalid-password" && "Enter valid password"}
                        {registerState === "ERROR" && "Error occured"}
                    </p>}
                    <input type="submit" value="Register" className={styles.submitButton} id='submit' />
                    <Link href="/login">
                        <a>
                            Already have account?
                        </a>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default login