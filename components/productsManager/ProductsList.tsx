import React, { useContext } from 'react'
import ShoppingCartContext from '../../contexts/ShoppingCartContext'
import ProductManager from './ProductManager';

const ProductsList = () => {
    const { products } = useContext(ShoppingCartContext);
    return (
        products.items.map(prod => <ProductManager key={prod.id} productData={prod} />)
    )
}

export default ProductsList