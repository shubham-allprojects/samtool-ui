import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";

let authHeader = "";
const ViewProperty = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const { id } = useParams();
  const [property, setProperty] = useState([]);

  const {
    type_name,
    Flat_No,
    PIN,
    branch_name,
    carpet_area,
    saleable_area,
    city_name,
    state_name,
    completion_date,
    purchase_date,
    sale_availability_date,
    expected_price,
    market_price,
    ready_reckoner_price,
    is_available_for_sale,
    is_sold,
    is_stressed,
    locality,
    mortgage_date,
    plot_no,
    property_number,
    society_name,
    status,
  } = property;

  const getCurrentProperty = async () => {
    const currentPropertyRes = await axios.get(
      `/sam/v1/property/auth/single-property/${id}`,
      { headers: authHeader }
    );
    setProperty(currentPropertyRes.data);
    console.log(currentPropertyRes.data);
  };

  useEffect(() => {
    getCurrentProperty();
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 mt-4 mt-md-0">
            <BreadCrumb />
            <section className="admin-edit-property">
              <h3 className="fw-bold text-primary pb-2">{type_name}</h3>
              <div className="container-fluid border border-1 p-3">
                <div className="row">
                  <div className="col-12"></div>
                  <div className="col-xl-5">
                    <div
                      id="carouselExampleIndicators"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-indicators property-slider-indicators">
                        <button
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to="0"
                          className="active"
                          aria-current="true"
                          aria-label="Slide 1"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to="1"
                          aria-label="Slide 2"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to="2"
                          aria-label="Slide 3"
                        ></button>
                      </div>
                      <div className="carousel-inner">
                        <div
                          className="carousel-item active"
                          data-bs-interval="2000"
                        >
                          <img
                            src="/images2.jpg"
                            className="d-block w-100"
                            alt="..."
                          />
                        </div>
                        <div className="carousel-item" data-bs-interval="2000">
                          <img
                            src="/images2.jpg"
                            className="d-block w-100"
                            alt="..."
                          />
                        </div>
                        <div className="carousel-item">
                          <img
                            src="/images2.jpg"
                            className="d-block w-100"
                            alt="..."
                          />
                        </div>
                      </div>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                      </button>
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xl-4">
                          <span className="text-muted">
                            <i className="bi bi-tag pe-2"></i>Market Price
                          </span>
                          <h5 className="mt-2">
                            <i class="bi bi-currency-rupee"></i>
                            {market_price}
                          </h5>
                        </div>
                        <div className="col-xl-4">
                          <span className="text-muted">
                            <i className="bi bi-geo-alt pe-2"></i>Location
                          </span>
                          <h5 className="mt-2">
                            {city_name}, {state_name}
                          </h5>
                        </div>
                        <div className="col-xl-4">
                          <span className="text-muted">
                            <i className="bi bi-calendar-check pe-2"></i>
                            Completion Date
                          </span>
                          <h5 className="mt-2">
                            {completion_date
                              ? completion_date
                                  .split(" ")[0]
                                  .split("-")
                                  .reverse()
                                  .join("-")
                              : "NA"}
                          </h5>
                        </div>
                        <div className="col-xl-4 mt-xl-3">
                          <span className="text-muted">
                            <i className="bi bi-pin-map pe-2"></i>
                            Area
                          </span>
                          <div className="container-fluid mt-2">
                            <div className="row">
                              <div className="col-6">
                                <small className="text-muted">
                                  Saleable Area
                                </small>
                                <h5>{saleable_area}</h5>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">
                                  Carpet Area
                                </small>
                                <h5>{carpet_area}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-xl-3">
                          <span className="text-muted">
                            <i className="bi bi-bank pe-2"></i>Bank Branch
                          </span>
                          <h5 className="mt-2">{branch_name}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 mt-3">
                    <div className="row">
                      <div className="col-4">
                        <div className="card p-2 text-center border-primary border-2 border">
                          <small className="text-muted">Property Number</small>
                          <small className="common-btn-font">
                            {property_number}
                          </small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card p-2 text-center border-primary border-2 border">
                          <small className="text-muted">Purchase Date</small>
                          <small className="common-btn-font">
                            {purchase_date
                              ? purchase_date
                                  .split(" ")[0]
                                  .split("-")
                                  .reverse()
                                  .join("-")
                              : "NA"}
                          </small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card p-2 text-center border-primary border-2 border">
                          <small className="text-muted">
                            Sale Availability
                          </small>
                          <small className="common-btn-font">
                            {is_available_for_sale === "1"
                              ? "Available for sale"
                              : "Not Available for sale"}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7"></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewProperty;
