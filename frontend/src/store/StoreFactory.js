import { createContext, useReducer } from "react";
import { setStorage, getStorage } from "./StoreFunctions";

/**
 * @param {string} key 
 * @param {function} reducer 
 * @param {any} initialState 
 */
const makeStore = (key, reducer, initialState, storage) => {
    const storeContext = createContext();
    const dispatchContext = createContext();

    initialState = getStorage(storage, key, initialState);

    const storageReducer = (state, action) => {
        const newState = reducer(state, action);
        return setStorage(storage, key, newState);
    }

    const LocalStore = ({ children }) => {
        const [store, dispatch] = useReducer(storageReducer, initialState);

        return (
            <dispatchContext.Provider value={dispatch}>
                <storeContext.Provider value={store}>
                    {children}
                </storeContext.Provider>
            </dispatchContext.Provider>
        )
    }

    return [storeContext, dispatchContext, LocalStore];
}

export const makeLocalStore = (key, reducer, initialState) =>
    makeStore(key, reducer, initialState, localStorage);

export const makeSessionStore = (key, reducer, initialState) =>
    makeStore(key, reducer, initialState, sessionStorage);