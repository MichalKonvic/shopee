import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
const AuthTest = () => {
    const [isLogged, accessToken, renew, logout] = useContext(AuthContext);
    return (
        <div style={{ height: 500 }}>{isLogged.toString()}
            <button style={{ margin: 100 }} onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default AuthTest