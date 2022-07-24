import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import SpinnerLoader from '../../components/SpinnerLoader';
import styles from '../../styles/product.module.css'
const Product = () => {
    const router = useRouter();
    const [product, setProduct] = useState({
        img: null,
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
        }).then(res => res.json()).then(jsonRes => {
            setProduct(jsonRes);
        }).catch(_err => {
            // TODO call error message component
        })
        return () => {
            controller.abort();
        };
    }, [router.query])

    // if (!product.name) return (
    //     <div className={styles.productContainer + " navbarFix"}>
    //         <h1 className={styles.productTitleLoading}></h1>
    //         <div className={styles.productImageContainerLoading}>
    //             <SpinnerLoader>
    //                 <span className='material-icons'>image</span>
    //             </SpinnerLoader>
    //             <img src={product.img} alt={product.name} />
    //         </div>
    //         <span className={styles.productDescriptionLoading}>
    //             <p>
    //                 <div></div>
    //                 <div></div>
    //                 <div></div>
    //                 <div></div>
    //                 <div></div>
    //             </p>
    //         </span>
    //     </div>
    // )
    return (
        <div className={styles.productContainer + " navbarFix"}>
            <h1 className={styles.productTitle}>Iphoe S Plus</h1>
            <div className={styles.productImageContainer}>
                <img src={product.img} alt={product.name} />
            </div>
            <span className={styles.productDescription}>
                <p>
                    {product.description}
                </p>
            </span>
            <div className={styles.prizeBuyContainer}>
                <div className={styles.prizeContainer}>
                    <span>${product.prize}</span>
                </div>
                <button>Buy now</button>
            </div>
        </div>
    )
}

export default Product