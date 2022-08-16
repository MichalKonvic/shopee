import { useRouter } from 'next/router';
import React, { useEffect, useContext, useState } from 'react'
import PageLoader from '../components/PageLoader';
import { ModalContext } from '../contexts/ModalContext';
import { ProductI } from '../models/Product';
const RandomProduct = () => {
    const [productList, setProducts] = useState<ProductI[]>([]);
    const router = useRouter();
    const { addMessage } = useContext(ModalContext);
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetch("/api/products/list", {
            method: "GET",
            signal
        }).then(res => res.json()).then(res => setProducts(res)).catch(err => {
            if (err.name !== "AbortError") {
                addMessage({
                    title: "Error",
                    message: "Server communication error",
                    type: "ERR",
                    hideAfter: 3000
                });
            }
        });
        return () => {
            controller.abort();
        }
    }, []);
    useEffect(() => {
        if (productList.length === 0) return;
        // Random redirect
        const random = (max: number) => Math.floor(Math.random() * (max - 0 + 1)) + 0;
        const randomIndex = random(productList.length - 1);
        router.replace(`/product/${productList[randomIndex]._id}`);
    }, [productList])
    return (<div>
        <PageLoader />
    </div>
    )
}

export default RandomProduct;