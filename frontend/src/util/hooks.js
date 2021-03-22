import { useState, useEffect, useCallback } from "react";

/**
 * @param {Storage} storage 
 * @param {string} key 
 * @param {any} data 
 */
export const setStorage = (storage, key, data) => {
    console.log("setting storage", "key:", key, "data:", data);
    storage.setItem(key, JSON.stringify(data));
}
/**
 * @param {Storage} storage 
 * @param {string} key 
 * @return {any|null}
 */
export const getStorage = (storage, key) => {
    const localItem = storage.getItem(key);
    if (localItem) return JSON.parse(localItem);
    return null;
}

/**
 * hook to access data in localstorage
 * @param {string} key 
 * @param {any} data 
 * @returns {[any, React.Dispatch<any>]}
 */
export const useSessionStorage = (key) => {
    const [val, setVal] = useState(
        useCallback(() => getStorage(sessionStorage, key), [key])
    );
    useEffect(() => setStorage(sessionStorage, key, val), [val, key]);
    return [val, setVal];
}

/**
 * hook to access data in localstorage
 * @param {string} key 
 * @param {any} data 
 * @returns {[any, React.Dispatch<any>]}
 */
export const useLocalStorage = (key) => {
    const [val, setVal] = useState(
        useCallback(() => getStorage(localStorage, key), [key])
    );
    useEffect(() => setStorage(localStorage, key, val), [val, key]);
    return [val, setVal];
}