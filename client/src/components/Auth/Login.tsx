// React & Hooks
import React, { useEffect } from "react";
//React Router
import { Link } from "react-router-dom";
// Redux Hooks
import { useDispatch, useSelector } from "react-redux";
// Redux Actions
import { loginActionThunk, resetErrors } from "../../redux/slices/authSlice";
//Types
import { State } from "../../redux/types";
// Utils
import { Form, Input, Button } from "antd";
import {  LockOutlined,MailOutlined } from "@ant-design/icons";

/*LOGIN COMPONENT

useState: email , password
actions : Login
route@Post : /api/login
route@params: email , password
*/

const Login = () => {
  //Redux
  const dispatch = useDispatch();
  //State
  const [form] = Form.useForm();
  //Form Submit on Finish
  const onFinish = ({ email, password }: any) => {
    dispatch(loginActionThunk({ email, password }));
  };
  const { errorsLogin, loading } = useSelector((state: State) => state.auth);
  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  
  //Handle Form Errors from server
  useEffect(() => {
    if (Object.keys(errorsLogin).length > 0) {
      form.setFields([
        {
          name: "email",
          errors: errorsLogin?.email
            ? [errorsLogin.email ? errorsLogin.email : ""]
            : undefined,
        },
        {
          name: "password",
          errors: errorsLogin?.password
            ? [errorsLogin.password ? errorsLogin.password : ""]
            : undefined,
        },
      ]);
    }
  }, [errorsLogin, form]);
  //Store states
  return (
    <div className="container flex flex-col items-center justify-center px-4 py-12 lg:px-8 ">
      <div className="flex flex-col items-center justify-center text-center">
        <svg
          className="w-16 "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-blue-600">
          SIGN IN
        </h2>
      </div>
      <Form
        name="normal_login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        className="w-screen max-w-sm px-2 py-3 lg:w-96"
      >
        <Form.Item
          name="email"
          hasFeedback
          validateStatus={
            loading ? "validating" : errorsLogin.email ? "error" : ""
          }
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
            className="py-3"
          />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          validateStatus={
            loading ? "validating" : errorsLogin.password ? "error" : ""
          }
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            className="py-3"
          />
        </Form.Item>
        <div className="flex flex-row justify-between">
          <Link to="/" className="text-gray-400">
           Forgot password?
          </Link>
          <Link to="/register" className="text-gray-400">
           Register
          </Link>
        </div>
        <Form.Item className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-2 login-form-button"
          >
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
