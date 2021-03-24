//React
import React, { useState } from "react";
import { Link } from "react-router-dom";
//Redux
import { useSelector } from "react-redux";

//Antd
import { Layout, Menu, Divider } from "antd";
import {
  EyeOutlined,
  HomeOutlined,
  FileTextOutlined,
  EditOutlined,
  BookOutlined,
} from "@ant-design/icons";

//Types
import { State } from "../../redux/types";

//Antd layouts
const { Content, Sider, Footer } = Layout;
const { SubMenu } = Menu;

//Component
const AdminDashboard = ({ children }) => {
  const { user, loading } = useSelector((state: State) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      >
        <div className="mt-4 text-center text-white">
          <p className="font-bold">
            {" "}
            <Link to="/">APR-ACADEMY </Link>
          </p>
          <p>
            {!loading && (
              <>
                <span className="text-gray-300">welcome back</span>{" "}
                <Link to="/profile">{user.username}</Link>
              </>
            )}
          </p>
        </div>
        <Divider />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="main" icon={<HomeOutlined />}>
            <Link to="/admin/home">Dashboard</Link>
          </Menu.Item>
          {!loading && user.role === "admin" && (
            <Menu.Item key="3">
              <Link to="/admin/user">Members</Link>
            </Menu.Item>
          )}
          <SubMenu key="configs" icon={<EditOutlined />} title="E-Learning">
            <Menu.Item key="4">
              <Link to="/admin/course">Courses</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/admin/subcourse">Sections</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/admin/lesson">Lessons</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/admin/comment">Comments</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="article" icon={<FileTextOutlined />}>
            <Link to="/admin/article">Articles</Link>
          </Menu.Item>
          <Menu.Item key="book" icon={<BookOutlined />}>
            <Link to="/admin/books">Books</Link>
          </Menu.Item>
          <Menu.Item key="preview" icon={<EyeOutlined />}>
            <Link to="/">Preview </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>{children}</Content>
        <Footer>@APR-ACADMY-2021</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
