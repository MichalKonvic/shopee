import { useRouter } from 'next/router'
import React, { useEffect, useState, useContext } from 'react'
import SpinnerLoader from '../../components/SpinnerLoader';
import { ModalContext } from '../../contexts/ModalContext';
import styles from '../../styles/product.module.css'
import { AuthContext } from '../../contexts/AuthContext';
const Product = () => {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const { messageQueue, addMessage } = useContext(ModalContext);
    const [product, setProduct] = useState({
        img: "",
        name: "",
        description: "",
        prize: 0,
        MD_Description: "",
        inStock: 0
    });
    useEffect(() => {
        const { productId } = router.query;
        if (!productId) return;
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(`/api/products/${productId}`, {
            "method": "GET",
            signal
        }).then(async (res) => {
            if (res.status !== 200) throw new Error("Product not loaded");
            return res.json()
        }).then(jsonRes => {
            setProduct(jsonRes);
        }).catch(_err => {
            addMessage({
                title: "Error",
                message: "Product was not created",
                type: "ERR",
                hideAfter: 5 * 1000
            });
        })
        return () => {
            controller.abort();
        };
    }, [router.query])

    if (!product.name) return (
        <div className={styles.productContainer + " navbarFix"}>
            <h1 className={styles.productTitleLoading}></h1>
            <div className={styles.productImageContainerLoading}>
                <SpinnerLoader>
                    <span className='material-icons'>image</span>
                </SpinnerLoader>
            </div>
            <span className={styles.productDescriptionLoading}>
                <div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </span>
        </div>
    )
    return (
        <div className={styles.productContainer + " navbarFix"}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            {user.isAdmin && <button className={styles.editButton}>Edit Product</button>}
            <div className={styles.productImageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element*/}
                <img src={product.img} alt={product.name} />
            </div>
            <span className={styles.productDescription}>
                <p>
                    {product.description}
                </p>
            </span>
            <div className={styles.prizeBuyContainer}>
                <div className={styles.prizeContainer}>
                    {product.inStock == 0 ? <span className={styles.prizeOutOfStock}>Out of Stock</span> :
                        <span>${product.prize}</span>}
                </div>
                {product.inStock == 0 ? <button>Request</button>
                    :
                    <button>Buy now</button>}
            </div>
        </div>
    )
}

export default Product