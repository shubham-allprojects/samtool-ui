import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CommonNavLinks from "./CommonNavLinks";

function Header() {
  // This useState will store data from localStorage such as login-status, role and email of user.
  const [allUseStates, setAllUseStates] = useState({
    loginStatus: false,
    roleId: null,
    userEmail: "",
  });

  const { loginStatus, roleId, userEmail } = allUseStates;

  // To navigate to particular route.
  const goTo = useNavigate();

  // Logout function.
  const logOut = () => {
    // Clear localStorage.
    localStorage.clear();
    setAllUseStates({ ...allUseStates, loginStatus: false });
    goTo("/");
    window.location.reload();
  };

  // Save status of login.
  const setStatusOfLogin = () => {
    // data is the loggedIn user's data from localStorage.
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      setAllUseStates({
        loginStatus: true,
        roleId: data.roleId,
        userEmail: data.user,
      });
    }
  };

  useEffect(() => {
    setStatusOfLogin();
  }, []);

  return (
    <header className="header-wrapper">
      <nav className="navbar navbar-expand-md fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand px-lg-4">Assets Class</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* If user is not loggedIn then show these navbar links */}
              <li>
                <NavLink to="/" className="nav-link">
                  <i className="bi bi-house me-2 text-light"></i>
                  Home
                </NavLink>
              </li>
              {!loginStatus ? (
                <>
                  <li className="nav-item ps-lg-2">
                    <NavLink to="/login" className="nav-link">
                      <i className="bi bi-box-arrow-in-right me-2 text-light"></i>
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item ps-lg-2">
                    <NavLink to="/register" className="nav-link">
                      <i className="bi bi-person-vcard me-2 text-light"></i>
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                /* If user is loggedIn then show these navbar links */
                <>
                  <li className="nav-item ps-lg-2">
                    <span className="nav-link">
                      <i className="bi bi-person-circle me-2 text-light"></i>
                      {userEmail}
                    </span>
                  </li>
                </>
              )}
              {/* If user is not loggedIn then show these navbar links in dropdown */}
              <li className="nav-item dropdown ps-lg-2 d-md-block d-none">
                <span
                  className="nav-link"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-caret-down-square-fill"></i>
                </span>
                <ul
                  className="dropdown-menu main-nav-dropdown-menu bg-primary"
                  data-bs-popper="static"
                >
                  <CommonNavLinks
                    roleId={roleId}
                    loginStatus={loginStatus}
                    logOut={logOut}
                  />
                </ul>
              </li>
              <div className="d-md-none">
                <CommonNavLinks
                  roleId={roleId}
                  loginStatus={loginStatus}
                  logOut={logOut}
                />
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
