import React from 'react'
import styles from '../styles/checkout.module.css'

const AdressForm = () => {
    return (
        <form className={styles.adressForm}>
            <label htmlFor="adress">
                Address
            </label>
            <input type="text" name="adress" id="adress" placeholder='1234 Main St' />
            <label htmlFor="note">
                Note
            </label>
            <input type="text" name="note" id="note" placeholder='...' />
        </form>
    )
}

export default AdressForm