import { useRouter } from 'next/router'
import React, { useEffect, useState, useContext } from 'react'
import SpinnerLoader from '../../components/SpinnerLoader';
import { ModalContext } from '../../contexts/ModalContext';
import styles from '../../styles/product.module.css'
import { AuthContext } from '../../contexts/AuthContext';
import ShoppingCartContext from '../../contexts/ShoppingCartContext';
const Product = () => {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const { addProduct, products } = useContext(ShoppingCartContext);
    const { addMessage } = useContext(ModalContext);
    const [product, setProduct] = useState({
        id: "",
        img: "",
        name: "",
        description: "",
        prize: 0,
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
        }).then(({ description, prize, inStock, name, img, _id: id }) => {
            setProduct({ description, prize, inStock, name, img, id });
        }).catch(_err => {
            if (_err.name !== "AbortError") {
                addMessage({
                    title: "Error",
                    message: "Cannot load product",
                    type: "ERR",
                    hideAfter: 5 * 1000
                });
            }
        })
        return () => {
            controller.abort();
        };
    }, [router.query])

    const handleProductBuy = () => {
        if (product.inStock < 0) {
            addMessage({
                hideAfter: 2500,
                title: "Out of stock",
                message: "Product is out of stock",
                type: "WARN"
            })
            return;
        }
        // Checks if product is already in shoppingCart ...
        // ... and if quantity doesnt overcome inStock
        if (products.items.some(({ id, quantity }) => {
            if (id !== product.id) return false;
            if (quantity + 1 > product.inStock) return true;
        })
        ) {
            addMessage({
                hideAfter: 2500,
                message: `We have only ${product.inStock} in stock`,
                title: "Out of stock",
                type: "WARN"
            });
            return;
        }
        addProduct({
            id: product.id,
            prize: product.prize,
            title: product.name,
            quantity: 1
        });
    }

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
                    <button onClick={handleProductBuy}>Buy now</button>}
            </div>
        </div>
    )
}

export default Product