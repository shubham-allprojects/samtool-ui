import React from "react";
import { NavLink } from "react-router-dom";

const CommonNavLinks = ({ roleId, loginStatus, logOut }) => {
  return (
    <>
      <li>
        <NavLink className="nav-link" to="/about">
          <i className="bi bi-info-circle text-white me-2"></i>
          About
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/contact">
          <i className="bi bi-telephone text-white me-2"></i>
          Contact
        </NavLink>
      </li>
      {roleId && roleId === 1 ? (
        <li>
          <NavLink to="/admin" className="nav-link">
            <i className="bi bi-person-fill-check text-white me-2"></i>
            Administration
          </NavLink>
        </li>
      ) : (
        ""
      )}
      {/* If user is loggedIn then show these navbar links in dropdown */}
      {loginStatus ? (
        <>
          <li>
            <NavLink to="/profile" className="nav-link">
              <i className="bi bi-person-square text-white me-2"></i>
              Profile
            </NavLink>
          </li>
          <li>
            <span
              style={{ cursor: "pointer" }}
              className="nav-link"
              onClick={logOut}
            >
              <i className="bi bi-box-arrow-right text-white me-2"></i>
              Logout
            </span>
          </li>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CommonNavLinks;
