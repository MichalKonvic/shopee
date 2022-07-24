import React from 'react'
import styles from '../styles/layout.module.css'
const SpinnerLoader = ({ children = <></> }) => {
    return (
        <div className={styles.spinnerLoader}>
            {children}
        </div>
    )
}

export default SpinnerLoader