import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { State } from "../redux/types";

const PrivateRouteEditor: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {
  const { isAuthenticated, loading, user } = useSelector(
    (state: State) => state.auth
  );

  return loading ? (
    <></>
  ) : isAuthenticated && (user.role === "editor" || user.role === "admin") ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/pagenotfound" />
  );
};
export default PrivateRouteEditor;
