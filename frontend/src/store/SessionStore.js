import { createContext, useReducer } from "react";
import { setStorage, getStorage } from "../util/hooks";

/**
 * compose action object
 * @param {string} type 
 */
export const composeAction = (type, payload) => { return { type: type, payload: payload } };

/**
 * 
 * @param {string} key 
 * @param {function} reducer 
 * @param {any} initialState 
 */
export const makeStore = (key, reducer, initialState) => {
    const storeContext = createContext();
    const dispatchContext = createContext();

    initialState = getStorage(sessionStorage, key) || initialState;

    const sessionReducer = (state, action) => {
        const newState = reducer(state, action);
        setStorage(sessionStorage, key, newState);
        return newState;
    }

    const SessionStore = ({ children }) => {
        const [store, dispatch] = useReducer(sessionReducer, initialState);

        return (
            <dispatchContext.Provider value={dispatch}>
                <storeContext.Provider value={store}>
                    {children}
                </storeContext.Provider>
            </dispatchContext.Provider>
        )
    }

    return [storeContext, dispatchContext, SessionStore];
}