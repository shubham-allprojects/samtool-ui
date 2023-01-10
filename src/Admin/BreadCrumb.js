import React from "react";
import { NavLink } from "react-router-dom";

const BreadCrumb = () => {
  return (
    <>
      <nav aria-label="breadcrumb" className="mt-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink to="/admin">Dashboard</NavLink>
          </li>

          <NavLink
            to="/admin/users"
            className="breadcrumb-item active"
            aria-current="page"
          >
            Users
          </NavLink>
        </ol>
      </nav>
    </>
  );
};

export default BreadCrumb;
