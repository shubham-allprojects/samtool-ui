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
                    {/* <img
                      src="/images2.jpg"
                      alt="property-pic"
                      className="img-fluid"
                    /> */}
                    <div
                      id="carouselExampleIndicators"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-indicators">
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
                        <div className="carousel-item active" data-bs-interval="2000">
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
                        <span className="visually-hidden">Previous</span>
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
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                  {/* <div className="col-xl-5 d-flex justify-content-center align-items-center">
                    <div>
                      <h1 className="fw-bold text-primary">
                        {type_name}
                      </h1>
                      <div className="text-center">
                        <span>{`${city_name}, ${state_name}.`}</span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 text-center mb-3">
                        <span className="fw-bold">Pricing:</span> <br />
                        Market Price: {parseInt(market_price) /
                          10000000} Cr. <br />
                        Price range: {parseInt(ready_reckoner_price) /
                          10000000}{" "}
                        Cr. - {parseInt(expected_price) / 10000000} Cr.
                      </div>

                      <div className="col-12 text-center mb-3">
                        <span className="fw-bold">Area:</span> <br />
                        Saleable Area: {saleable_area} <br />
                        Carpet Area: {carpet_area}
                      </div>

                      <div className="col-12 text-center mb-3">
                        <span className="fw-bold">Address:</span> <br />
                        {city_name} - {PIN}, {state_name}, Loaclity: {locality}
                      </div>

                      <div className="col-12 text-center mb-3">
                        <span className="fw-bold">Dates:</span> <br />
                        Completion date:{" "}
                        {completion_date
                          ? completion_date.split(" ")[0]
                          : "NA"}{" "}
                        <br />
                        Purchase date:{" "}
                        {purchase_date ? purchase_date.split(" ")[0] : "NA"}
                      </div>
                    </div>
                  </div> */}
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
