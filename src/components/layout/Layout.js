import React from "react";
import Sidebar from "./Sidebar";
import DarkModeToggle from "../common/DarkModeToggle";
import WalletConnector from "../WalletConnector";
import "../../styles/Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="app-header">
          <div className="header-title">
            <h1>Share-a-Care</h1>
          </div>
          <div className="header-actions">
            <DarkModeToggle />
            <WalletConnector />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
