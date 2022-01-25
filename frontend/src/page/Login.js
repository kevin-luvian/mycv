import React, { useState } from "react";
import { UsernameInput, PasswordInput } from "../component/form/Login";
import Button from "../component/button/Button";
import styles from "./styles.module.scss";
import { concat } from "../util/utils";
import { Post } from "../axios/Axios";
import { useDispatch } from "react-redux";
import Notification, {
  NotificationType,
} from "../component/notification/Notification";
import { actions } from "../redux/reducers/AuthReducer";
import { Redirect } from "react-router";
import ContentPadding from "./extra/ContentPadding";

const Login = () => {
  document.title = "Login - authenticate to edit stuff";

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const postLogin = async () => {
    setLoading(true);
    const data = { username: username, password: password };
    const res = await Post("/auth", data);
    res.notify();
    if (res.success) {
      dispatch(actions.update(res.data.token, res.data.expires));
      setRedirect(true);
    }
    setLoading(false);
  };

  return (
    <ContentPadding style={{ height: "20rem" }}>
      {redirect && <Redirect to="/" />}
      <div className="absolute-center w-100">
        <div className="mx-auto col-10 col-sm-7">
          <UsernameInput value={username} onChange={setUsername} />
          <PasswordInput value={password} onChange={setPassword} />
        </div>
        <div className={concat(styles.wFit, "mt-3 mx-auto")}>
          <Button loading={loading} onClick={postLogin} className="px-5">
            Login
          </Button>
        </div>
      </div>
    </ContentPadding>
  );
};

export default Login;
