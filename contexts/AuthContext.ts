import { createContext } from "react";
export const AuthContext = createContext({
    isLoading: true,
    isLoggedIn: false,
    accessToken: "",
    user: {
        id: "",
        email: "",
        isAdmin: false
    },
    renewAccess: () => { },
    logout: () => { },
    fetchUserData: () => {}
});