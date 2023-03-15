import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { rootTitle } from "../../CommonFunctions";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";
// import propertyData from "./data.json";

let authHeader = "";
const ViewAllProperties = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const [properties, setProperties] = useState([]);

  const getPropertiesFromApi = async () => {
    const propertiesRes = await axios.get(
      `/sam/v1/property/auth/all-properties`,
      { headers: authHeader }
    );
    setProperties(propertiesRes.data);
  };

  const deleteProperty = (propertyId) => {
    const propertiesToShow = properties.filter((property) => {
      return property._id !== propertyId;
    });
    toast.success(`Property with ID: ${propertyId} deleted Successfuly`);
    setProperties(propertiesToShow);
  };

  const deleteAllProperties = () => {
    toast.success("Deleted All Properties");
    setProperties([]);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    rootTitle.textContent = "ADMIN - PROPERTIES";
    getPropertiesFromApi();
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-8 mt-4 mt-md-0">
            <BreadCrumb />
            {properties.length <= 0 ? (
              <div className="d-flex align-items-center justify-content-center mt-5">
                <h1 className="fw-bold custom-heading-color">
                  Sorry ! No Properties Found :(
                </h1>
              </div>
            ) : (
              <section className="admin-view-all-properties mb-5">
                <h1 className="text-center text-primary fw-bold">Properties</h1>
                <hr />
                <div className="container-fluid scrollable-right-div">
                  <div className="row">
                    {properties.map((property, Index) => {
                      return (
                        <div className="col-lg-3 col-md-4" key={Index}>
                          <div className="admin-property-card-wrapper">
                            <div className="card mb-4">
                              <div className="top-line"></div>
                              <img
                                className="card-img-top"
                                src="/images2.jpg"
                                alt=""
                              />
                              <div className="card-body">
                                <h3 className="card-title text-uppercase">
                                  {/* {property.title} */}
                                </h3>
                                <span className="text-capitalize fw-bold">
                                  {property.category}
                                </span>
                                <br />
                                <span className="text-capitalize">
                                  Location: {property.city_name}
                                </span>
                                <br />
                                <span className="text-capitalize">
                                  Market Value:{" "}
                                  {parseInt(property.market_value) / 10000000 +
                                    " Cr."}
                                </span>
                                <br />
                                <span className="text-capitalize">
                                  Range:{" "}
                                  {parseInt(property.range.split("-")[0]) /
                                    10000000 +
                                    " Cr." +
                                    " - " +
                                    parseInt(property.range.split("-")[1]) /
                                      10000000 +
                                    " Cr."}
                                </span>
                                <br />
                                <div className="mt-3">
                                  <NavLink
                                    to={`/admin/property/properties/edit-property/${property._id}`}
                                    className="btn btn-outline-primary"
                                  >
                                    Edit
                                  </NavLink>
                                  <button
                                    // onClick={() => {
                                    //   deleteProperty(property._id);
                                    // }}
                                    className="ms-2 btn btn-outline-danger"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr />
                {/* <div className="text-end">
                  <button
                    onClick={deleteAllProperties}
                    className="btn btn-outline-danger"
                  >
                    Delete All
                  </button>
                </div> */}
              </section>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAllProperties;
