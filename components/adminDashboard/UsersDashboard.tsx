import React, {useState,useEffect,useContext} from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import ListUser from './Users/ListUser';
import styles from '../../styles/AdminDashboard.module.css'
const UsersDashboard = () => {
    const [users, setUsers] = useState([]);
    const { accessToken } = useContext(AuthContext);
    const { addMessage} = useContext(ModalContext);
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetch('/api/users/list', {
            signal,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            if (res.ok) return res.json();
            Promise.reject(res);
        }).then(res => setUsers(res)).catch(err => {
            if (err.name === "AbortError") return;
            addMessage({
                type: 'ERR',
                message: "Cannot load products",
                hideAfter: 3000,
                title: "Load error"
            });
        })
    },[]);
    return (
        <div className={styles.productsDashboardContainer}>
            <h1 className={styles.productDashboardTitle}>Users</h1>
            <div className={styles.productsList}>
                {users?.map(user => <ListUser user={user} />)}
            </div>
        </div>
    )
}

export default UsersDashboard