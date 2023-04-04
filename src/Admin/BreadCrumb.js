import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const BreadCrumb = ({
  userType,
  emailOfCurrentUser,
  typeOfUser,
  setDisplayClassesOfMainSections,
}) => {
  const [isUserPageActive, setIsUserPageActive] = useState(false);
  const [isPropertyPageActive, setIsPropertyPageActive] = useState(false);
  const [isAddPropertyPageActive, setIsAddPropertyPageActive] = useState(false);

  // If we are on Users section in admin then isUserPageActive will be true.
  const testFn = () => {
    setIsUserPageActive(window.location.href.includes("/admin/users"));
    setIsPropertyPageActive(window.location.href.includes("/admin/property"));
    setIsAddPropertyPageActive(
      window.location.href.includes("/admin/property/add-property")
    );
  };

  useEffect(() => {
    testFn();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <nav aria-label="breadcrumb" className="mt-2">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink className="text-decoration-none" to="/admin">
              Dashboard
            </NavLink>
          </li>
          {isUserPageActive ? (
            <>
              {userType ? (
                <li className="breadcrumb-item text-secondary">{userType}s</li>
              ) : (
                <></>
              )}
              {emailOfCurrentUser ? (
                <>
                  {typeOfUser === "Individual User" ? (
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setDisplayClassesOfMainSections({
                          showAllUsersSectionClass: "",
                          viewCurrentUserSectionClass: "d-none",
                        });
                      }}
                      className="breadcrumb-item"
                    >
                      Individual Users
                    </li>
                  ) : (
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setDisplayClassesOfMainSections({
                          showAllUsersSectionClass: "",
                          viewCurrentUserSectionClass: "d-none",
                        });
                      }}
                      className="breadcrumb-item"
                    >
                      Organizational Users
                    </li>
                  )}
                  <li className="breadcrumb-item text-secondary">
                    {emailOfCurrentUser}
                  </li>
                </>
              ) : (
                <></>
              )}
            </>
          ) : isPropertyPageActive ? (
            <>
              {isAddPropertyPageActive ? (
                <li className="breadcrumb-item text-secondary">Add Property</li>
              ) : (
                <li className="breadcrumb-item text-secondary">Properties</li>
              )}
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
