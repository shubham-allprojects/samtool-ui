import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Layout from "../components/1.CommonLayout/Layout";
import axios from "axios";

const AdminHomePage = () => {
  const [individualUsersCount, setIndividualUsersCount] = useState(0);
  const [orgUsersCount, setOrgUsersCount] = useState(0);
  const data = JSON.parse(localStorage.getItem("data"));

  const setHeaderAndUrl = () => {
    let headers = "";
    if (data) {
      headers = { Authorization: data.logintoken };
    }
    let url = `/sam/v1/user-registration/auth/get-users`;
    return [headers, url];
  };

  const setIndividualUsersDetails = async (pageNumber, records_per_page) => {
    const [headers, url] = setHeaderAndUrl();
    const individualBodyData = {
      type: "Individual User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };
    await axios
      .post(url, individualBodyData, { headers: headers })
      .then((res) => {
        setIndividualUsersCount(res.data.count);
      });
  };

  const setOrgUsersDetails = async (pageNumber, records_per_page) => {
    const [headers, url] = setHeaderAndUrl();
    const orgBodyData = {
      type: "Organizational User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };
    await axios.post(url, orgBodyData, { headers: headers }).then((res) => {
      setOrgUsersCount(res.data.count);
    });
  };

  useEffect(() => {
    setIndividualUsersDetails(1, 1);
    setOrgUsersDetails(1, 1);
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9 scrollable-right-div">
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
                      <span className="admin-dashboard-count">
                        {individualUsersCount + orgUsersCount}
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
