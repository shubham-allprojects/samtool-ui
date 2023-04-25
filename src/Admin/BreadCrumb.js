import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const BreadCrumb = ({
  userType,
  emailOfCurrentUser,
  typeOfUser,
  setDisplayClassesOfMainSections,
  handlePageClick,
  currentPageNumber,
}) => {
  const [isUserPageActive, setIsUserPageActive] = useState(false);
  const [isPropertyPageActive, setIsPropertyPageActive] = useState(false);
  const [isAddPropertyPageActive, setIsAddPropertyPageActive] = useState(false);
  const [isUpdatePropertyPageActive, setIsUpdatePropertyPageActive] =
    useState(false);
  const [isBulkUploadPropertyPageActive, setIsBulkUploadPropertyPageActive] =
    useState(false);

  // If we are on Users section in admin then isUserPageActive will be true.
  const checkActivePages = () => {
    setIsUserPageActive(window.location.href.includes("/admin/users"));
    setIsPropertyPageActive(window.location.href.includes("/admin/property"));
    setIsAddPropertyPageActive(
      window.location.href.includes("/admin/property/add-property")
    );
    setIsUpdatePropertyPageActive(
      window.location.href.includes("/admin/property/update-property")
    );
    setIsBulkUploadPropertyPageActive(
      window.location.href.includes("/admin/property/upload-properties")
    );
  };

  let sampleLink = (
    <NavLink to="/admin/property/properties" className="breadcrumb-item">
      Properties
    </NavLink>
  );

  useEffect(() => {
    checkActivePages();
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
                        handlePageClick({ selected: currentPageNumber });
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
                        handlePageClick({ selected: currentPageNumber });
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
                <>
                  {sampleLink}
                  <li className="breadcrumb-item text-secondary">
                    Add Property
                  </li>
                </>
              ) : isBulkUploadPropertyPageActive ? (
                <>
                  {sampleLink}
                  <li className="breadcrumb-item text-secondary">
                    Upload Bulk Properties
                  </li>
                </>
              ) : isUpdatePropertyPageActive ? (
                <></>
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
