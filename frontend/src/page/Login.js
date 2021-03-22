import React, { useState } from 'react';
import { UsernameInput, PasswordInput } from "../component/form/Login";
import Button from "../component/button/Button";
import styles from "./styles.module.scss";
import { concat } from "../util/utils";
import { Post } from "../axios/Axios";
import { useDispatch } from "react-redux";
import Notification, { NotificationType } from "../component/notification/Notification";
import { actions } from "../redux/reducers/AuthReducer";
import { Redirect } from 'react-router';

const Login = () => {
    document.title = "Login - authenticate to edit stuff";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();

    const postLogin = async () => {
        const data = { username: username, password: password };
        const res = await Post("/auth", data);
        if (res.success) {
            dispatch(actions.update(res.data.token, res.data.expires));
            setRedirect(true);
            Notification.create(res.message, NotificationType.success);
        } else {
            Notification.create(res.message, NotificationType.danger);
        }
    }

    return (
        <React.Fragment>
            {redirect && <Redirect to="/" />}
            <div className="my-3 mx-auto col-10 col-sm-7 col-md-5">
                <UsernameInput value={username} onChange={setUsername} />
                <PasswordInput value={password} onChange={setPassword} />
            </div>
            <div className={concat(styles.wFit, "mx-auto")}>
                <Button onClick={postLogin}>Submit</Button>
            </div>
        </React.Fragment>
    );
}

export default Login;