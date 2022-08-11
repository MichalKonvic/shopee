import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useStorages';
interface productI{
    id: string;
    title: string;
    prize: number;
    quantity: number;
}
const useShopping = () => {
    const [locStorageData,setLocStorage] = useLocalStorage('SHOPEE-SHOPPING_CART', {
            items: []
        } as { items: productI[] });
    const [products, setProducts] = useState<{items:productI[]}>({items:[]});
    const addProduct = (product: productI) => {
        //TODO check if product is inStock before adding another into quantity
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
    
    return {addProduct,products}
}
export default useShopping;
export type {productI};