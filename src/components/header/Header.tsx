import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

export const Header = () => {
  return (
    <div className="header">
      <Link to="/" className="nav-button">
        Home
      </Link>
      <Link to="/dungeon" className="nav-button">
        Dungeon
      </Link>
    </div>
  );
};
export default Header;
