import type { NextPage } from 'next'
import { useLayoutEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Image from 'next/image'

const Home: NextPage = () => {
  const [productCount, setProductsCount] = useState(0);
  useLayoutEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch("/api/products/count", {
      "method": "GET",
      signal
    }).then(res => res.json()).then(jsonRes => {
      setProductsCount(jsonRes.data);
    }).catch(_err => {
      // TODO call error message component
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
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.welcomeTitle}>Welcome on</h1>
        <div className={styles.logoText}>
          <Image src="/textLogo.svg" alt='Shopee' width="100%" height="100%" layout="responsive" />
        </div>
        <h2 className={styles.productCountTitle}>We are selling <p>{productCount}</p> products</h2>
      </div>
    </>
  )
}

export default Home
