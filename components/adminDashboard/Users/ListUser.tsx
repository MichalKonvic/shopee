import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { ModalContext } from '../../../contexts/ModalContext'
import useMounted from '../../../hooks/useMounted'
import { UserI } from '../../../models/User'
import styles from '../../../styles/AdminDashboard.module.css'

const ListUser = ({ user }: { user: UserI }) => {
    const isMounted = useMounted();
    const router = useRouter();
    const { addMessage } = useContext(ModalContext);
    const {accessToken} = useContext(AuthContext);
    const deleteUser = () => {
        fetch(`/api/users/delete?id=${user._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            if (res.ok) return res.json();
            return Promise.reject(res);
        }).then(json => {
            router.reload();
        }).catch(err => {
            if (!isMounted.current) return;
            addMessage({
                type: 'ERR',
                title: 'Error',
                message: 'Something went wrong',
                hideAfter: 3000
            })
         })
    }
    const unAdminUser = () => {
        fetch(`/api/users/unAdmin?id=${user._id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            if (res.ok) return res.json();
            return Promise.reject(res);
        }).then(json => {
            router.reload();
        }).catch(err => {
            if (!isMounted.current) return;
            addMessage({
                type: 'ERR',
                title: 'Error',
                message: 'Something went wrong',
                hideAfter: 3000
            })
         })
    }
    const makeAdminUser = () => {
        fetch(`/api/users/makeAdmin?id=${user._id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            if (res.ok) return res.json();
            return Promise.reject(res);
        }).then(json => {
            router.reload();
        }).catch(err => {
            if (!isMounted.current) return;
            addMessage({
                type: 'ERR',
                title: 'Error',
                message: 'Something went wrong',
                hideAfter: 3000
            })
         })
    }
  return (
      <div className={styles.productItem} key={user._id}>
            <div>
                <label>Email</label>
                <h1>{user.email}</h1>
            </div>
            <div>
                <label>Admin</label>
                <p>{user.isAdmin?.toString()}</p>
            </div>
          <div className={styles.productItemRightButtons}>
              {user.isAdmin ? <span className='material-icons' onClick={unAdminUser}>remove_moderator</span>
                  : <span className='material-icons' onClick={makeAdminUser}>add_moderator

</span>}
                <span className='material-icons' onClick={deleteUser}>delete</span>
            </div>
        </div>
  )
}

export default ListUser