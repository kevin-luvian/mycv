import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { actions } from "../redux/reducers/AuthReducer";
import { Redirect } from "react-router-dom";

const Logout = () => {
    const dispatch = useDispatch();
    useEffect(() => { dispatch(actions.clear); }, [dispatch]);
    return <Redirect to="/login" />;
}

export default Logout;