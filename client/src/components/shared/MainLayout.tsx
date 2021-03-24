//React
import React from "react";
//Antd
import { Layout } from "antd";
//Components
import FooterComponent from "./FooterComponent";
import Navbar from "../shared/Navbar";

const { Content, Footer, Header } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout className="bg-white ">
      <Header className="bg-white h-1/5 ">
        <Navbar />
      </Header>
      <Layout>
        <Content className="min-h-screen bg-white">{children}</Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
