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
            <section className="admin-edit-property wrapper">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xl-7 p-0">
                    <div className="currentPropertyImgWrapper">
                      <img
                        src="/images2.jpg"
                        alt="property-pic"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-xl-5">
                    <h3 className="text-center fw-bold text-primary">
                      {type_name}
                    </h3>
                    <div className="text-center">
                      <span>{`${city_name}, ${state_name}.`}</span>
                    </div>
                    <hr />
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
                        Completion date: {completion_date.split(" ")[0]} <br />
                        Purchase date: {purchase_date.split(" ")[0]}
                      </div>
                    </div>
                  </div>
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
