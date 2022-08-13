import { createContext } from "react";
import { productI } from "../hooks/useShopping";

const products: {items:productI[]} = {
    items:[]
};

export default createContext({
    addProduct: (product: productI) => { },
    products
})