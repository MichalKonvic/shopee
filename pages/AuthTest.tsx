import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
const AuthTest = () => {
    const { isLoading, isLoggedIn, logout, renewAccess, user } = useContext(AuthContext);
    return (
        <div className='navbarFix' style={{ color: "white" }}>
            {isLoading && "Loading..."}
            {isLoading || isLoggedIn.toString()}
            <br />
            <button onClick={() => logout()}>Logout</button>
            <br />
            <button onClick={() => renewAccess()}>Renew</button>
            {isLoading || <div>
                <span>id:{user.id}</span>
                <br />
                <span>email:{user.email}</span>
                <br />
                <span>isAdmin:{user.isAdmin.toString()}</span>
            </div>}
        </div>
    )
}

export default AuthTest