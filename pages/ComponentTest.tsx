import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { ModalContext } from '../contexts/ModalContext';
const ComponentTest = () => {
    const { isLoading, isLoggedIn, logout, renewAccess, user, fetchUserData, checkLogin } = useContext(AuthContext);
    const { addMessage, messageQueue } = useContext(ModalContext);
    return (
        <>
            <div className='navbarFix' style={{ color: "white", border: "1px solid white", padding: "1rem" }}>
                <h1>AuthTest</h1>
                <br />
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
            <div className='navbarFix' style={{ color: "white", border: "1px solid white", padding: "1rem" }}>
                <h1>Messages:</h1>
                <br />
                <button onClick={() => addMessage({
                    title: "Test",
                    message: "Test notification",
                    hideAfter: 2500,
                    type: 'ERR'
                })}>Error notification</button>
                <button onClick={() => addMessage({
                    title: "Test",
                    message: "Test notification",
                    hideAfter: 2500,
                    type: 'WARN'
                })} > Warn notification</button>
                <button onClick={() => addMessage({
                    title: "Test",
                    message: "Test notification",
                    hideAfter: 2500,
                    type: 'INFO'
                })}>Info notification</button>
                <h2>Queue:</h2>
                <br />
                {messageQueue.length.toString()}
            </div>
        </>
    )
}

export default ComponentTest