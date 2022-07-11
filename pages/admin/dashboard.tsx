import PageLoader from "../../components/PageLoader"
import PrivateRoute from "../../components/PrivateRoute"

const dashboard = () => {
    return (
        <PrivateRoute adminOnly={true}>
            Welcome
        </PrivateRoute>
    )
}

export default dashboard