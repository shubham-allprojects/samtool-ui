import React from "react";
const ViewProperty = ({ selectedProperty }) => {
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
    status,
    society_name,
    plot_no,
    flat_no,
    locality,
    zip,
  } = selectedProperty;

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
                <div className="col-6">
                  <div className="card p-2 text-center border-primary border-2 border">
                    <small className="text-muted">Property Number</small>
                    <small className="common-btn-font">{property_number}</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card p-2 text-center border-primary border-2 border">
                    <small className="text-muted">Is stressed</small>
                    <small className="common-btn-font text-capitalize">
                      {is_stressed}
                    </small>
                  </div>
                </div>
                {/* <div className="col-4">
                  <div className="card p-2 text-center border-primary border-2 border">
                    <small className="text-muted">Status</small>
                    <small className="common-btn-font">{status}</small>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-xl-7 mt-xl-0 mt-4">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 mb-2">
                  <span className="text-muted">
                    <i className="bi bi-geo-alt pe-2"></i>
                    Address Details
                  </span>
                </div>

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

                <div className="col-md-4">
                  <small className="text-muted">Locality</small>
                  <h5 className="mt-1">{locality}</h5>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">City</small>
                  <h5 className="mt-1">{city_name}</h5>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">State</small>
                  <h5 className="mt-1">{state_name}</h5>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">Zip</small>
                  <h5 className="mt-1">{zip}</h5>
                </div>

                <div className="col-12">
                  <hr className="my-md-2 my-3" />
                </div>
                <div className="col-12 mb-2">
                  <span className="text-muted">
                    <i className="bi bi-pin-map pe-2"></i>
                    Area
                  </span>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Saleable Area</small>
                  <h5 className="mt-1">{saleable_area}</h5>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Carpet Area</small>
                  <h5 className="mt-1">{carpet_area}</h5>
                </div>
                <div className="col-12">
                  <hr className="my-md-2 my-3" />
                </div>
                <div className="col-12 mb-2">
                  <span className="text-muted">
                    <i className="bi bi-calendar-check pe-2"></i>
                    Dates
                  </span>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Completion Date</small>
                  <h5 className="mt-1">
                    {completion_date
                      ? completion_date
                          .split(" ")[0]
                          .split("-")
                          .reverse()
                          .join("-")
                      : "NA"}
                  </h5>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Purchase Date</small>
                  <h5 className="mt-1">
                    {purchase_date
                      ? purchase_date
                          .split(" ")[0]
                          .split("-")
                          .reverse()
                          .join("-")
                      : "NA"}
                  </h5>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Mortgage Date</small>
                  <h5 className="mt-1">
                    {mortgage_date
                      ? mortgage_date
                          .split(" ")[0]
                          .split("-")
                          .reverse()
                          .join("-")
                      : "NA"}
                  </h5>
                </div>
                <div className="col-12">
                  <hr className="my-md-2 my-3" />
                </div>
                <div className="col-12 mb-2">
                  <span className="text-muted">
                    <i className="bi bi-tag pe-2"></i>
                    Pricing
                  </span>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Market Price</small>
                  <h5 className="mt-1">
                    <i className="bi bi-currency-rupee"></i>
                    {(market_price / 10000000).toFixed(2)} Crore
                  </h5>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Ready Reckoner Price</small>
                  <h5 className="mt-1">
                    <i className="bi bi-currency-rupee"></i>
                    {(ready_reckoner_price / 10000000).toFixed(2)} Crore
                  </h5>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Expected Price</small>
                  <h5 className="mt-1">
                    <i className="bi bi-currency-rupee"></i>
                    {(expected_price / 10000000).toFixed(2)} Crore
                  </h5>
                </div>
                <div className="col-12">
                  <hr className="my-md-2 my-3" />
                </div>
                <div className="col-12 mb-2">
                  <span className="text-muted">
                    <i className="bi bi-info-square pe-2"></i>
                    Property Availability
                  </span>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Is Sold?</small>
                  <h5 className="mt-1 text-capitalize">{is_sold}</h5>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Is Available For Sale?</small>
                  <h5 className="mt-1 text-capitalize">
                    {is_available_for_sale}
                  </h5>
                </div>

                <div className="col-12">
                  <hr className="my-md-2 my-3" />
                </div>
                <div className="col-md-12">
                  <span className="text-muted">
                    <i className="bi bi-bank pe-2"></i>Bank Branch
                  </span>
                  <h5 className="mt-2">{branch_name}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewProperty;
