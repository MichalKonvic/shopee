import DashboardNavbar from "../../components/DashboardNavbar"
import PrivateRoute from "../../components/PrivateRoute"
import styles from '../../styles/AdminDashboard.module.css'
const dashboard = () => {
    return (
        <PrivateRoute adminOnly={false} redirect="/">
            <div className={styles.container}>
                <DashboardNavbar />
                <main>

                </main>
            </div>
        </PrivateRoute>
    )
}

export default dashboard