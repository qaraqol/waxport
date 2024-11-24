"use client";
import { Layout } from "antd";

const { Header } = Layout;

const HeaderComponent = () => {
  return (
    <Header
      style={{
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        fontSize: "1.5rem",
      }}
    >
      waxport - Transfers tool by Qaraqol
    </Header>
  );
};

export default HeaderComponent;
