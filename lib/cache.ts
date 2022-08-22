type SetStateAction<S> = S | ((prevVal: S)=>S);
interface cacheHookI<T> {
        cacheData: () => T,
    setCache: (value: SetStateAction<T>) => void;
};
function cacheHook<T>(intialValue:T,key:string):cacheHookI<T> {
    const setCache = (value:SetStateAction<T>) => {
        if (!global[key]) {
            global[key] = intialValue;
        }
        const newState:T = (typeof value === "function") ? value(global[key]) : value;
        global[key] = newState;
    }
    const cacheData = ():T => global[key];
    return { cacheData, setCache };
}

export default cacheHook;
export type { cacheHookI, SetStateAction }