import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Layout from "../components/1.CommonLayout/Layout";
import axios from "axios";
import { counter } from "../../src/CommonFunctions";

let orgCount = 0;
let indiCount = 0;
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
    const [headers, url] = setHeaderAndUrl();
    await axios.get(`${url}/type-count`, { headers: headers }).then((res) => {
      indiCount = parseInt(res.data.individual_count);
      orgCount = parseInt(res.data.org_count);
    });

    const totalCount = indiCount + orgCount;
    if (!totalCount <= 0) {
      totalCount > 100
        ? (startCounter = Math.floor((totalCount * 80) / 100))
        : (startCounter = 0);
      counter("usersCount", startCounter, totalCount, 1000);
    }
  };

  useEffect(() => {
    setCountOfUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9 scrollable-right-div mt-4 mt-md-0">
            <div className="container-fluid wrapper admin-home-wrapper">
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6">
                  <NavLink
                    to="/admin/property"
                    className="card py-3 admin-top-cards"
                  >
                    <span className="me-xl-5 me-4">
                      <i className="bi bi-buildings-fill text-white fs-1 blue-on-hover"></i>
                    </span>
                    <div>
                      <span className="admin-dashboard-count">180</span>
                      <h5 className="text-white text-end blue-on-hover fw-bold">
                        Properties
                      </h5>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 mt-4 mt-md-0">
                  <NavLink
                    to="/admin/users"
                    className="card py-3 admin-top-cards"
                  >
                    <span className="me-xl-5 me-4">
                      <i className="bi bi-person-fill text-white fs-1 blue-on-hover"></i>
                    </span>
                    <div>
                      <span className="admin-dashboard-count" id="usersCount">
                        0
                      </span>
                      <h5 className="text-white text-end blue-on-hover fw-bold">
                        Users
                      </h5>
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
