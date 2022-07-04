import { useState,useEffect } from "react";
import { sessionManager } from "./storageManager";
const useAuth = () => {
    const [isLoggedIn, setLogin] = useState(false);
    const [accessToken, setToken] = useState("");

    const logout = () => {
        setLogin(false);
        setToken("");
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
    
    return [isLoggedIn,accessToken,renewAccess,logout];
}

export default useAuth;