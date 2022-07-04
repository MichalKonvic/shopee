/**
 * Saves and returns sessionStorage data
 * @param key - The name of variable in sessionStorage
 * @param jsonData - Data to save to sessionStorage
 * @returns Object - New sessionStorage data 
 */
const sessionManager = (key: string, jsonData?: Object) => {
    try {
        if (!jsonData) return JSON.parse(sessionStorage.getItem(key));
        sessionStorage.setItem(key, JSON.stringify(jsonData));
        return JSON.parse(sessionStorage.getItem(key));
    } catch (error) {
        return undefined;
    }
}
/**
 * Saves and returns localStorage data
 * @param key - The name of variable in localStorage
 * @param jsonData - Data to save to localStorage
 * @returns Object - New localStorage data 
 */
const storageManager = (key: string, jsonData?: Object) => {
    try {
        if (!jsonData) return JSON.parse(localStorage.getItem(key));
        localStorage.setItem(key, JSON.stringify(jsonData));
        return JSON.parse(localStorage.getItem(key));
    } catch (error) {
        return undefined;
    }
}
export { sessionManager, storageManager };