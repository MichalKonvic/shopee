import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useStorages';
interface productI{
    id: string;
    title: string;
    prize: number;
    quantity: number;
}
type orderStateT = "IDLE"|"PROCESSING"|"COMPLETED"|"FAILED"
const useShopping = () => {
    const mounted = useRef(false);
    const [locStorageData,setLocStorage] = useLocalStorage('SHOPEE-SHOPPING_CART', {
            items: []
    } as { items: productI[] });
    const [shippingInfo, setShipping] = useState({
        address: "",
        note: ""
    })
    const [orderState, setOrderState] = useState<orderStateT>("IDLE");
    const [products, setProducts] = useState<{ items: productI[] }>({ items: [] });
    
    const processOrder = async () => {
        setOrderState("PROCESSING");
        const requestBody = { items: products.items };
        const sessionId = fetch("/api/checkout/create-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        }).then((res) => {
            if (res.ok) return res.json();
            return res.json().then(json => Promise.reject(json));
        }).then(({ url }) => {
            if (!mounted.current) return;
            window.location = url;
        }).catch(e => {
            if (!mounted.current) return;
            //TODO handle error
        });
    }

    const removeProduct = (productId: string) => {
        setProducts((prev) => {
            return {
                items:prev.items.filter(prod => prod.id !== productId)
            }
        })
    } 

    const updateProduct = (product: productI) => {
        const productIndex = products.items.findIndex(prod => prod.id === product.id);
        if (productIndex === -1) {
            console.error("Cannot update product(product not found)")
            return; // Not found
        }
        setProducts((prev) => {
            prev.items[productIndex] = product;
            return {items:[...prev.items]};
        })
    }

    const addProduct = (product: productI) => {
        if (products.items.some(prod => prod.id === product.id)) {
            const updatedProducts = products.items;
            const cartProductIndex = updatedProducts.findIndex(prod => prod.id === product.id);
            updatedProducts[cartProductIndex].quantity += product.quantity;
            setProducts({items:updatedProducts});
            return;
        }
        setProducts({
            items: [...products.items, product]
        })
    } 
    // Mount/Unmount handler
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, []);

    useEffect(() => {
        // Prevents reloading data
        if (locStorageData.items.length == 0) return;
        // Not Array
        if (!(locStorageData.items instanceof Array)) return;
        const locStorageProducts = locStorageData?.items.filter(({id, prize, title, quantity}) => {
            if (!id || !prize || !title || !quantity) return false;
            return true;
        })
        if (locStorageData.items.length == 0) return;
        setProducts({items:locStorageProducts});
    }, []);

    useEffect(() => {
        setLocStorage({items:products.items});
    }, [products,setLocStorage]);
    
    return {addProduct,removeProduct, updateProduct,setShipping,processOrder,orderState,shippingInfo,products}
}
export default useShopping;
export type {productI, orderStateT};