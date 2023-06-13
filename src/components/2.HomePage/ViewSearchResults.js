import React, { useState } from "react";
import Layout from "../1.CommonLayout/Layout";

const ViewSearchResults = () => {
  let propertyMinPrices = [
    10000000, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000,
    350000000, 400000000, 450000000, 500000000,
  ];

  let maxPricesOfProperty = [
    10000000, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000,
    350000000, 400000000, 450000000, 500000000, 550000000,
  ];

  let propertyMinArea = [
    100, 200, 300, 400, 500, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 25000,
  ];
  let maxAreaOfProperty = [
    100, 200, 300, 400, 500, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 25000,
    50000,
  ];

  const [formData, setFormData] = useState({
    minPriceValue: "",
    maxPriceValue: "",
    minAreaValue: "",
    maxAreaValue: "",
    propertyAge: "",
  });

  const {
    minPriceValue,
    maxPriceValue,
    minAreaValue,
    maxAreaValue,
    propertyAge,
  } = formData;

  const [filtersCount, setFiltersCount] = useState(2);

  const [propertyMaxPrices, setPropertyMaxPrices] =
    useState(maxPricesOfProperty);

  const [propertyMaxArea, setPropertyMaxArea] = useState(maxAreaOfProperty);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "minPrice") {
      if (value) {
        if (!minPriceValue && !maxPriceValue) {
          setFiltersCount(filtersCount + 1);
        }
        let intValue = parseInt(value);
        let indexOfValue = maxPricesOfProperty.indexOf(intValue);
        setPropertyMaxPrices(maxPricesOfProperty.slice(indexOfValue + 1));
        setFormData({ ...formData, minPriceValue: value });
      } else {
        setFormData({ ...formData, minPriceValue: "" });
        setPropertyMaxPrices(maxPricesOfProperty);
        if (!maxPriceValue) {
          setFiltersCount(filtersCount - 1);
        }
      }
    } else if (name === "maxPrice") {
      if (value) {
        if (!minPriceValue && !maxPriceValue) {
          setFiltersCount(filtersCount + 1);
        }
        setFormData({ ...formData, maxPriceValue: value });
      } else {
        setFormData({ ...formData, maxPriceValue: "" });
        if (!minPriceValue) {
          setFiltersCount(filtersCount - 1);
        }
      }
    } else if (name === "minArea") {
      if (value) {
        if (!minAreaValue && !maxAreaValue) {
          setFiltersCount(filtersCount + 1);
        }
        let intValue = parseInt(value);
        let indexOfValue = maxAreaOfProperty.indexOf(intValue);
        setPropertyMaxArea(maxAreaOfProperty.slice(indexOfValue + 1));
        setFormData({ ...formData, minAreaValue: value });
      } else {
        setFormData({ ...formData, minAreaValue: "" });
        setPropertyMaxArea(maxAreaOfProperty);
        if (!maxAreaValue) {
          setFiltersCount(filtersCount - 1);
        }
      }
    } else if (name === "maxArea") {
      if (value) {
        if (!minAreaValue && !maxAreaValue) {
          setFiltersCount(filtersCount + 1);
        }
        setFormData({ ...formData, maxAreaValue: value });
      } else {
        setFormData({ ...formData, maxAreaValue: "" });
        if (!minAreaValue) {
          setFiltersCount(filtersCount - 1);
        }
      }
    } else if (name === "propertyAge") {
      if (value) {
        setFormData({ ...formData, propertyAge: value });
        if (!propertyAge) {
          setFiltersCount(filtersCount + 1);
        }
      } else {
        setFormData({ ...formData, propertyAge: "" });
        if (propertyAge) {
          setFiltersCount(filtersCount - 1);
        }
      }
    }
  };

  return (
    <>
      <Layout>
        <section className="section-padding searched-results-wrapper">
          <div className="container-fluid min-200vh">
            <div
              className="row extra-filters-row justify-content-center align-items-center"
              style={{ height: "80px" }}
            >
              <div className="col-xl-1 col-md-2 col-12 mt-3 mt-md-0">
                <div className="inner-box">
                  {/* <label htmlFor="bank">Bank</label> */}
                  <div className="select-div">
                    <select
                      name="bank"
                      id="bank"
                      className="form-select"
                      aria-label=".form-select-sm example"
                      //   onChange={onFieldsChange}
                    >
                      <option value="">State</option>
                      {/* {banks
                        ? banks.map((bank, Index) => {
                            return (
                              <option key={Index} value={bank.bank_id}>
                                {bank.bank_name}
                              </option>
                            );
                          })
                        : ""} */}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-xl-1 col-md-2 col-12 mt-3 mt-md-0">
                <div className="inner-box">
                  {/* <label htmlFor="bank">Bank</label> */}
                  <div className="select-div">
                    <select
                      name="bank"
                      id="bank"
                      className="form-select"
                      aria-label=".form-select-sm example"
                      //   onChange={onFieldsChange}
                    >
                      <option value="">City</option>
                      {/* {banks
                        ? banks.map((bank, Index) => {
                            return (
                              <option key={Index} value={bank.bank_id}>
                                {bank.bank_name}
                              </option>
                            );
                          })
                        : ""} */}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-xl-1 col-md-2 col-12 mt-3 mt-md-0">
                <div className="inner-box">
                  {/* <label htmlFor="bank">Bank</label> */}
                  <div className="select-div">
                    <select
                      name="bank"
                      id="bank"
                      className="form-select"
                      aria-label=".form-select-sm example"
                      //   onChange={onFieldsChange}
                    >
                      <option value="">Category</option>
                      {/* {banks
                        ? banks.map((bank, Index) => {
                            return (
                              <option key={Index} value={bank.bank_id}>
                                {bank.bank_name}
                              </option>
                            );
                          })
                        : ""} */}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-xl-1 col-md-2 col-12 mt-3 mt-md-0">
                <div className="inner-box">
                  {/* <label htmlFor="bank">Bank</label> */}
                  <div className="select-div">
                    <select
                      name="bank"
                      id="bank"
                      className="form-select"
                      aria-label=".form-select-sm example"
                      //   onChange={onFieldsChange}
                    >
                      <option value="">Bank</option>
                      {/* {banks
                        ? banks.map((bank, Index) => {
                            return (
                              <option key={Index} value={bank.bank_id}>
                                {bank.bank_name}
                              </option>
                            );
                          })
                        : ""} */}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-12 mt-3 mt-md-0">
                <div className="inner-box">
                  <div className="dropdown">
                    <div
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="form-select"
                    >
                      <div
                        value=""
                        style={{
                          overflow: "hidden",
                          fontWeight: "normal",
                          display: "block",
                          whiteSpaceCollapse: "collapse",
                          textWrap: "nowrap",
                          minHeight: "1.2em",
                          padding: "0px 2px 1px",
                        }}
                      >
                        <span className="me-2 badge bg-dark">
                          {filtersCount}
                        </span>
                        More Filters
                      </div>
                    </div>
                    <ul
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="dropdown-menu more-filters-dropdown-menu shadow"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <div className="container-fluid p-3">
                        <form className="row">
                          <div className="col-12">
                            <label
                              htmlFor=""
                              className="form-label common-btn-font"
                            >
                              Price (<i className="bi bi-currency-rupee"></i>)
                            </label>
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="minPrice"
                                  name="minPrice"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Min</option>
                                  {propertyMinPrices.map((price, Index) => {
                                    return (
                                      <option value={price} key={Index}>
                                        {price}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 text-center mb-3 mb-md-0">
                            to
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="maxPrice"
                                  name="maxPrice"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Max</option>
                                  {propertyMaxPrices.map((price, Index) => {
                                    return (
                                      <option value={price} key={Index}>
                                        {price}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label
                                htmlFor="title_clear_property"
                                className="form-label common-btn-font"
                              >
                                Title clear property
                              </label>
                              <div className="select-div">
                                <select
                                  id="title_clear_property"
                                  name="title_clear_property"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label
                                htmlFor="territory"
                                className="form-label common-btn-font"
                              >
                                Territory
                              </label>
                              <div className="select-div">
                                <select
                                  id="territory"
                                  name="territory"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="Gram Panchayat Limit">
                                    Gram Panchayat Limit
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor=""
                              className="form-label common-btn-font"
                            >
                              Carpet Area ( sqft )
                            </label>
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="minArea"
                                  name="minArea"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Min</option>
                                  {propertyMinArea.map((area, Index) => {
                                    return (
                                      <option value={area} key={Index}>
                                        {area}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 text-center mb-3 mb-md-0">
                            to
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="maxArea"
                                  name="maxArea"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Max</option>
                                  {propertyMaxArea.map((area, Index) => {
                                    return (
                                      <option value={area} key={Index}>
                                        {area}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor=""
                              className="form-label common-btn-font"
                            >
                              Age of Property
                            </label>
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="propertyAge"
                                  name="propertyAge"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Select age</option>
                                  <option value="1">Less than 1 year</option>
                                  <option value="3">Less than 3 years</option>
                                  <option value="5">Less than 5 years</option>
                                  <option value="10">Less than 10 years</option>
                                  <option value="10">More than 10 years</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* <div className="col-12">
                            <label
                              htmlFor=""
                              className="form-label common-btn-font"
                            >
                              Price (<i className="bi bi-currency-rupee"></i>)
                            </label>
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="minPrice"
                                  name="minPrice"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Min</option>
                                  {propertyMinPrices.map((price, Index) => {
                                    return (
                                      <option value={price} key={Index}>
                                        {price}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 text-center mb-3 mb-md-0">
                            to
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="maxPrice"
                                  name="maxPrice"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Max</option>
                                  {propertyMaxPrices.map((price, Index) => {
                                    return (
                                      <option value={price} key={Index}>
                                        {price}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label
                                htmlFor="title_clear_property"
                                className="form-label common-btn-font"
                              >
                                Title clear property
                              </label>
                              <div className="select-div">
                                <select
                                  id="title_clear_property"
                                  name="title_clear_property"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label
                                htmlFor="territory"
                                className="form-label common-btn-font"
                              >
                                Territory
                              </label>
                              <div className="select-div">
                                <select
                                  id="territory"
                                  name="territory"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="Gram Panchayat Limit">
                                    Gram Panchayat Limit
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor=""
                              className="form-label common-btn-font"
                            >
                              Carpet Area ( sqft )
                            </label>
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="minArea"
                                  name="minArea"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Min</option>
                                  {propertyMinArea.map((area, Index) => {
                                    return (
                                      <option value={area} key={Index}>
                                        {area}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 text-center mb-3 mb-md-0">
                            to
                          </div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="maxArea"
                                  name="maxArea"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value="">Max</option>
                                  {propertyMaxArea.map((area, Index) => {
                                    return (
                                      <option value={area} key={Index}>
                                        {area}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div> */}
                        </form>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-1 col-md-2 col-12 my-3 my-md-0 p-lg-0">
                <button className="btn btn-primary w-100 text-center">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ViewSearchResults;
