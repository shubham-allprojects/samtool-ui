import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Layout from "../components/1.CommonLayout/Layout";
import axios from "axios";

let orgCount = 0;
let indiCount = 0;

const AdminHomePage = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const setHeaderAndUrl = () => {
    let headers = "";
    if (data) {
      headers = { Authorization: data.logintoken };
    }
    let url = `/sam/v1/user-registration/auth/get-users`;
    return [headers, url];
  };

  const setCountOfUsers = async () => {
    const [headers, url] = setHeaderAndUrl();
    const individualBodyData = {
      type: "Individual User",
      page_number: 1,
      number_of_records: 1,
    };
    const orgBodyData = {
      type: "Organizational User",
      page_number: 1,
      number_of_records: 1,
    };

    await axios
      .post(url, individualBodyData, { headers: headers })
      .then((res) => {
        indiCount = res.data.count;
      });

    await axios.post(url, orgBodyData, { headers: headers }).then((res) => {
      orgCount = res.data.count;
    });

    console.log(orgCount, indiCount);
    counter("usersCount", 0, orgCount + indiCount, 2500);
  };

  function counter(id, start, end, duration) {
    let obj = document.getElementById(id),
      current = start,
      range = end - start,
      increment = end > start ? 1 : -1,
      step = Math.abs(Math.floor(duration / range)),
      timer = setInterval(() => {
        current += increment;
        obj.textContent = current;
        if (current === end) {
          clearInterval(timer);
        }
      }, step);
  }

  useEffect(() => {
    setCountOfUsers();
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
