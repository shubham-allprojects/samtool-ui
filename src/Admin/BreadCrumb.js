import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import users from "./users.json";

const BreadCrumb = () => {
  const [activeInnerText, setActiveInnerText] = useState("");

  const [dataToShow, setDataToShow] = useState("");
  const testFn = () => {
    const activeLinks = document.querySelectorAll(".nav-link.active");
    const idFromUrl = window.location.href.slice(-1);
    setActiveInnerText(activeLinks[0].innerText);
    users.forEach((user) => {
      if (user._id === parseInt(idFromUrl)) {
        setDataToShow(user.name);
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
            <NavLink className="text-decoration-none" to="/admin">
              Dashboard
            </NavLink>
          </li>

          {activeInnerText === "Users" ? (
            <>
              <NavLink
                to="/admin/users"
                className="breadcrumb-item text-decoration-none"
              >
                Users
              </NavLink>
              {dataToShow ? (
                <li className="breadcrumb-item">{dataToShow}</li>
              ) : (
                ""
              )}
            </>
          ) : activeInnerText === "Properties" ? (
            <NavLink to="/admin/property" className="breadcrumb-item">
              Properties
            </NavLink>
          ) : (
            <NavLink className="d-none" to="/"></NavLink>
          )}
        </ol>
      </nav>
    </>
  );
};

export default BreadCrumb;
