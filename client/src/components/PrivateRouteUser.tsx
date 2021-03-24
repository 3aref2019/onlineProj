import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { State } from "../redux/types";

const PrivateRouteUser: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {
  const { isAuthenticated, loading } = useSelector(
    (state: State) => state.auth
  );

  return loading ? (
    <></>
  ) : isAuthenticated ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/login" />
  );
};
export default PrivateRouteUser;
