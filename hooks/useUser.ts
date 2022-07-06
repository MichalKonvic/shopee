import { useState,useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
const useUser = () => {
    const { isLoading:isAuthLoading,accessToken,renewAccess,logout} = useContext(AuthContext);
    const [user, setUser] = useState({
        id: "",
        email: "",
        isAdmin: false
    });
    const [isLoading, setLoading] = useState(true);

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

    useEffect(() => {
        if (!isLoading) return;
        if (user.id === "") return;
        setLoading(false);
    }, [user]);

    useEffect(() => {
        // waits for auth hook to load
        if (isAuthLoading) return;
        console.log("first2")
        fetchUserData();
    }, [isAuthLoading])
    return { isLoading, user , fetchUserData};
}

export default useUser;