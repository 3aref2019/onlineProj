import React, { useState, useEffect } from "react";

import { Drawer, Menu } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCourses } from "../../redux/slices/coursesSlice";
import { State } from "../../redux/types";
import { Link, useLocation } from "react-router-dom";
import { logoutActionThunk } from "../../redux/slices/authSlice";

const { SubMenu } = Menu;

const Navbar2 = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);
  const { error, list, status } = useSelector((state: State) => state.courses);
  const { isAuthenticated, loading, user } = useSelector(
    (state: State) => state.auth
  );
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="bg-white">
      <div className="flex-row justify-between hidden md:flex ">
        <Menu
          selectedKeys={[location.pathname]}
          mode="horizontal"
          className="mt-1 font-bold"
          triggerSubMenuAction="click"
        >
          <Menu.Item key="/">
            <Link to="/">APR-ACADEMY</Link>
          </Menu.Item>
          <Menu.Item key="/articles">
            <Link to="/articles">ARTICLES</Link>
          </Menu.Item>
          <Menu.Item key="/c/courses">
            <Link to="/c/courses">COURSES</Link>
          </Menu.Item>
          <Menu.Item key="/books">
            <Link to="/books">BOOKS</Link>
          </Menu.Item>
        </Menu>
        {loading ? (
          <p></p>
        ) : (
          <Menu
            selectedKeys={[location.pathname]}
            mode="horizontal"
            className="mt-1 font-bold"
          >
            {!isAuthenticated ? (
              <>
                <Menu.Item key="/register">
                  <Link to="/register">Register</Link>
                </Menu.Item>
                <Menu.Item key="/login">
                  <Link to="/login">Login</Link>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item key="/profile">
                  <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="/bookmarks">
                  <Link to="/bookmarks">Bookmarks</Link>
                </Menu.Item>
                {(user.role === "admin" || user.role === "editor") && (
                  <Menu.Item key="/admin/home">
                    <Link to="/admin/home">Dashboard</Link>
                  </Menu.Item>
                )}
                <Menu.Item
                  key="home"
                  onClick={() => dispatch(logoutActionThunk())}
                >
                  Logout
                </Menu.Item>
              </>
            )}
          </Menu>
        )}
      </div>
      <div className="flex flex-row justify-between m-4 md:hidden">
        <h1 className="text-lg font-bold">APR-ACADEMY</h1>
        <MenuOutlined onClick={showDrawer} className="mb-2 text-lg" />
        <Drawer
          title="APR-ACADEMY"
          mask={false}
          closable={true}
          onClose={onClose}
          visible={visible}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            className="text-base"
          >
            <Menu.Item key="/">
              <Link to="/" onClick={() => setVisible(false)}>
                APR-ACADEMY
              </Link>
            </Menu.Item>
            {!loading && !isAuthenticated ? (
              <>
                <Menu.Item key="/register" onClick={() => setVisible(false)}>
                  <Link to="/register">REGISTER</Link>
                </Menu.Item>
                <Menu.Item key="/login" onClick={() => setVisible(false)}>
                  <Link to="/login">LOGIN</Link>
                </Menu.Item>
              </>
            ) : (
              <SubMenu
                key="SubMenuMobile"
                icon={<UserOutlined />}
                title="MY ACCOUNT"
              >
                <Menu.Item key="/profile" onClick={() => setVisible(false)}>
                  <Link to="/profile">PROFILE</Link>
                </Menu.Item>
                <Menu.Item
                  key="/"
                  onClick={() => {
                    dispatch(logoutActionThunk());
                    setVisible(false);
                  }}
                >
                  Logout
                </Menu.Item>
              </SubMenu>
            )}
            <Menu.Item key="/articles" onClick={() => setVisible(false)}>
              <Link to="/articles">ARTICLES</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/c/courses">Courses</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/books">Books</Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar2;
