// Imported and modified code from: https://usehooks.com/useLocalStorage/
import {useEffect, useState} from "react";
// Hooks
function useLocalStorage<T>(key: string, initialValue: T) {
   // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // useEffect function that ...
  // ... persists the new value to SessionStorage.
  useEffect(() => {
    try {
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  },[key, storedValue]);

  return [storedValue, setValue] as const;
}

function useSessionStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.sessionStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // useEffect function that ...
  // ... persists the new value to SessionStorage.
  useEffect(() => {
    try {
      // Save to local storage
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  },[key, storedValue]);

  return [storedValue, setValue] as const;
}
export { useLocalStorage, useSessionStorage};