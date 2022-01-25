import { useContext } from "react";
import { makeSessionStore } from "./StoreFactory";
import { composeAction } from "./StoreFunctions";
import { Get } from "../axios/Axios";

const initialState = {};

/**
 * @param {Date} date 
 */
const getMinutes = date => date.getHours() * 60 + date.getMinutes();

const createKeyPayload = (key, value) => {
    const data = {};
    data[key] = { value, time: getMinutes(new Date()) };
    return data;
}

const shouldUpdate = (store, key, timeLimit) => {
    if (store[key])
        return getMinutes(new Date()) - store[key].time >= timeLimit ?? 10;
    return true;
}

const actions = {
    clear: key => composeAction("clear", key),
    change: (key, value) => composeAction("change", createKeyPayload(key, value)),
}

const reducer = (state, action) => {
    switch (action.type) {
        case actions.clear().type:
            return state;
        case actions.change().type:
            return { ...state, ...action.payload }
        default:
            return state;
    }
}

const [storeContext, dispatchContext, Store] = makeSessionStore("CacheStore", reducer, initialState);

const useDispatch = () => useContext(dispatchContext);
const useStore = () => useContext(storeContext);

export { useStore, useDispatch, shouldUpdate, actions };
export default Store;

/**
 * @param {any} store 
 * @param {any} dispatch 
 * @param {()=>Promise<any>} onUpdate
 * @param {boolean} updateNow
 */
export const updateCache = async (store, dispatch, key, onUpdate, updateNow = false) => {
    if (updateNow || shouldUpdate(store, key, 5)) {
        const data = await onUpdate();
        if (data) {
            dispatch(actions.change(key, data));
            return { isUpdated: true, data: data };
        }
    }
    return { isUpdated: false, data: null };
}

/**
 * @param {any} store 
 * @param {any} dispatch 
 * @param {boolean} updateNow
 * @returns {Promise<any[]>}
 */
export const updateFiles = async (store, dispatch, updateNow = false) => {
    if (updateNow || shouldUpdate(store, "files", 5)) {
        const res = await Get("/file");
        if (res.success)
            dispatch(actions.change("files", res.data));
        res.notify();
    }
}