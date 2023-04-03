import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const BreadCrumb = ({
  userType,
  emailOfCurrentUser,
  typeOfUser,
  propertyId,
}) => {
  const [isUserPageActive, setIsUserPageActive] = useState(false);
  const [isPropertyPageActive, setIsPropertyPageActive] = useState(false);
  const [isAddPropertyPageActive, setIsAddPropertyPageActive] = useState(false);
  const [
    isSinglePropertyDocumentsUploadPageActive,
    setIsSinglePropertyDocumentsUploadPageActive,
  ] = useState(false);
  // If we are on Users section in admin then isUserPageActive will be true.
  const testFn = () => {
    setIsUserPageActive(window.location.href.includes("/admin/users"));
    setIsPropertyPageActive(window.location.href.includes("/admin/property"));
    setIsAddPropertyPageActive(
      window.location.href.includes("/admin/property/add-property")
    );
    setIsSinglePropertyDocumentsUploadPageActive(
      window.location.href.includes(
        "/properties/single-property-documents-upload"
      )
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
              <li className="breadcrumb-item">Users</li>
              {userType ? (
                <li className="breadcrumb-item">{userType}</li>
              ) : (
                <></>
              )}
              {emailOfCurrentUser ? (
                <>
                  {typeOfUser === "Individual User" ? (
                    <>
                      <NavLink
                        to="/admin/users/individual-users"
                        className="breadcrumb-item"
                      >
                        Individual Users
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/admin/users/organizational-users"
                        className="breadcrumb-item"
                      >
                        Organizational Users
                      </NavLink>
                    </>
                  )}
                  <li className="breadcrumb-item">{emailOfCurrentUser}</li>
                </>
              ) : (
                <></>
              )}
            </>
          ) : isPropertyPageActive ? (
            <>
              <NavLink
                to="/admin/property/properties"
                className="breadcrumb-item"
              >
                Properties
              </NavLink>
              {isAddPropertyPageActive ? (
                <li className="breadcrumb-item">Add</li>
              ) : propertyId ? (
                <li className="breadcrumb-item">{propertyId}</li>
              ) : isSinglePropertyDocumentsUploadPageActive ? (
                <li className="breadcrumb-item">Upload Documents & Images</li>
              ) : (
                <> </>
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
