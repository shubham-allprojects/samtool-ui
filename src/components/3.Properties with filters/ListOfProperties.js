import React, { useRef } from "react";
import Layout from "../1.CommonLayout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const ListOfProperties = () => {
  const { data } = useParams();
  const dataFromParams = JSON.parse(decodeURIComponent(data));
  const localData = JSON.parse(localStorage.getItem("data"));
  const [enquiryFormData, setEnquiryFormData] = useState({
    user_id: localData.userId ?? "",
    property_id: "",
    enquiry_source: "email",
    enquiry_comments: "",
  });
  const enquiryForm = useRef();
  const { user_id, property_id, enquiry_source, enquiry_comments } =
    enquiryFormData;
  const goTo = useNavigate();
  const [selectedPropertyResults, setSelectedPropertyResults] = useState([]);
  const viewCurrentProperty = async (type, city, range) => {
    let minValueOfproperty = parseInt(range.split("-")[0]);
    let maxValueOfproperty = parseInt(range.split("-")[1]);
    let dataToPost = {
      property_type: type,
      city_name: city,
      minvalue: minValueOfproperty,
      maxvalue: maxValueOfproperty,
    };
    try {
      await axios
        .post(`/sam/v1/property/view-properties`, dataToPost)
        .then((res) => {
          setSelectedPropertyResults(res.data);
          console.log(res.data);
        });
    } catch (error) {}
  };

  const onEnquiryFieldsChange = (e) => {
    const { name, value } = e.target;
    if (name === "enquiry-comment") {
      setEnquiryFormData({ ...enquiryFormData, enquiry_comments: value });
    }
  };

  const onEnquiryFormSubmit = (e) => {
    e.preventDefault();
    console.log(enquiryFormData);
  };

  useEffect(() => {
    if (dataFromParams) {
      viewCurrentProperty(
        dataFromParams.type,
        dataFromParams.city,
        dataFromParams.range
      );
    }
  }, []);

  return (
    <Layout>
      <section className="list-of-properties section-padding min-100vh">
        <div className="container-fluid">
          <div className="row p-md-2">
            <div className="card p-3 border-0">
              <div className="container-fluid">
                <div className="row">
                  {selectedPropertyResults ? (
                    selectedPropertyResults.map((property, Index) => {
                      const {
                        property_id,
                        type_name,
                        market_price,
                        ready_reckoner_price,
                        expected_price,
                        saleable_area,
                        carpet_area,
                        is_sold,
                        is_available_for_sale,
                        completion_date,
                        purchase_date,
                        mortgage_date,
                        Flat_No,
                        society_name,
                        plot_no,
                        locality,
                        city_name,
                        zip,
                        state_name,
                        is_stressed,
                        territory,
                        distress_value,
                        title_clear_property,
                        possession_of_the_property,
                      } = property;
                      return (
                        <div key={Index} className="p-0">
                          <div className="p-0 fw-bold h4 text-primary">
                            Property: {Index + 1}
                          </div>
                          <div
                            className="col-12 border bg-light mb-4 p-0"
                            key={property_id}
                          >
                            <div className="container-fluid">
                              <div className="row p-2">
                                <div className="col-lg-4 col-md-5 p-0">
                                  <div
                                    id={`carouselExampleIndicators-${property_id}`}
                                    className="carousel slide"
                                    data-bs-ride="carousel"
                                  >
                                    <div className="carousel-indicators property-slider-indicators">
                                      <button
                                        type="button"
                                        data-bs-target={`#carouselExampleIndicators-${property_id}`}
                                        data-bs-slide-to="0"
                                        className="active"
                                        aria-current="true"
                                        aria-label="Slide 1"
                                      ></button>
                                      <button
                                        type="button"
                                        data-bs-target={`#carouselExampleIndicators-${property_id}`}
                                        data-bs-slide-to="1"
                                        aria-label="Slide 2"
                                      ></button>
                                      <button
                                        type="button"
                                        data-bs-target={`#carouselExampleIndicators-${property_id}`}
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
                                      <div
                                        className="carousel-item"
                                        data-bs-interval="2000"
                                      >
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
                                      data-bs-target={`#carouselExampleIndicators-${property_id}`}
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
                                      data-bs-target={`#carouselExampleIndicators-${property_id}`}
                                      data-bs-slide="next"
                                    >
                                      <span
                                        className="carousel-control-next-icon"
                                        aria-hidden="true"
                                      ></span>
                                    </button>
                                  </div>
                                </div>
                                <div className="col-lg-8 col-md-7 pe-0">
                                  <div className="container-fluid">
                                    <div className="row">
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-3 mt-md-0 ${
                                          type_name ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Property Type
                                        </small>
                                        <div className="common-btn-font">
                                          {type_name}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-3 mt-md-0 ${
                                          market_price ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Market Price
                                        </small>
                                        <div className="common-btn-font">
                                          <i className="bi bi-currency-rupee"></i>
                                          {(
                                            parseInt(market_price) / 10000000
                                          ).toFixed(2)}{" "}
                                          Cr.
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-lg-0 mt-3 ${
                                          ready_reckoner_price ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Ready Reckoner Price
                                        </small>
                                        <div className="common-btn-font">
                                          <i className="bi bi-currency-rupee"></i>
                                          {(
                                            parseInt(ready_reckoner_price) /
                                            10000000
                                          ).toFixed(2)}{" "}
                                          Cr.
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-0 mt-3 ${
                                          expected_price ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Expected Price
                                        </small>
                                        <div className="common-btn-font">
                                          <i className="bi bi-currency-rupee"></i>
                                          {(
                                            parseInt(expected_price) / 10000000
                                          ).toFixed(2)}{" "}
                                          Cr.
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          distress_value ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Distress value
                                        </small>
                                        <div className="common-btn-font">
                                          <i className="bi bi-currency-rupee"></i>
                                          {(
                                            parseInt(distress_value) / 10000000
                                          ).toFixed(2)}{" "}
                                          Cr.
                                        </div>
                                      </div>
                                      {/* <div className="col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3">
                              <small className="text-muted">Status</small>
                              <div className="common-btn-font">{status}</div>
                            </div> */}
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          saleable_area ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Saleable Area
                                        </small>
                                        <div className="common-btn-font">
                                          {saleable_area}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          carpet_area ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Carpet Area
                                        </small>
                                        <div className="common-btn-font">
                                          {carpet_area}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          is_stressed ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Is Stressed?
                                        </small>
                                        <div className="common-btn-font text-capitalize">
                                          {is_stressed === "1" ? "Yes" : "No"}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          is_sold ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Is Sold?
                                        </small>
                                        <div className="common-btn-font text-capitalize">
                                          {is_sold === "1" ? "Yes" : "No"}
                                        </div>
                                      </div>
                                      <div
                                        className={`${
                                          is_available_for_sale &&
                                          is_sold === "0"
                                            ? ""
                                            : "d-none"
                                        } col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 `}
                                      >
                                        <small className="text-muted">
                                          Is Available For Sale?
                                        </small>
                                        <div className="common-btn-font text-capitalize">
                                          {is_available_for_sale === "1"
                                            ? "Yes"
                                            : "No"}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          completion_date ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Completion Date
                                        </small>
                                        <div className="common-btn-font">
                                          {completion_date
                                            ? completion_date
                                                .split("T")[0]
                                                .split("-")
                                                .reverse()
                                                .join("-")
                                            : "Not Available"}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          purchase_date ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Purchase Date
                                        </small>
                                        <div className="common-btn-font">
                                          {purchase_date
                                            ? purchase_date
                                                .split("T")[0]
                                                .split("-")
                                                .reverse()
                                                .join("-")
                                            : "Not Available"}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          mortgage_date ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Mortgage Date
                                        </small>
                                        <div className="common-btn-font">
                                          {mortgage_date
                                            ? mortgage_date
                                                .split("T")[0]
                                                .split("-")
                                                .reverse()
                                                .join("-")
                                            : "Not Available"}
                                        </div>
                                      </div>

                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          title_clear_property ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Title clear property
                                        </small>
                                        <div className="common-btn-font text-capitalize">
                                          {title_clear_property === "1"
                                            ? "Yes"
                                            : "No"}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          possession_of_the_property
                                            ? ""
                                            : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Possession of the property
                                        </small>
                                        <div className="common-btn-font text-capitalize">
                                          {possession_of_the_property}
                                        </div>
                                      </div>
                                      <div
                                        className={`col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3 ${
                                          territory ? "" : "d-none"
                                        }`}
                                      >
                                        <small className="text-muted">
                                          Territory
                                        </small>
                                        <div className="common-btn-font text-capitalize">
                                          {territory}
                                        </div>
                                      </div>
                                      <div className="col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3">
                                        <small className="text-muted">
                                          Sale certificate
                                        </small>
                                        <div className="common-btn-font mt-2">
                                          <button className="btn btn-sm btn-outline-primary">
                                            View
                                          </button>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 col-lg-4 col-6 mt-xl-4 mt-3">
                                        <small
                                          className="text-muted"
                                          style={{ visibility: "hidden" }}
                                        >
                                          contact title
                                        </small>
                                        <div className="common-btn-font mt-2">
                                          <button
                                            data-bs-toggle="modal"
                                            data-bs-target="#commentModal"
                                            className="btn btn-sm btn-primary common-btn-font"
                                            onClick={() => {
                                              setEnquiryFormData({
                                                ...enquiryFormData,
                                                enquiry_comments: "",
                                                property_id: property_id,
                                              });
                                              enquiryForm.current.reset();
                                            }}
                                          >
                                            Contact
                                          </button>
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <hr />
                                      </div>
                                      <div className="col-xl-6 col-lg-10">
                                        <small className="text-muted">
                                          Address
                                        </small>
                                        <div className="common-btn-font">
                                          {`${
                                            Flat_No
                                              ? `Flat No:  ${Flat_No}, `
                                              : ""
                                          } ${
                                            society_name
                                              ? `Society Name:  ${society_name}, `
                                              : ""
                                          } ${
                                            plot_no
                                              ? `Plot No:  ${plot_no}, `
                                              : ""
                                          }Locality: ${locality}, ${city_name} - ${zip}, ${state_name}`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* comment modal */}
      <div
        className="modal fade"
        id="commentModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ background: "rgba(135, 207, 235, 0.85)" }}
          >
            <div className="d-flex p-2 justify-content-end">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form
              ref={enquiryForm}
              className="modal-body pt-0"
              onSubmit={onEnquiryFormSubmit}
            >
              <textarea
                onChange={onEnquiryFieldsChange}
                placeholder="Enter your message here"
                name="enquiry-comment"
                id="enquiry-comment"
                rows="5"
                className="form-control"
                style={{ resize: "none" }}
                required
              ></textarea>
              <div className="mt-3">
                <button
                  disabled={enquiry_comments ? false : true}
                  type="submit"
                  className="btn btn-primary w-100 common-btn-font"
                >
                  <span>
                    <i className="bi bi-send-fill me-2"></i>Send
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListOfProperties;
