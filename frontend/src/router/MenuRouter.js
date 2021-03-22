import { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../redux/reducers/AuthReducer";
import Notification from "../component/notification/Notification";
import Pages from "../page/Pages";
import Error from "../page/Error";
import { isTokenExpired } from "../util/utils";

const RouteWrapper = ({ component: Component, ...rest }) =>
  <Pages.PageWrapper>
    <Route {...rest} render={(props) => <Component {...props} />} />
  </Pages.PageWrapper>

const NavRoute = ({ component: Component, protect, ...rest }) => {
  const dispatch = useDispatch();
  const currExpires = useSelector(store => store.auth.expires);

  // clear token if expired
  useEffect(() => {
    if (isTokenExpired(currExpires) && currExpires > 0) dispatch(actions.clear);
  }, [dispatch, currExpires]);

  if (protect && isTokenExpired(currExpires)) {
    Notification.create("protected link, you are not authorized", Notification.type.warning);
    return <RouteWrapper {...rest} component={Error.Err404} />;
  }
  return <RouteWrapper {...rest} component={Component} />;
};

const Routers = () =>
  <BrowserRouter>
    <Switch>
      <NavRoute path="/" exact component={Pages.Bio} />
      <NavRoute path="/test" exact component={Pages.Test} />
      <NavRoute path="/resume" protect={true} exact component={Pages.Resume} />
      <NavRoute path="/edit" protect={true} exact component={Pages.Edit} />
      <NavRoute path="/login" exact component={Pages.Login} />
      <NavRoute path="/logout" exact component={Pages.Logout} />
      <NavRoute component={Error.Err404} />
    </Switch>
  </BrowserRouter>

export default Routers;