import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
let cnt = 0;
let authHeader = "";

const ViewProperty = ({
  selectedProperty,
  propertyDocumentsList,
  getListOfPropertyDocuments,
}) => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const {
    type_name,
    branch_name,
    carpet_area,
    saleable_area,
    city_name,
    state_name,
    completion_date,
    purchase_date,
    expected_price,
    market_price,
    ready_reckoner_price,
    is_available_for_sale,
    mortgage_date,
    is_sold,
    is_stressed,
    property_number,
    property_id,
    // status,
    society_name,
    plot_no,
    flat_no,
    locality,
    zip,
    territory,
    title_clear_property,
    possession_of_the_property,
    distress_value,
  } = selectedProperty;
  let s1 = "";
  let combinedBinaryFormatOfChunks = "";
  const [fileName, setFileName] = useState();
  const getChunksOfDocuments = async (documentId, propertyId) => {
    let dataToPost = {
      document_id: documentId,
      property_id: propertyId,
      chunk_number: cnt,
      chunk_size: 2000000,
    };
    console.log(dataToPost);
    await axios
      .post(`/sam/v1/property/auth/property-docs`, dataToPost, {
        headers: authHeader,
      })
      .then(async (res) => {
        if (s1 !== res.data.data) {
          s1 += res.data.data;
          // console.log(res.data.data);
          combinedBinaryFormatOfChunks += window.atob(res.data.data);
          if (res.data.last_chunk !== true) {
            cnt += 1;
            getChunksOfDocuments();
          } else {
            let dataString = "";
            setFileName(res.data.file_name);
            let fileExtension = res.data.file_name.split(".")[1];
            if (fileExtension === "pdf") {
              // setTypeOfFile("pdf");
              dataString = "data:application/pdf;base64,";
            } else if (
              fileExtension === "jpg" ||
              fileExtension === "jpeg" ||
              fileExtension === "png"
            ) {
              // setTypeOfFile("image");
              // document.getElementById("exampleModal").classList.add("show");
              dataString = `data:image/${fileExtension};base64,`;
            }
            let originalBase64 = window.btoa(combinedBinaryFormatOfChunks);
            const base64Data = originalBase64;
            const base64Response = await fetch(`${dataString}${base64Data}`);
            const blob = await base64Response.blob();
            window.open(URL.createObjectURL(blob));
          }
        }
      });
  };

  return (
    <section className="admin-edit-property mb-5">
      <h3 className="fw-bold text-primary pb-2">{type_name}</h3>
      <div className="container-fluid border p-3">
        <div className="row ">
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
                <div className="carousel-item active" data-bs-interval="2000">
                  <img src="/images2.jpg" className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src="/images2.jpg" className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="/images2.jpg" className="d-block w-100" alt="..." />
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
            <div className="container-fluid p-0">
              <div className="row mt-3">
                {property_number ? (
                  <div className="col-6">
                    <div className="card p-2 text-center border-primary border-2 border">
                      <small className="text-muted">Property Number</small>
                      <small className="common-btn-font">
                        {property_number}
                      </small>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {is_stressed ? (
                  <div className="col-6">
                    <div className="card p-2 text-center border-primary border-2 border">
                      <small className="text-muted">Is stressed</small>
                      <small className="common-btn-font text-capitalize">
                        {is_stressed === "1" ? "Yes" : "No"}
                      </small>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {propertyDocumentsList ? (
                  <>
                    <div className="col-12 mt-3">
                      <div className="card p-2 text-center border-primary border-2 border position-relative">
                        <div
                          className="container-fluid"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseExample"
                          onClick={() => {
                            const docsListCollapse = document.querySelector(
                              ".documents-list-collapse"
                            );
                            if (docsListCollapse.getAttribute("style") === "") {
                              document
                                .querySelector(".chevRonDown")
                                .classList.remove("rotate-180deg");
                            } else {
                              document
                                .querySelector(".chevRonDown")
                                .classList.add("rotate-180deg");
                            }
                          }}
                        >
                          <div className="row">
                            <div className="col-12 d-flex justify-content-between">
                              <span className="fw-bold">
                                <i className="bi bi-file-earmark pe-2"></i>
                                Documents
                              </span>

                              <div className="chevRonDown">
                                <i className="bi bi-chevron-down"></i>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="collapse mt-2 documents-list-collapse"
                          id="collapseExample"
                        >
                          <div className="docs-list-table-wrapper">
                            <table className="table">
                              {/* <thead>
                                <tr>
                                  <th scope="col"></th>
                                  <th scope="col"></th>
                                  <th
                                    scope="col"
                                    className="d-flex justify-content-center"
                                  >
                                    <div
                                      className="property-documents-list-refresh-icon-wrapper"
                                      onClick={() => {
                                        getListOfPropertyDocuments(property_id);
                                      }}
                                    >
                                      <i className="bi bi-arrow-clockwise text-white"></i>
                                    </div>
                                  </th>
                                </tr>
                              </thead> */}
                              <tbody>
                                {propertyDocumentsList.map(
                                  (document, Index) => {
                                    return (
                                      <tr key={Index}>
                                        <th scope="row">{Index + 1}</th>
                                        <td>{document.document_name}</td>
                                        <td>
                                          <button
                                            onClick={() => {
                                              getChunksOfDocuments(
                                                document.document_id,
                                                property_id
                                              );
                                            }}
                                            className="btn btn-sm btn-primary"
                                          >
                                            view
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-12 mt-3">
                      <div className="card p-2 text-center border-primary border-2 border position-relative">
                        <div className="text-muted">
                          No documents available.
                        </div>

                        <NavLink
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            localStorage.setItem(
                              "property_number",
                              property_number
                            );
                          }}
                          to={`/admin/property/single-property-documents-upload`}
                          className="text-decoration-none mt-1"
                        >
                          <i className="bi bi-upload me-2"></i>Upload documents
                        </NavLink>

                        <div
                          className="property-documents-list-refresh-icon-wrapper"
                          onClick={() => {
                            getListOfPropertyDocuments(property_id);
                          }}
                        >
                          <i className="bi bi-arrow-clockwise text-white"></i>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-7 mt-xl-0 mt-4">
            <div className="container-fluid">
              <div className="row">
                {flat_no ||
                plot_no ||
                society_name ||
                locality ||
                city_name ||
                state_name ||
                zip ? (
                  <div className="col-12 mb-2">
                    <span className="text-muted">
                      <i className="bi bi-geo-alt pe-2"></i>
                      Address Details
                    </span>
                  </div>
                ) : (
                  <></>
                )}

                {flat_no ? (
                  <div className="col-md-4">
                    <small className="text-muted">Flat Number</small>
                    <h5 className="mt-1">{flat_no}</h5>
                  </div>
                ) : (
                  <></>
                )}

                {plot_no ? (
                  <div className="col-md-4">
                    <small className="text-muted">Plot Number</small>
                    <h5 className="mt-1">{plot_no}</h5>
                  </div>
                ) : (
                  <></>
                )}

                {society_name ? (
                  <div className="col-md-4">
                    <small className="text-muted">Society Name</small>
                    <h5 className="mt-1">{society_name}</h5>
                  </div>
                ) : (
                  <></>
                )}

                {locality ? (
                  <div className="col-md-4">
                    <small className="text-muted">Locality</small>
                    <h5 className="mt-1">{locality}</h5>
                  </div>
                ) : (
                  <></>
                )}

                {city_name ? (
                  <div className="col-md-4">
                    <small className="text-muted">City</small>
                    <h5 className="mt-1">{city_name}</h5>
                  </div>
                ) : (
                  <></>
                )}

                {state_name ? (
                  <div className="col-md-4">
                    <small className="text-muted">State</small>
                    <h5 className="mt-1">{state_name}</h5>
                  </div>
                ) : (
                  <></>
                )}

                {zip ? (
                  <div className="col-md-4">
                    <small className="text-muted">Zip</small>
                    <h5 className="mt-1">{zip}</h5>
                  </div>
                ) : (
                  <></>
                )}
                {saleable_area || carpet_area ? (
                  <>
                    <div className="col-12">
                      <hr className="my-md-2 my-3" />
                    </div>
                    <div className="col-12 mb-2">
                      <span className="text-muted">
                        <i className="bi bi-pin-map pe-2"></i>
                        Area
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {saleable_area ? (
                  <div className="col-md-4">
                    <small className="text-muted">Saleable Area</small>
                    <h5 className="mt-1">{saleable_area}</h5>
                  </div>
                ) : (
                  <></>
                )}
                {carpet_area ? (
                  <div className="col-md-4">
                    <small className="text-muted">Carpet Area</small>
                    <h5 className="mt-1">{carpet_area}</h5>
                  </div>
                ) : (
                  <></>
                )}
                {completion_date || purchase_date || mortgage_date ? (
                  <>
                    <div className="col-12">
                      <hr className="my-md-2 my-3" />
                    </div>
                    <div className="col-12 mb-2">
                      <span className="text-muted">
                        <i className="bi bi-calendar-check pe-2"></i>
                        Dates
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {completion_date ? (
                  <div className="col-md-4">
                    <small className="text-muted">Completion Date</small>
                    <h5 className="mt-1">
                      {completion_date
                        .split(" ")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {purchase_date ? (
                  <div className="col-md-4">
                    <small className="text-muted">Purchase Date</small>
                    <h5 className="mt-1">
                      {purchase_date
                        .split(" ")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {mortgage_date ? (
                  <div className="col-md-4">
                    <small className="text-muted">Mortgage Date</small>
                    <h5 className="mt-1">
                      {mortgage_date
                        .split(" ")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {market_price ||
                ready_reckoner_price ||
                expected_price ||
                distress_value ? (
                  <>
                    <div className="col-12">
                      <hr className="my-md-2 my-3" />
                    </div>
                    <div className="col-12 mb-2">
                      <span className="text-muted">
                        <i className="bi bi-tag pe-2"></i>
                        Pricing
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {market_price ? (
                  <div className="col-md-4">
                    <small className="text-muted">Market Price</small>
                    <h5 className="mt-1">
                      <i className="bi bi-currency-rupee"></i>
                      {(market_price / 10000000).toFixed(2)} Cr.
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {ready_reckoner_price ? (
                  <div className="col-md-4">
                    <small className="text-muted">Ready Reckoner Price</small>
                    <h5 className="mt-1">
                      <i className="bi bi-currency-rupee"></i>
                      {(ready_reckoner_price / 10000000).toFixed(2)} Cr.
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {expected_price ? (
                  <div className="col-md-4">
                    <small className="text-muted">Expected Price</small>
                    <h5 className="mt-1">
                      <i className="bi bi-currency-rupee"></i>
                      {(expected_price / 10000000).toFixed(2)} Cr.
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {distress_value ? (
                  <div className="col-md-4 mt-2">
                    <small className="text-muted">Distress Value</small>
                    <h5 className="mt-1">
                      <i className="bi bi-currency-rupee"></i>
                      {(distress_value / 10000000).toFixed(2)} Cr.
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {is_sold || is_available_for_sale ? (
                  <>
                    <div className="col-12">
                      <hr className="my-md-2 my-3" />
                    </div>
                    <div className="col-12 mb-2">
                      <span className="text-muted">
                        <i className="bi bi-building-check pe-2"></i>
                        Property Availability
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {is_sold ? (
                  <div className="col-md-4">
                    <small className="text-muted">Is Sold?</small>
                    <h5 className="mt-1 text-capitalize">
                      {is_sold === "1" ? "Yes" : "No"}
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {is_available_for_sale ? (
                  <div className="col-md-4">
                    <small className="text-muted">Is Available For Sale?</small>
                    <h5 className="mt-1 text-capitalize">
                      {is_available_for_sale === "1" ? "Yes" : "No"}
                    </h5>
                  </div>
                ) : (
                  <></>
                )}

                {branch_name ||
                territory ||
                title_clear_property ||
                possession_of_the_property ? (
                  <>
                    <div className="col-12">
                      <hr className="my-md-2 my-3" />
                    </div>
                    <div className="col-12">
                      <span className="text-muted">
                        <i className="bi bi-info-square pe-2"></i>Other details
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {branch_name ? (
                  <div className="col-md-6">
                    <small className="text-muted">Branch</small>
                    <h5 className="mt-1 text-capitalize">{branch_name}</h5>
                  </div>
                ) : (
                  <></>
                )}
                {territory ? (
                  <div className="col-md-6">
                    <small className="text-muted">Territory</small>
                    <h5 className="mt-1 text-capitalize">{territory}</h5>
                  </div>
                ) : (
                  <></>
                )}
                {title_clear_property ? (
                  <div className="col-md-6 mt-2">
                    <small className="text-muted">Title clear property</small>
                    <h5 className="mt-1 text-capitalize">
                      {title_clear_property === "1" ? "Yes" : "No"}
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
                {possession_of_the_property ? (
                  <div className="col-md-6 mt-2">
                    <small className="text-muted">
                      Possession of the property
                    </small>
                    <h5 className="mt-1 text-capitalize">
                      {possession_of_the_property}
                    </h5>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewProperty;
