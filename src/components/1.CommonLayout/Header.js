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
                <>
                  <li className="nav-item ps-lg-2">
                    <span className="nav-link">
                      <i class="bi bi-person-fill"></i> {userEmail}
                    </span>
                  </li>
                  <li className="nav-item ps-lg-2">
                    <span
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                      onClick={logOut}
                    >
                      <i class="bi bi-box-arrow-right"></i> Logout
                    </span>
                  </li>
                </>
              )}

              <li class="nav-item dropdown">
                <span
                  class="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Menu
                </span>
                <ul class="dropdown-menu main-nav-dropdown-menu bg-primary">
                  <li>
                    <NavLink to="/" className="nav-link">
                      <i class="bi bi-search text-white me-1"></i> Search
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/about">
                      <i class="bi bi-info-circle text-white me-1"></i> About
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/contact">
                      <i class="bi bi-telephone text-white me-1"></i> Contact
                    </NavLink>
                  </li>
                  {/* <hr class="dropdown-divider bg-white" /> */}
                  {roleId && roleId === 1 ? (
                    <li>
                      <NavLink to="/admin" className="nav-link">
                        <i class="bi bi-person-fill-check text-white me-2"></i>
                        Administration
                      </NavLink>
                    </li>
                  ) : (
                    ""
                  )}
                  {loginStatus ? (
                    <>
                      <li>
                        <NavLink to="/profile" className="nav-link">
                          <i class="bi bi-person-square text-white me-2"></i>
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <span
                          style={{ cursor: "pointer" }}
                          className="nav-link"
                          onClick={logOut}
                        >
                          <i class="bi bi-box-arrow-right text-white me-1"></i>{" "}
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
