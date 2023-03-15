import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const BreadCrumb = ({
  userType,
  emailOfCurrentUser,
  typeOfUser,
}) => {
  const [isUserPageActive, setIsUserPageActive] = useState(false);
  const [isPropertyPageActive, setIsPropertyPageActive] = useState(false);
  // If we are on Users section in admin then isUserPageActive will be true.
  const testFn = () => {
    setIsUserPageActive(window.location.href.includes("/admin/users"));
    setIsPropertyPageActive(window.location.href.includes("/admin/property"));
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
            <NavLink className="text-decoration-none" to="/admin">
              Dashboard
            </NavLink>
          </li>
          {isUserPageActive ? (
            <>
              <NavLink to="/admin/users" className="breadcrumb-item">
                Users
              </NavLink>
              {userType ? (
                <li className="breadcrumb-item">{userType}</li>
              ) : (
                <></>
              )}
              {emailOfCurrentUser ? (
                <>
                  <NavLink to="/admin/users" className="breadcrumb-item">
                    {typeOfUser}
                  </NavLink>
                  <li className="breadcrumb-item">{emailOfCurrentUser}</li>
                </>
              ) : (
                <></>
              )}
            </>
          ) : isPropertyPageActive ? (
            <>
              <NavLink to="/admin/property/properties" className="breadcrumb-item">
                Properties
              </NavLink>
            </>
          ) : (
            <></>
          )}
        </ol>
      </nav>
    </>
  );
};

export default BreadCrumb;
