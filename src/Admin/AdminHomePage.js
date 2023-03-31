import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Layout from "../components/1.CommonLayout/Layout";
import axios from "axios";
import { counter, rootTitle } from "../../src/CommonFunctions";
import { Chart as CharJs, registerables } from "chart.js";
import { Line, Pie, Doughnut, Bar } from "react-chartjs-2";

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

  const [chart1Type, setChart1Type] = useState("pie");
  const [chart2Type, setChart2Type] = useState("line");

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
    if (value === "line2") {
      setChart2Type("line");
    } else if (value === "bar2") {
      setChart2Type("bar");
    } else if (value === "doughnut2") {
      setChart2Type("doughnut");
    }
  };

  const pieChart1Data = {
    labels: ["Individual", "Organizational"],
    datasets: [
      {
        label: "Count",
        data: [45, 20],
        backgroundColor: ["rgba(255, 165, 0, 0.5)", "rgba(13, 110, 253, 0.5)"],
        borderColor: ["orange", "rgb(13, 110, 253)"],
      },
    ],
  };

  const pieChart2Data = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "Users",
        data: [38, 10],
        backgroundColor: ["rgba(255, 165, 0, 0.5)", "rgba(13, 110, 253, 0.5)"],
        borderColor: ["orange", "rgb(13, 110, 253)"],
      },
    ],
  };

  const barChart1Data = {
    labels: ["Users"],
    datasets: [
      {
        label: "Individual",
        data: [45],
        backgroundColor: "rgba(13, 110, 253, 0.5)",
        borderColor: "rgb(13, 110, 253)",
        borderWidth: "2",
      },
      {
        label: "Organizational",
        data: [20],
        backgroundColor: "rgba(255, 165, 0, 0.5)",
        borderColor: "orange",
        borderWidth: "2",
      },
    ],
  };

  const barChart2Data = {
    labels: ["Users"],
    datasets: [
      {
        label: "Active",
        data: [38],
        backgroundColor: "rgba(13, 110, 253, 0.5)",
        borderColor: "rgb(13, 110, 253)",
        borderWidth: "2",
      },
      {
        label: "Inactive",
        data: [10],
        backgroundColor: "rgba(255, 165, 0, 0.5)",
        borderColor: "orange",
        borderWidth: "2",
      },
    ],
  };

  const lineChart2Data = {
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

  const chart1Options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Users Count",
      },
    },
  };

  const chart2Options = {
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
    const propertyCountRes = await axios.get(
      `sam/v1/property/auth/property-count`,
      { headers: headers }
    );
    // To show counter animation on admin Home page.
    const totalCount = propertyCountRes.data.count;
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
    document.getElementById("line2").checked = true;
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
                <div className="col-xl-6">
                  <div className="container-fluid border shadow-sm">
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
                        <span className="common-btn-font">Chart View</span>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div class="form-check form-check-inline">
                          <input
                            onChange={onChart1Selection}
                            class="form-check-input chart1check"
                            type="radio"
                            name="chart1"
                            id="pie"
                            value="pie"
                          />
                          <label class="form-check-label" for="inlineRadio2">
                            Pie
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div class="form-check form-check-inline">
                          <input
                            onChange={onChart1Selection}
                            class="form-check-input chart1check"
                            type="radio"
                            name="chart1"
                            id="bar"
                            value="bar"
                          />
                          <label class="form-check-label" for="inlineRadio1">
                            Bar
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div class="form-check form-check-inline">
                          <input
                            onChange={onChart1Selection}
                            class="form-check-input chart1check"
                            type="radio"
                            name="chart1"
                            id="doughnut"
                            value="doughnut"
                          />
                          <label class="form-check-label" for="inlineRadio3">
                            Doughnut
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 mt-xl-0 mt-4">
                  <div className="container-fluid border shadow-sm">
                    <div className="row chart-wrapper position-relative bg-light">
                      <div className="h-100 w-100 canvas-wrapper d-flex justify-content-center position-absolute p-4">
                        <Line
                          className={`${chart2Type === "line" ? "" : "d-none"}`}
                          data={lineChart2Data}
                          options={chart2Options}
                        ></Line>
                        <Bar
                          className={`${chart2Type === "bar" ? "" : "d-none"}`}
                          data={barChart2Data}
                          options={chart2Options}
                        ></Bar>
                        <Doughnut
                          className={`${
                            chart2Type === "doughnut" ? "" : "d-none"
                          }`}
                          data={pieChart2Data}
                          options={chart2Options}
                        ></Doughnut>
                      </div>
                    </div>
                    <div className="row p-2 ">
                      <div className="col-md-3">
                        <span className="common-btn-font">Chart View</span>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div class="form-check form-check-inline">
                          <input
                            onChange={onChart2Selection}
                            class="form-check-input chart1check"
                            type="radio"
                            name="chart2"
                            id="line2"
                            value="line2"
                          />
                          <label class="form-check-label" for="line2">
                            Line
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div class="form-check form-check-inline">
                          <input
                            onChange={onChart2Selection}
                            class="form-check-input chart1check"
                            type="radio"
                            name="chart2"
                            id="bar2"
                            value="bar2"
                          />
                          <label class="form-check-label" for="bar2">
                            Bar
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 mt-md-0 mt-2 col-6">
                        <div class="form-check form-check-inline">
                          <input
                            onChange={onChart2Selection}
                            class="form-check-input chart1check"
                            type="radio"
                            name="chart2"
                            id="doughnut2"
                            value="doughnut2"
                          />
                          <label class="form-check-label" for="doughnut2">
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
