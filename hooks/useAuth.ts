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

    function fetchUserData () {
        fetch(`/api/users/${accessToken}`, {
            method: "GET",
        }).then(async response => {
            switch (response.status) {
                case 200:
                    const dataJson = await response.json();
                    if (!dataJson) throw new Error("No api response");
                    const { data } = dataJson;
                    setUser(data);
                    if(isLoading) setLoading(false);
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
            // TODO show error dialog
            if(isLoading) setLoading(false);
        });
    }

    const logout = () => {
        setLogin(false);
        setToken("");
        setUser(INITIAL_USER)
        sessionManager("SHOPEE", {});
        fetch("/api/users/logout", {
            "method": "GET"
        });
    }

    const renewAccess = () => {
        fetch("api/users/renewAccess", {
            credentials: "include",
            method: "GET"
        }).then(async response => {
            if (response.status !== 200) {
                setLogin(false);
                sessionManager("SHOPEE", {});
                return;
            }
            const { data: _accessToken } = await response.json();
            setToken(_accessToken);
        }).catch(_err => {
            setLogin(false);
            sessionManager("SHOPEE", {});
            console.error("Cannot restore access!");
            return;
        });
    }
    useEffect(() => {
        if (!accessToken) return;
        setLogin(true);
        sessionManager("SHOPEE", { accessToken });
    }, [accessToken])
    
    useEffect(() => {
        // waits till user is logged in
        if (!isLoggedIn) return;
        fetchUserData();
    },[isLoggedIn])

    useEffect(() => {
        const sessionData = sessionManager("SHOPEE");
        if (!sessionData) {
            renewAccess();
        } else {
            const { accessToken: _accessToken } = sessionData;
            if (!_accessToken) {
                renewAccess();
            } else {
                setToken(_accessToken);
            }    
        }
        // Renews AccessToken every 5 minutes
        const renewAccessInterval = setInterval(() => {
            console.log("Restoring access...")
            renewAccess();
        }, 1000 * 60 * 5);
        return () => {
            clearInterval(renewAccessInterval);
        }
    }, [])
    
    return {isLoading,isLoggedIn,accessToken,user,renewAccess,logout,fetchUserData};
}

export default useAuth;