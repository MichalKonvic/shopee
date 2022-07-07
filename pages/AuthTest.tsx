import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
const AuthTest = () => {
    const { isLoading, isLoggedIn, logout, renewAccess, user, fetchUserData, checkLogin } = useContext(AuthContext);
    return (
        <div className='navbarFix' style={{ color: "white" }}>
            {isLoading && "Loading..."}
            {isLoading || isLoggedIn.toString()}
            <br />
            <button onClick={() => logout()}>Logout</button>
            <br />
            <button onClick={() => renewAccess()}>Renew Access</button>
            <button onClick={() => fetchUserData()}>Fetch User</button>
            <button onClick={() => checkLogin()}>Check login</button>
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