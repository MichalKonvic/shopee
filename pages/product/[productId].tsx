import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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

    if (!product.name) return (
        <div className='navbarFix'>
            Loading...
        </div>
    )
    return (
        <div>
            <img src={product.img} alt={product.name} />
        </div>
    )
}

export default Product