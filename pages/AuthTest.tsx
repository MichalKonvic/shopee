import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
const AuthTest = () => {
    const { isLoading, isLoggedIn, logout } = useContext(AuthContext);
    return (
        <div className='navbarFix' style={{ color: "white" }}>
            {isLoading && "Loading..."}
            {isLoading || isLoggedIn.toString()}
            <br />
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default AuthTest