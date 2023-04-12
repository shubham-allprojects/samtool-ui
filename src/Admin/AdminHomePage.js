import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Layout from "../components/1.CommonLayout/Layout";
import axios from "axios";
import { counter, rootTitle } from "../../src/CommonFunctions";
import { Chart as CharJs, registerables } from "chart.js";
import { Pie, Doughnut, Bar } from "react-chartjs-2";

let organizationalUsersCount = 0; // Default count of organizational users.
let individualUsersCount = 0; // Default count of individual users.
let propertyStartCounter;
let individualUsersStartCounter;
let organizationalUsersStartCounter;

const AdminHomePage = () => {
  CharJs.register(...registerables);
  const data = JSON.parse(localStorage.getItem("data"));
  const [countOfUsers, setCountOfUsers] = useState({
    countOfIndividualUsers: 0,
    countOfOrgUsers: 0,
  });
  const { countOfIndividualUsers, countOfOrgUsers } = countOfUsers;
  const [typeWisePropertyDetails, setTypeWisePropertyDetails] = useState({});

  const { propertyTypesCount, propertyLabels, typeWiseCount } =
    typeWisePropertyDetails;
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
      individualUsersCount = parseInt(res.data.individual_count);
      organizationalUsersCount = parseInt(res.data.org_count);
    });
    setCountOfUsers({
      countOfIndividualUsers: individualUsersCount,
      countOfOrgUsers: organizationalUsersCount,
    });
    // To show counter animation on admin Home page.
    if (!individualUsersCount <= 0) {
      individualUsersCount > 100
        ? (individualUsersStartCounter = Math.floor(
            (individualUsersCount * 80) / 100
          ))
        : (individualUsersStartCounter = 0);
      counter(
        "individualCount",
        individualUsersStartCounter,
        individualUsersCount,
        1000
      );
    }
    if (!organizationalUsersCount <= 0) {
      organizationalUsersCount > 100
        ? (organizationalUsersStartCounter = Math.floor(
            (organizationalUsersCount * 80) / 100
          ))
        : (organizationalUsersStartCounter = 0);
      counter(
        "organizationalCount",
        organizationalUsersStartCounter,
        organizationalUsersCount,
        1000
      );
    }
  };

  const [chart1Type, setChart1Type] = useState("pie");
  const [chart2Type, setChart2Type] = useState("bar");
  const [chart2TitleVisible, setChart2TitleVisible] = useState(true);

  const onChart1Selection = (e) => {
    const { value } = e.target;
    if (value === "pie") {
      setChart1Type("pie");
    } else if (value === "bar") {
      setChart1Type("bar");
    } else if (value === "doughnut") {
      setChart1Type("doughnut");
    }
  };

  const onChart2Selection = (e) => {
    const { value } = e.target;
    if (value === "bar2") {
      setChart2TitleVisible(false);
      setChart2Type("bar");
    } else if (value === "doughnut2") {
      setChart2TitleVisible(true);
      setChart2Type("doughnut");
    }
  };

  const pieChart1Data = {
    labels: ["Individual", "Organizational"],
    datasets: [
      {
        label: "Count",
        data: [countOfIndividualUsers, countOfOrgUsers],
        backgroundColor: ["rgb(13, 110, 253)", "orange"],
        borderColor: ["black"],
        borderWidth: 1,
      },
    ],
  };

  const barChart1Data = {
    labels: ["Users"],
    datasets: [
      {
        label: "Individual",
        data: [countOfIndividualUsers],
        backgroundColor: "rgb(13, 110, 253)",
        borderColor: "black",
        borderWidth: 1,
      },
      {
        label: "Organizational",
        data: [countOfOrgUsers],
        backgroundColor: "orange",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const chart2Data = {
    labels: propertyLabels,
    datasets: [
      {
        label: "Properties",
        data: typeWiseCount,
        backgroundColor: ["rgb(13, 110, 253)", "orange", "green"],
        borderColor: ["black"],
        borderWidth: 1,
      },
    ],
  };

  const chart1Options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Users",
      },
    },
  };

  const chart2Options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Properties",
      },
      legend: {
        display: chart2TitleVisible,
      },
    },
  };

  const getPropertyCountFromApi = async () => {
    const [headers] = setHeaderAndUrl();
    const propertyCountRes = await axios.get(
      `sam/v1/property/auth/property-count`,
      { headers: headers }
    );
    let arr = propertyCountRes.data;
    let totalCount = 0;
    let labels = [];
    let labelWiseCount = [];

    arr.forEach((type) => {
      totalCount += type.count;
      labels.push(type.type_Name);
      labelWiseCount.push(type.count);
    });

    setTypeWisePropertyDetails({
      propertyTypesCount: arr.length,
      propertyLabels: labels,
      typeWiseCount: labelWiseCount,
    });

    // To show counter animation on admin Home page.
    if (!totalCount <= 0) {
      totalCount > 100
        ? (propertyStartCounter = Math.floor((totalCount * 80) / 100))
        : (propertyStartCounter = 0);
      counter("propertyCount", propertyStartCounter, totalCount, 1000);
    }
  };

  useEffect(() => {
    rootTitle.textContent = "ADMIN - HOME";
    document.getElementById("pie").checked = true;
    document.getElementById("bar2").checked = true;
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
          <div className="col-xl-10 col-lg-9 col-md-8">
            <div className="container-fluid my-4 admin-home-wrapper">
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <NavLink
                    to="/admin/property/properties"
                    className="card text-decoration-none admin-top-card"
                  >
                    <div className="container-fluid p-4">
                      <div className="row justify-content-center">
                        <div className="col-12 col-5 text-center fw-bold text-white hover-color-secondary fs-5">
                          <div>
                            <i className="bi bi-buildings-fill text-white hover-color-secondary icon fs-1 me-4"></i>
                            <span className="fs-1" id="propertyCount">
                              0
                            </span>
                          </div>
                          <span>Properties</span>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-md-6 mt-4 mt-md-0">
                  <NavLink
                    to="/admin/property/upload-properties"
                    className="card admin-top-card text-decoration-none"
                  >
                    <div className="container-fluid">
                      <div className="row justify-content-center">
                        <div className="col-12 text-center text-white hover-color-secondary">
                          <div>
                            <i className="bi bi-upload text-white hover-color-secondary icon fs-1"></i>
                          </div>
                          <h5 className="fw-bold">Upload Bulk Properties</h5>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-md-6 mt-4 mt-xl-0">
                  <NavLink
                    to="/admin/users/individual-users"
                    className="card admin-top-card text-decoration-none"
                  >
                    <div className="container-fluid">
                      <div className="row justify-content-center">
                        <div className="col-12 col-5 text-center fw-bold text-white hover-color-secondary fs-5">
                          <div>
                            <i className="bi bi-person-circle text-white hover-color-secondary icon fs-1 me-4"></i>
                            <span className="fs-1" id="individualCount">
                              0
                            </span>
                          </div>
                          <span>Individual Users</span>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-xl-3 col-md-6 mt-4 mt-xl-0">
                  <NavLink
                    to="/admin/users/organizational-users"
                    className="card admin-top-card text-decoration-none"
                  >
                    <div className="container-fluid">
                      <div className="row justify-content-center">
                        <div className="col-12 col-5 text-center fw-bold text-white hover-color-secondary fs-5">
                          <div>
                            <i className="bi bi-laptop-fill text-white hover-color-secondary icon fs-1 me-4"></i>
                            <span className="fs-1" id="organizationalCount">
                              0
                            </span>
                          </div>
                          <span>Organizational Users</span>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
              <hr className="my-4" />
              <div className="row">
                <div className="col-xl-6">
                  <div
                    className="container-fluid shadow"
                    style={{ border: "1px solid var(--primary-color)" }}
                  >
                    <div className="row chart-wrapper position-relative bg-light">
                      <div className="h-100 w-100 canvas-wrapper d-flex justify-content-center position-absolute p-4">
                        <Pie
                          className={`${chart1Type === "pie" ? "" : "d-none"}`}
                          data={pieChart1Data}
                          options={chart1Options}
                        ></Pie>
                        <Bar
                          className={`${chart1Type === "bar" ? "" : "d-none"}`}
                          data={barChart1Data}
                          options={chart1Options}
                        ></Bar>
                        <Doughnut
                          className={`${
                            chart1Type === "doughnut" ? "" : "d-none"
                          }`}
                          data={pieChart1Data}
                          options={chart1Options}
                        ></Doughnut>
                      </div>
                    </div>
                    <div className="row p-2 ">
                      <div className="col-md-3">
                        <span className="common-btn-font text-primary">
                          Chart View
                        </span>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div className="form-check form-check-inline">
                          <input
                            onChange={onChart1Selection}
                            className="form-check-input chart1check"
                            type="radio"
                            name="chart1"
                            id="pie"
                            value="pie"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio2"
                          >
                            Pie
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div className="form-check form-check-inline">
                          <input
                            onChange={onChart1Selection}
                            className="form-check-input chart1check"
                            type="radio"
                            name="chart1"
                            id="bar"
                            value="bar"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio1"
                          >
                            Bar
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div className="form-check form-check-inline">
                          <input
                            onChange={onChart1Selection}
                            className="form-check-input chart1check"
                            type="radio"
                            name="chart1"
                            id="doughnut"
                            value="doughnut"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio3"
                          >
                            Doughnut
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 mt-xl-0 mt-4">
                  <div
                    className="container-fluid shadow"
                    style={{ border: "1px solid var(--primary-color)" }}
                  >
                    <div className="row chart-wrapper position-relative bg-light">
                      <div className="h-100 w-100 canvas-wrapper d-flex justify-content-center position-absolute p-4">
                        <Bar
                          className={`${chart2Type === "bar" ? "" : "d-none"}`}
                          data={chart2Data}
                          options={chart2Options}
                        ></Bar>

                        <Doughnut
                          className={`${
                            chart2Type === "doughnut" ? "" : "d-none"
                          }`}
                          data={chart2Data}
                          options={chart2Options}
                        ></Doughnut>
                      </div>
                    </div>
                    <div className="row p-2 ">
                      <div className="col-md-3">
                        <span className="common-btn-font text-primary">
                          Chart View
                        </span>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div className="form-check form-check-inline">
                          <input
                            onChange={onChart2Selection}
                            className="form-check-input chart1check"
                            type="radio"
                            name="chart2"
                            id="bar2"
                            value="bar2"
                          />
                          <label className="form-check-label" htmlFor="bar2">
                            Bar
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div className="form-check form-check-inline">
                          <input
                            onChange={onChart2Selection}
                            className="form-check-input chart1check"
                            type="radio"
                            name="chart2"
                            id="doughnut2"
                            value="doughnut2"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="doughnut2"
                          >
                            Doughnut
                          </label>
                        </div>
                      </div>
                    </div>
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
