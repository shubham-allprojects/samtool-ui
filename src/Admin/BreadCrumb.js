import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const BreadCrumb = () => {
  const [activeInnerText, setActiveInnerText] = useState("");
  const testFn = () => {
    const activeLinks = document.querySelectorAll(".nav-link.active");
    setActiveInnerText(activeLinks[0].innerText);
  };
  useEffect(() => {
    testFn();
  }, []);

  return (
    <>
      <nav aria-label="breadcrumb" className="mt-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink to="/admin">Dashboard</NavLink>
          </li>

          {activeInnerText === "Users" ? (
            <NavLink
              to="/admin/users"
              className="breadcrumb-item"
              aria-current="page"
            >
              Users
            </NavLink>
          ) : activeInnerText === "Properties" ? (
            <NavLink
              to="/admin/property"
              className="breadcrumb-item"
              aria-current="page"
            >
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
