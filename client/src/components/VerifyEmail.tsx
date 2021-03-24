import { Alert, Button, Spin } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
import { verifyActivationLink } from "../redux/slices/authSlice";
import { State } from "../redux/types";
function VerifyEmail() {
  const auth = useSelector((state: State) => state.auth);
  const params = useParams<{ token: string }>();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyActivationLink({ token: params.token }));
  }, [dispatch,params.token]);
  if (auth.user.emailConfirmed) return <Redirect to="/" />;
  return (
    <div>
      {auth.activating ? (
        <Spin size="large" spinning  />
      ) : auth.errorsActivating ? (
        <div>
          <Alert
            message={
              <div className="flex flex-col items-center justify-start">
                <p>{JSON.stringify(auth.errorsActivating)}</p>
                <Link to="/">
                  <Button type="link">العودة للصفحة الرئيسية</Button>
                </Link>
              </div>
            }
            type="error"
            showIcon
          />
        </div>
      ) : (
        <div>
          <Alert
            message={<p>Your account activated succefully</p>}
            type="success"
            showIcon
          />
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
