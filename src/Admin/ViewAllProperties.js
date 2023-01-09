import React from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import propertyData from "./data.json";

const ViewAllProperties = () => {
  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9 scrollable-right-div">
            <section className="admin-view-all-properties wrapper">
              <h1 className="text-center mb-4 text-primary fw-bold">
                Properties
              </h1>
              <div className="container-fluid">
                <div className="row">
                  {propertyData ? (
                    propertyData.map((property, Index) => {
                      return (
                        <div className="col-lg-3 col-md-4" key={Index}>
                          <div className="admin-property-card-wrapper">
                            <div className="card mb-4">
                              <div className="top-line"></div>
                              <img
                                className="card-img-top"
                                src="/images1.jpg"
                                alt=""
                              />
                              <div className="card-body">
                                <h3 className="card-title text-uppercase">
                                  {/* {property.title} */}
                                </h3>
                                <span className="text-capitalize fw-bold">
                                  {property.count + " " + property.category}
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
                                    to={`/admin/property/edit-property/${property._id}`}
                                    className="btn btn-outline-primary"
                                  >
                                    Edit
                                  </NavLink>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-5 text-center">
                      <h2 className="text-capitalize">
                        Sorry! No result found :(
                      </h2>
                      <span className="">Please try with another options</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAllProperties;
