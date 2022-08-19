import React, { ChangeEvent, useContext, useEffect } from 'react'
import ShoppingCartContext from '../contexts/ShoppingCartContext'
import styles from '../styles/checkout.module.css'

const AdressForm = () => {
    const { shippingInfo, setShipping } = useContext(ShoppingCartContext);
    const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setShipping((prev) => {
            return { ...prev, note: e.target.value }
        })
    }
    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setShipping((prev) => {
            return { ...prev, address: e.target.value }
        })
    }
    return (
        <form className={styles.adressForm}>
            <label htmlFor="adress">
                Shipping Address
            </label>
            <input value={shippingInfo.address} onChange={handleAddressChange} type="text" name="adress" id="adress" placeholder='1234 Main St' />
            <label htmlFor="note">
                Note
            </label>
            <input value={shippingInfo.note} onChange={handleNoteChange} type="text" name="note" id="note" placeholder='...' />
        </form>
    )
}

export default AdressForm