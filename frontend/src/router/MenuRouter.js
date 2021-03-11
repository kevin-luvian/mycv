import { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../redux/reducers/AuthReducer";
import Pages from "../page/Pages";
import Error from "../page/Error";
import Util from "../util/utils";

const NavRoute = ({ component: Component, protect, ...rest }) => {
  const dispatch = useDispatch();
  const currExpires = useSelector(store => store.auth.expires);

  // clear token if expired
  useEffect(() => {
    if (Util.isTokenExpired(currExpires) && currExpires > 0) dispatch(actions.clear);
  }, [dispatch, currExpires]);

  if (protect && Util.isTokenExpired(currExpires)) {
    console.log("protected link, you are not authorized");
    return <RouteWrapper {...rest} component={Error.Err404} />;
  }
  return <RouteWrapper {...rest} component={Component} />;
};

const RouteWrapper = ({ component: Component, ...rest }) =>
  <Pages.PageWrapper>
    <Route {...rest} render={(props) => <Component {...props} />} />
  </Pages.PageWrapper>

const exported = () =>
  <BrowserRouter>
    <Switch>
      <NavRoute path="/" exact component={Pages.Bio} />
      <NavRoute path="/resume" protect={true} exact component={Pages.Resume} />
      <NavRoute path="/login" exact component={Pages.Login} />
      <NavRoute path="/logout" exact component={Pages.Logout} />
      <NavRoute component={Error.Err404} />
    </Switch>
  </BrowserRouter>

export default exported;