import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Layout from "../components/1.CommonLayout/Layout";
import axios from "axios";
import { counter, rootTitle } from "../../src/CommonFunctions";
import { Chart as CharJs, registerables } from "chart.js";
import { Line, Pie } from "react-chartjs-2";

let orgCount = 0; // Default count of organizational users.
let indiCount = 0; // Default count of individual users.
let startCounter;
let propertyStartCounter;

const AdminHomePage = () => {
  CharJs.register(...registerables);
  const data = JSON.parse(localStorage.getItem("data"));
  const [countOfUsers, setCountOfUsers] = useState({
    countOfIndividualUsers: 0,
    countOfOrgUsers: 0,
  });
  const { countOfIndividualUsers, countOfOrgUsers } = countOfUsers;
  const setHeaderAndUrl = () => {
    let headers = "";
    if (data) {
      headers = { Authorization: data.logintoken };
    }
    let url = `/sam/v1/user-registration/auth`;
    return [headers, url];
  };

  const setTotalCountOfUsers = async () => {
    // Get and store the count of both types of Users i.e. Individual Users and Organizational Users.
    const [headers, url] = setHeaderAndUrl();
    await axios.get(`${url}/type-count`, { headers: headers }).then((res) => {
      indiCount = parseInt(res.data.individual_count);
      orgCount = parseInt(res.data.org_count);
    });
    setCountOfUsers({
      countOfIndividualUsers: indiCount,
      countOfOrgUsers: orgCount,
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

  const lineChartData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        fill: true,
        label: "Count",
        data: [15, 21],
        borderColor: "rgb(13, 110, 253)",
        backgroundColor: "rgba(13, 110, 253, 0.5)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Individual", "Organizational"],
    datasets: [
      {
        label: "Count",
        data: [countOfIndividualUsers, countOfOrgUsers],
        backgroundColor: ["orange", "rgb(13, 110, 253)"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Users Count",
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Status Of Users",
      },
    },
  };

  const getPropertyCountFromApi = async () => {
    const [headers] = setHeaderAndUrl();
    const propertiesRes = await axios.get(
      `sam/v1/property/auth/property-count`,
      { headers: headers }
    );
    // To show counter animation on admin Home page.
    const totalCount = propertiesRes.data.count;
    if (!totalCount <= 0) {
      totalCount > 100
        ? (propertyStartCounter = Math.floor((totalCount * 80) / 100))
        : (propertyStartCounter = 0);
      counter("propertyCount", propertyStartCounter, totalCount, 1000);
    }
  };

  useEffect(() => {
    rootTitle.textContent = "ADMIN - HOME";
    if (data) {
      setTotalCountOfUsers();
      getPropertyCountFromApi();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 mt-5 mt-md-0">
            <div className="container-fluid my-4 admin-home-wrapper">
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <NavLink
                    to="/admin/property/properties"
                    className="card text-decoration-none admin-top-card"
                  >
                    <div className="row justify-content-center">
                      <div className="col-xl-3 col-md-3 col-3">
                        <i className="bi bi-buildings-fill text-white hover-color-secondary icon fs-1"></i>
                      </div>
                      <div className="col-xl-6 col-md-7 col-5 text-end">
                        <span className="fw-bold text-white hover-color-secondary fs-5">
                          <span className="fs-3" id="propertyCount">
                            0
                          </span>
                          <br /> Properties
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-md-6 mt-4 mt-md-0">
                  <NavLink
                    to="/admin/property/upload-properties"
                    className="card admin-top-card text-decoration-none"
                  >
                    <div className="row justify-content-center">
                      <div className="col-xl-3 col-md-3 col-3">
                        <i className="bi bi-upload text-white hover-color-secondary icon fs-1"></i>
                      </div>
                      <div className="col-xl-6 col-md-7 col-5 text-end">
                        <span className="fw-bold text-white hover-color-secondary fs-5">
                          <span className="fs-4">Upload</span> <br /> Properties
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-md-6 mt-4 mt-xl-0">
                  <NavLink
                    to="/admin/users"
                    className="card admin-top-card text-decoration-none"
                  >
                    <div className="row justify-content-center">
                      <div className="col-xl-3 col-md-3 col-3">
                        <i className="bi bi-person-fill text-white hover-color-secondary icon fs-1"></i>
                      </div>
                      <div className="col-xl-6 col-md-7 col-5 text-end">
                        <span className="fw-bold text-white hover-color-secondary fs-5">
                          <span id="usersCount" className="fs-3">
                            0
                          </span>
                          <br /> Users
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-md-6 mt-4 mt-xl-0">
                  <div className="card admin-top-card text-decoration-none">
                    <div className="row justify-content-center">
                      <div className="col-xl-3 col-md-3 col-3">
                        <i className="bi bi-person-fill text-white hover-color-secondary icon fs-1"></i>
                      </div>
                      <div className="col-xl-6 col-md-7 col-5 text-end">
                        <span className="fw-bold text-white hover-color-secondary fs-5">
                          <span id="usersCount" className="fs-3">
                            count
                          </span>
                          <br /> Title
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="row">
                <div className="col-xl-4">
                  <div className="card chart-wrapper">
                    <Pie data={pieChartData} options={pieChartOptions}></Pie>
                  </div>
                </div>
                <div className="col-xl-8 mt-xl-0 mt-4">
                  <div className="card chart-wrapper">
                    <Line
                      data={lineChartData}
                      options={lineChartOptions}
                    ></Line>
                  </div>
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
