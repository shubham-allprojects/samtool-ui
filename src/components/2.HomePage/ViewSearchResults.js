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

  const [filtersCount, setFiltersCount] = useState(2);

  const [propertyMaxPrices, setPropertyMaxPrices] =
    useState(maxPricesOfProperty);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "minPrice") {
      if (value) {
        let intValue = parseInt(value);
        let indexOfValue = maxPricesOfProperty.indexOf(intValue);
        setPropertyMaxPrices(maxPricesOfProperty.slice(indexOfValue + 1));
      } else {
        setPropertyMaxPrices(maxPricesOfProperty);
      }
    } else if (name === "maxPrice") {
    } else if (name === "territory") {
    } else if (name === "title_clear_property") {
    } else if (name === "carpet_area") {
    }
  };

  const onInputBlur = (e) => {
    const { name, value } = e.target;
    if (name === "carpet_area") {
      if (value) {
        setFiltersCount(filtersCount + 1);
      } else {
        setFiltersCount(filtersCount - 1);
      }
    }
  };

  // {"batch_number": 1,"batch_size": 3,"city_id": 1,"state_id": 1,"type_id": 2,"territory":"gram panchayat limit","title_clear_property":1,"market_price":110000000.00,"expected_price":400000.00,"carpet_area":"500 sq.ft."}
  return (
    <>
      <Layout>
        <section className="section-padding">
          <div className="container-fluid min-100vh">
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
                  {/* <label htmlFor="more-filters">More Filters</label> */}
                  <div class="dropdown">
                    <div
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="form-select"
                    >
                      <option value="" style={{ overflow: "hidden" }}>
                        More Filters {filtersCount}
                      </option>
                    </div>
                    <ul
                      class="dropdown-menu more-filters-dropdown-menu"
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
                              {/* <label htmlFor="filter1">Filter 1</label> */}
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
                          <div className="col-md-1">to</div>
                          <div className="col-md-5 mb-3">
                            <div className="inner-box">
                              {/* <label htmlFor="filter1">Filter 2</label> */}
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
                          <div className="col-md-6">
                            <div className="inner-box">
                              <label
                                htmlFor="carpet_area"
                                className="form-label common-btn-font"
                              >
                                Carpet Area (sqft)
                              </label>
                              <input
                                id="carpet_area"
                                name="carpet_area"
                                className="form-control form-control-sm"
                                type="number"
                                onChange={onInputChange}
                                onBlur={onInputBlur}
                              />
                            </div>
                          </div>
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
