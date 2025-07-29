import React from "react";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
function Header({ toggleTheme, theme }) {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <div className="header-title">Task Manager</div>
      <div className="header-actions">
        <span className="header-user">👤 {user?.username || "User"}</span>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </header>
  );
}

export default Header;
