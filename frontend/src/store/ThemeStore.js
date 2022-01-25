import { useContext } from "react";
import { composeAction, makeStore } from "./SessionStore";
import themes from "../style/themes";

const initialState = {
    theme: themes.forest
}

const stateFilter = state => {
    return {
        theme: state.theme
    }
}

const actionTypes = {
    clear: "clear",
    setTheme: "setTheme"
}

export const actions = {
    clear: composeAction(actionTypes.clear),
    /**
     * @param {string} theme 
     */
    setTheme: theme => composeAction(actionTypes.setTheme, { theme })
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.clear:
            return initialState;
        case actionTypes.setTheme:
            return { ...state, theme: action.payload.theme }
        default:
            return state;
    }
}

const [storeContext, dispatchContext, ThemeStore] = makeStore("themeStore", reducer, initialState);
const useDispatch = () => useContext(dispatchContext);
const useStore = () => stateFilter(useContext(storeContext));

export { useStore, useDispatch };
export default ThemeStore;