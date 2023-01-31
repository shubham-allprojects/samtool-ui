import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { toast } from "react-toastify";

function Header() {
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
    // alert("Logged Out Successfully");
    toast.success("Logged Out Successfully");
    // Clear localStorage.
    localStorage.clear();
    setAllUseStates({ ...allUseStates, loginStatus: false });
    setTimeout(() => {
      // window.location.reload();
      goTo("/");
    }, 2000);
  };

  // Save status of login.
  const setStatusOfLogin = () => {
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
      <nav className="navbar navbar-expand-lg fixed-top">
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
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Search
                </NavLink>
              </li>
              <li className="nav-item ps-lg-2">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
              <li className="nav-item ps-lg-2">
                <NavLink className="nav-link" to="/contact">
                  Contact
                </NavLink>
              </li>
              <li className="nav-item ps-lg-2">
                <span className="nav-link">Account</span>
              </li>
              {!loginStatus ? (
                <>
                  <li className="nav-item ps-lg-2">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item ps-lg-2">
                    <NavLink to="/register" className="nav-link">
                      Registration
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item ps-lg-2">
                    <NavLink to="/profile" className="nav-link">
                      Profile
                    </NavLink>
                  </li>
                  <li className="nav-item ps-lg-2">
                    <span className="nav-link">Welcome, {userEmail}</span>
                  </li>
                  {roleId === 1 ? (
                    <li className="nav-item ps-lg-2">
                      <NavLink to="/admin" className="nav-link">
                        Administration
                      </NavLink>
                    </li>
                  ) : (
                    ""
                  )}
                  <li className="nav-item ps-lg-2">
                    <span
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                      onClick={logOut}
                    >
                      Logout
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
