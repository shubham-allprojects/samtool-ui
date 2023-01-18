import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

let savedUserType = "";
const BreadCrumb = ({ userType, emailOfCurrentUser }) => {
  const [isUserPageActive, setIsUserPageActive] = useState(false);
  const testFn = () => {
    setIsUserPageActive(window.location.href.includes("/admin/users"));
  };

  useEffect(() => {
    testFn();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <nav aria-label="breadcrumb" className="mt-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink className="" to="/admin">
              Dashboard
            </NavLink>
          </li>
          {isUserPageActive ? (
            <>
              <NavLink to="/admin/users" className="breadcrumb-item">
                Users
              </NavLink>
              {userType ? (
                <li className="breadcrumb-item text-secondary">
                  {(savedUserType = userType)}
                </li>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          {/* <NavLink to="/admin/property" className="breadcrumb-item">
            Properties
          </NavLink> */}
          {/* <li className="breadcrumb-item text-secondary">{property}</li> */}
        </ol>
      </nav>
    </>
  );
};

export default BreadCrumb;
