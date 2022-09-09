import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { useContext } from 'react'
import { ModalContext } from '../contexts/ModalContext'

const Home: NextPage = () => {
  const [productCount, setProductsCount] = useState(0);
  const { addMessage } = useContext(ModalContext);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch("/api/products/list", {
      "method": "GET",
      signal
    }).then(res => {
      if (res.ok) return res.json();
      Promise.reject(res);
    }).then(jsonRes => {
      setProductsCount(jsonRes.length);
    }).catch(_err => {
      if(_err.name == "AbortError") {
        console.log("Request aborted");
        return;
      }
      addMessage({
        type: "ERR",
        message: "Error while loading page",
        title: "Error",
        hideAfter: 3000
      })
    })
    return () => {
      controller.abort();
    };
  }, [])
  return (
    <>
      <Head>
        <title>Shopee</title>
        <meta name="description" content="Shopee shop" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.welcomeTitle}>Welcome on</h1>
        <div className={styles.logoText}>
          <Image src="/textLogo.svg" alt='Shopee' width="100%" height="100%" layout="responsive" />
        </div>
        <h2 className={styles.productCountTitle}>We are selling <p>{productCount}</p> product{productCount!=1 && "s" }</h2>
      </div>
    </>
  )
}

export default Home
