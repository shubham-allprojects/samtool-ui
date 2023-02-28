import React from "react";
import { useNavigate } from "react-router-dom";
import CommonSpinner from "../../CommonSpinner";

const Properties = ({ propertyData, loading }) => {
  // To navigate to particular route.
  const goTo = useNavigate();
  const viewProperty = () => {
    goTo("/property");
  };

  return (
    <div className="container-fluid d-none display-on-search py-3">
      <div className="row">
        {loading ? (
          <CommonSpinner spinnerColor="primary" spinnerText="Please wait...." />
        ) : !propertyData ? (
          <div className="py-5 text-center">
            <h2 className="text-capitalize">Sorry! No result found :(</h2>
            <span className="text-muted">Please try with other options</span>
          </div>
        ) : (
          propertyData.map((property, Index) => {
            return (
              <div className="col-lg-3 col-md-4" key={Index}>
                <div className="property-card-wrapper">
                  <div className="card mb-4">
                    <div className="top-line"></div>
                    <img className="card-img-top" src="images1.jpg" alt="" />
                    <div className="card-body">
                      <h3 className="card-title text-uppercase">
                        {property.title}
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
                        {parseInt(property.market_value) / 10000000 + " Cr."}
                      </span>
                      <br />
                      <span className="text-capitalize">
                        Range:{" "}
                        {parseInt(property.range.split("-")[0]) / 10000000 +
                          " Cr." +
                          " - " +
                          parseInt(property.range.split("-")[1]) / 10000000 +
                          " Cr."}
                      </span>
                      <br />
                      <div className="mt-3">
                        <button
                          onClick={viewProperty}
                          className="btn btn-primary common-btn-font"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Properties;
