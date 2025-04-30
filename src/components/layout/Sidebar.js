import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../../hooks/useWallet";
import "../../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { isConnected, isAdmin } = useWallet();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/logo.svg" alt="Share-a-Care Logo" className="logo" />
          {!collapsed && <span>Share-a-Care</span>}
        </div>
        <button className="collapse-button" onClick={toggleSidebar}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">
              <i className="fas fa-home"></i>
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li
            className={location.pathname.includes("/projects") ? "active" : ""}
          >
            <Link to="/projects">
              <i className="fas fa-project-diagram"></i>
              {!collapsed && <span>Projects</span>}
            </Link>
          </li>
          <li
            className={
              location.pathname.includes("/care-packages") ? "active" : ""
            }
          >
            <Link to="/care-packages">
              <i className="fas fa-gift"></i>
              {!collapsed && <span>Care Packages</span>}
            </Link>
          </li>
          <li
            className={location.pathname.includes("/funding") ? "active" : ""}
          >
            <Link to="/funding">
              <i className="fas fa-coins"></i>
              {!collapsed && <span>Funding Rounds</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {isAdmin && (
        <div className="admin-section">
          {!collapsed && <h3>Admin</h3>}
          <ul>
            <li
              className={location.pathname.includes("/admin") ? "active" : ""}
            >
              <Link to="/admin">
                <i className="fas fa-tools"></i>
                {!collapsed && <span>Admin Panel</span>}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
