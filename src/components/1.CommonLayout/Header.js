import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Header() {
  // This useState will store data from localStorage such as login-status, role and email of user.
  const [allUseStates, setAllUseStates] = useState({
    loginStatus: false,
    roleId: null,
    userEmail: "",
  });

  const [toastDisplayClass, setToastDisplayClass] = useState("d-none");
  let toastAutoCloseTiming = 2500;
  const { loginStatus, roleId, userEmail } = allUseStates;

  // To navigate to particular route.
  const goTo = useNavigate();

  // Logout function.
  const logOut = () => {
    setToastDisplayClass("");
    toast.success("Logged Out Successfully");
    // Clear localStorage.
    localStorage.clear();
    setAllUseStates({ ...allUseStates, loginStatus: false });
    setTimeout(() => {
      setToastDisplayClass("d-none");
      goTo("/");
      window.location.reload();
    }, toastAutoCloseTiming + 1000);
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
      <ToastContainer
        className={toastDisplayClass}
        autoClose={toastAutoCloseTiming}
      />
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
                  Home
                </NavLink>
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
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                /* If user is loggedIn then show these navbar links */
                <>
                  <li className="nav-item ps-lg-2">
                    <span className="nav-link">
                      <i className="bi bi-person-fill"></i> {userEmail}
                    </span>
                  </li>
                </>
              )}
              {/* If user is not loggedIn then show these navbar links in dropdown */}
              <li className="nav-item dropdown ps-lg-2">
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
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
