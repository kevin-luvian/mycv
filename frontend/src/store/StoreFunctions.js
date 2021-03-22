/**
 * @param {Storage} storage 
 * @param {string} key 
 * @param {any} data 
 */
export const setStorage = (storage, key, data) => {
    storage.setItem(key, JSON.stringify(data));
    return data;
}
/**
 * @param {Storage} storage 
 * @param {string} key 
 * @param {any} inititalItem 
 */
export const getStorage = (storage, key, inititalItem) => {
    const localItem = storage.getItem(key);
    if (localItem) return JSON.parse(localItem);
    return setStorage(storage, key, inititalItem);
}

/**
 * compose action object
 * @param {string} type 
 */
export const composeAction = (type, payload) => { return { type: type, payload: payload } };

/**
 * compose action object
 * @param {string} type 
 */
export const composeActionDispatch = (dispatch, type, payload) =>
    dispatch({ type: type, payload: payload });