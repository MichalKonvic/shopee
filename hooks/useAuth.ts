import { useState,useEffect } from "react";
import { sessionManager } from "../lib/storageManager";
const INITIAL_USER = {
    id: "",
    email: "",
    isAdmin: false
}

const useAuth = () => {
    const [isLoggedIn, setLogin] = useState(false);
    const [accessToken, setToken] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(INITIAL_USER);

    /**
     * Fetches user data from server using accessToken
     * SHOULD BE CALLED AFTER accessToken load
     */
    function fetchUserData() {
        if (!accessToken) {
            // No accessToken
            // logout()???
            // TODO could make problems
            return;
        }
        fetch(`/api/users/${accessToken}`, {
            method: "GET",
        }).then(async response => {
            switch (response.status) {
                case 200:
                    const dataJson = await response.json();
                    if (!dataJson) throw new Error("No api response");
                    const { data } = dataJson;
                    setUser(data);
                    break;
                case 401:
                    renewAccess();
                    break;
                case 404:
                    logout();
                    break;
                case 500:
                    throw new Error("Server error");
                default:
                    // TODO check for unexpected responses
                    console.error("Unexpected api response status");
                    throw new Error("Unhandled api response");
            }
        }).catch(_err => {
            // User fetch failed
            // TODO show error dialog
            logout()
        });
    }
    
    /**
     * Logouts user and clears all states
     */
    const logout = () => {
        setLogin(false);
        if (isLoading) setLoading(false);
        setToken("");
        setUser(INITIAL_USER)
        sessionManager("SHOPEE", {});
        fetch("/api/users/logout", {
            "method": "GET"
        });
    }

    /**
     * Renews/gets accessToken
     * Sets accessToken to state
     */
    const renewAccess = () => {
        fetch("/api/users/renewAccess", {
            credentials: "include",
            method: "GET"
        }).then(async response => {
            if (response.status !== 200) {
                logout();
                return;
            }
            const { data: _accessToken } = await response.json();
            setToken(_accessToken);
        }).catch(_err => {
            logout();
            console.error("Cannot restore access!");
            return;
        });
    }

    /**
     * Checks browser storage for accessToken
     * Or tries to get accessToken
     */
    const checkLogin = () => {
        setLoading(true);
        // Checks for appData in sessionStorage
        const sessionData = sessionManager("SHOPEE");
        if (!sessionData) {
            // Tries to renewAccess using refreshToken
            renewAccess();
            return;
        }
        // Application have data in sessionStorage
        const { accessToken: _accessToken } = sessionData;
        // Checks for AccessToken
        if (!_accessToken) {
            // accessToken not found in sessionStorage
            // Tries to renewAccess using refreshToken
            renewAccess();
            return;
        } else {
            setToken(_accessToken);
        }    
    }


    /**
     * Saves data to sessionStorage
     */
    const saveSessionStorageData = () => {
        const sessionStorageData = {
            accessToken        }
        sessionManager("SHOPEE", sessionStorageData);
    }

    /**
     * Saves accessToken to sessionStorage
     * And loads userData
     */
    useEffect(() => {
        if (!accessToken) return;
        fetchUserData();
        let lastSessionStorageData = sessionManager("SHOPEE");
        if (!lastSessionStorageData) {
            saveSessionStorageData();
            return;
        }
        lastSessionStorageData["accessToken"] = accessToken;
        sessionManager("SHOPEE", lastSessionStorageData);
    }, [accessToken])

    /**
     *  Sets login to true
     *  Sets loading to false
     */
    useEffect(() => {
        if (user === INITIAL_USER) return;
        setLogin(true);
        if(isLoading) setLoading(false);
    }, [user]);
    
    /**
     * Renews AccessToken to avoid its expiration
     */
    useEffect(() => {
        if (!isLoggedIn) return;
        // Renews AccessToken every 5 minutes
        const renewAccessInterval = setInterval(() => {
            console.log("Restoring access...")
            renewAccess();
        }, 1000 * 60 * 5);
        return () => {
            clearInterval(renewAccessInterval);
        }    
    },[isLoggedIn]);

    /**
     * On page load
     */
    useEffect(() => {
        checkLogin();
    }, [])
    
    return {isLoading,isLoggedIn,accessToken,user,renewAccess,logout,fetchUserData,checkLogin};
}

export default useAuth;