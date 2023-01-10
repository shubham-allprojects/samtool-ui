import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import users from "./users.json";
import properties from "./data.json";

const BreadCrumb = () => {
  const [activeInnerText, setActiveInnerText] = useState("");
  const [dataToShow, setDataToShow] = useState({
    userName: "",
    property: "",
  });

  const { userName, property } = dataToShow;
  const testFn = () => {
    const activeLinks = document.querySelectorAll(".nav-link.active");
    const userIdFromUrl = window.location.href.slice(-1);
    const propertyIdFromUrl = window.location.href.slice(-5);
    setActiveInnerText(activeLinks[0].innerText);
    users.forEach((user) => {
      if (user._id === parseInt(userIdFromUrl)) {
        setDataToShow({ ...dataToShow, userName: user.name });
      }
    });
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
              {userName ? (
                <li className="breadcrumb-item text-secondary">{userName}</li>
              ) : (
                ""
              )}
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
