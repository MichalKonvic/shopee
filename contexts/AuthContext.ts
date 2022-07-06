import { createContext } from "react";
export const AuthContext = createContext({
    isLoading: true,
    isLoggedIn: false,
    accessToken: "",
    renewAccess: () => { },
    logout: () => {}
});