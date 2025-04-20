import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/data-parser":
        return "";
      case "/sentiment-analysis":
        return "Sentiment Analysis";
      case "/network-analysis":
        return "Network Analysis";
      case "/reports":
        return "Reports";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleBlueWatchClick = () => {
    if (isLoggedIn) {
      navigate("/data-parser");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="header">
      {isLoggedIn && (
        <>
          <div className="logo" onClick={handleBlueWatchClick} style={{ cursor: 'pointer' }}>
            BlueWatch
          </div>
          <h2 className="page-title">{getPageTitle()}</h2>
          <div className="auth-section">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;