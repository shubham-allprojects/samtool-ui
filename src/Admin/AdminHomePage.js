import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Layout from "../components/1.CommonLayout/Layout";
import axios from "axios";
import { counter, rootTitle } from "../../src/CommonFunctions";

let orgCount = 0; // Default count of organizational users.
let indiCount = 0; // Default count of individual users.
let startCounter;

const AdminHomePage = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const setHeaderAndUrl = () => {
    let headers = "";
    if (data) {
      headers = { Authorization: data.logintoken };
    }
    let url = `/sam/v1/user-registration/auth`;
    return [headers, url];
  };

  const setCountOfUsers = async () => {
    // Get and store the count of both types of Users i.e. Individual Users and Organizational Users.
    const [headers, url] = setHeaderAndUrl();
    await axios.get(`${url}/type-count`, { headers: headers }).then((res) => {
      indiCount = parseInt(res.data.individual_count);
      orgCount = parseInt(res.data.org_count);
    });

    // To show counter animation on admin Home page.
    const totalCount = indiCount + orgCount;
    if (!totalCount <= 0) {
      totalCount > 100
        ? (startCounter = Math.floor((totalCount * 80) / 100))
        : (startCounter = 0);
      counter("usersCount", startCounter, totalCount, 1000);
    }
  };

  useEffect(() => {
    rootTitle.textContent = "ADMIN - HOME";
    setCountOfUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-8 scrollable-right-div mt-4 mt-md-0">
            <div className="container-fluid wrapper admin-home-wrapper">
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6">
                  <NavLink
                    to="/admin/property/properties"
                    className="card text-decoration-none py-3 admin-top-card"
                  >
                    <div className="row justify-content-center">
                      <div className="col-xl-3">
                        <i className="bi bi-buildings-fill text-white hover-color-secondary icon fs-1"></i>
                      </div>
                      <div className="col-xl-5 text-end">
                        <span className="fw-bold text-white hover-color-secondary fs-1">
                          180
                        </span>
                        <br />
                        <span className="fw-bold fs-5 text-white hover-color-secondary">
                          Properties
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 mt-4 mt-md-0">
                  <NavLink
                    to="/admin/users"
                    className="card py-3 admin-top-card text-decoration-none"
                  >
                    <div className="row justify-content-center">
                      <div className="col-xl-3">
                        <i className="bi bi-person-fill text-white hover-color-secondary icon fs-1"></i>
                      </div>
                      <div className="col-xl-5 text-end">
                        <span
                          className="fw-bold text-white hover-color-secondary fs-1"
                          id="usersCount"
                        >
                          0
                        </span>
                        <br />
                        <span className="fw-bold fs-5 text-white hover-color-secondary">
                          Users
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHomePage;
