import { createContext, useReducer } from "react";
import { setStorage, getStorage } from "./StoreFunctions";

/**
 * @param {string} key 
 * @param {function} reducer 
 * @param {any} initialState 
 */
export const makeStore = (key, reducer, initialState) => {
    const storeContext = createContext();
    const dispatchContext = createContext();

    initialState = getStorage(localStorage, key, initialState);

    const storageReducer = (state, action) => {
        const newState = reducer(state, action);
        return setStorage(localStorage, key, newState);
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