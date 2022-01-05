import { useEffect, useContext, Fragment } from "react";
import { makeStore } from "./LocalStore";
import { composeAction } from "./StoreFunctions";
import Notification from "../component/notification/Notification";
import { Get } from "../axios/Axios";

const initialState = {
    fullname: ""
}

/**
 * @param {any} state 
 * @returns {{
 *      fullname:string
 * }}
 */
const stateFilter = state => {
    return {
        fullname: state.fullname
    }
}

const actions = {
    clear: composeAction("clear"),
    setFullname: fullname => composeAction("setFullname", { fullname })
}

const reducer = (state, action) => {
    switch (action.type) {
        case actions.clear.type:
            return initialState;
        case actions.setFullname().type:
            return { ...state, ...action.payload }
        default:
            return state;
    }
}

const [storeContext, dispatchContext, StoreImpl] =
    makeStore("cvdatastore", reducer, initialState);

const useDispatch = () => useContext(dispatchContext);
const useStore = () => stateFilter(useContext(storeContext));

export { useStore, useDispatch, actions };

const StoreSync = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetch = async () => {
            const res = await Get("/myInfo");
            if (res.success) {
                const data = parseMyInfoObject(res.data);
                dispatch(actions.setFullname(data.fullname));
            }
        }
        fetch();
    }, [dispatch]);

    return <Fragment />;
}

const Store = ({ children }) => {
    return (
        <StoreImpl>
            <StoreSync />
            {children}
        </StoreImpl>
    );
}

const parseMyInfoObject = ({ fullname }) => {
    return { fullname };
}

export default Store;