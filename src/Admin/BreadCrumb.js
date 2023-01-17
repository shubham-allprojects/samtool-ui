import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import properties from "./data.json";

const BreadCrumb = ({ userType, emailOfCurrentUser }) => {
  const [activeInnerText, setActiveInnerText] = useState("");
  const [dataToShow, setDataToShow] = useState({
    userName: "",
    property: "",
  });

  const { property } = dataToShow;
  const testFn = () => {
    const activeLinks = document.querySelectorAll(".nav-link.active");
    const propertyIdFromUrl = window.location.href.slice(-5);
    setActiveInnerText(activeLinks[0].innerText);

    properties.forEach((property) => {
      if (property._id === propertyIdFromUrl) {
        setDataToShow({
          ...dataToShow,
          property: property.category + " - " + property.city_name,
        });
      }
    });
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

          {activeInnerText === "Users" ? (
            <>
              <NavLink to="/admin/users" className="breadcrumb-item">
                Users
              </NavLink>
              <li className="breadcrumb-item text-secondary">{userType}</li>
              <li className="breadcrumb-item text-secondary">{emailOfCurrentUser}</li>
            </>
          ) : activeInnerText === "Properties" ? (
            <>
              <NavLink to="/admin/property" className="breadcrumb-item">
                Properties
              </NavLink>
              {property ? (
                <li className="breadcrumb-item text-secondary">{property}</li>
              ) : (
                ""
              )}
            </>
          ) : (
            <NavLink className="d-none" to="/"></NavLink>
          )}
        </ol>
      </nav>
    </>
  );
};

export default BreadCrumb;
