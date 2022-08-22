import { useState } from "react"
import DashNavigation from "../../components/adminDashboard/DashNavigation"
import OrdersDashboard from "../../components/adminDashboard/OrdersDashboard"
import ProductsDashboard from "../../components/adminDashboard/ProductsDashboard"
import UsersDashboard from "../../components/adminDashboard/UsersDashboard"
import PrivateRoute from "../../components/PrivateRoute"
import styles from '../../styles/AdminDashboard.module.css'
const Dashboard = () => {
    const [activeTab, setTab] = useState<"ORDERS" | "PRODUCTS" | "USERS">("PRODUCTS");
    return (
        <PrivateRoute adminOnly={true} redirect="/">
            <div className={styles.container + " navbarFix"}>
                <DashNavigation activeTab={activeTab} activateTab={setTab} />
                <main>
                    {activeTab === "ORDERS" && <OrdersDashboard />}
                    {activeTab === "PRODUCTS" && <ProductsDashboard />}
                    {activeTab === "USERS" && <UsersDashboard />}
                </main>
            </div>
        </PrivateRoute>
    )
}

export default Dashboard;