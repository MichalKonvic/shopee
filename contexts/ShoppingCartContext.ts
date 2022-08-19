import { createContext, Dispatch, SetStateAction } from "react";
import { orderStateT, productI } from "../hooks/useShopping";

const products: {items:productI[]} = {
    items:[]
};
const shippingInfo: {
    address: string,
    note: string
} = {
    address: "",
    note: ""
};

const setShipping:Dispatch<SetStateAction<{
        address: string,
        note:string
    }>> = (data) => {}

const orderState: orderStateT = "IDLE";

export default createContext({
    addProduct: (product: productI) => { },
    removeProduct: (productId: string) => { },
    updateProduct: (product: productI) => { },
    setShipping,
    processOrder: () => { },
    orderState,
    shippingInfo,
    products
})