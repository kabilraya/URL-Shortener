import React from "react";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const navigateDashboard = () => {
    navigate("/dashboard");
  };
  const navigateHome = () => {
    navigate("/");
  };
  return (
    <div className="Navbar">
      <div className="left">
        <div className="wrapper">
          <img src="/url.svg" alt="logo"></img>
        </div>

        <span>SHORTEN-URL</span>
      </div>
      <div className="center">
        <span onClick={navigateHome}>Home</span>
        <span onClick={navigateDashboard}>Dashboard</span>
      </div>
      <div className="right"></div>
    </div>
  );
}
