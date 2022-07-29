import { useState, useEffect } from "react"
const APP_NAME = process.env.NEXT_PUBLIC_APPNAME as string || "APP_DATA";
const useSessionStorage = () => {
    const [sessionData, setData] = useState({});
    const [isLoading, setLoading] = useState(true);

    const loadSessionData = () => {
        setLoading(true);
        try {
            const storedData = sessionStorage.getItem(APP_NAME);
            setData(JSON.parse(storedData));
            setLoading(false);
        } catch (error) {
            console.error("Cannot parse data from sessionStorage");
        }
    }

    useEffect(() => {
        loadSessionData();
    }, []);

    useEffect(() => {
        if (isLoading) return;
        try {
            sessionStorage.setItem(APP_NAME, JSON.stringify(sessionData));
        } catch (error) {
            console.error("Cannot set data into session storage");
        }
    },[sessionData,isLoading]);
    return {sessionData, setData,loadSessionData,isLoading};
}
const useLocalStorage = () => {
    const [storageData, setData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const loadLocalData = () => {
        setLoading(true);
        try {
            const storedData = localStorage.getItem(APP_NAME);
            setData(JSON.parse(storedData));
            setLoading(false);
        } catch (error) {
            console.error("Cannot parse data from localStorage");
        }
    }

    useEffect(() => {
        loadLocalData();
    }, []);

    useEffect(() => {
        if (isLoading) return;
        try {
            localStorage.setItem(APP_NAME, JSON.stringify(storageData));
        } catch (error) {
            console.error("Cannot set data into localStorage");
        }
    },[storageData,isLoading]);
    return {storageData, setData,loadLocalData,isLoading};
}
export { useSessionStorage, useLocalStorage };