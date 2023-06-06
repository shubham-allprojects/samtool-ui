import React from "react";
import Layout from "../1.CommonLayout/Layout";

const ViewSearchResults = () => {
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
                        More Filters
                      </option>
                    </div>
                    <ul
                      class="dropdown-menu more-filters-dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <div className="container-fluid p-3">
                        <form className="row justify-content-center">
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label htmlFor="filter1">Filter 1</label>
                              <div className="select-div">
                                <select
                                  id="filter1"
                                  name="filter1"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                >
                                  <option value=""></option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label htmlFor="filter1">Filter 2</label>
                              <div className="select-div">
                                <select
                                  id="filter2"
                                  name="filter2"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                >
                                  <option value=""></option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label htmlFor="filter1">Filter 3</label>
                              <div className="select-div">
                                <select
                                  id="filter3"
                                  name="filter3"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                >
                                  <option value=""></option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <label htmlFor="filter1">Filter 4</label>
                              <div className="select-div">
                                <select
                                  id="filter4"
                                  name="filter4"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                >
                                  <option value=""></option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="inner-box">
                              <label htmlFor="filter1">Filter 5</label>
                              <div className="select-div">
                                <select
                                  id="filter5"
                                  name="filter5"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                >
                                  <option value=""></option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="inner-box">
                              <label htmlFor="filter1">Filter 6</label>
                              <div className="select-div">
                                <select
                                  id="filter6"
                                  name="filter6"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                >
                                  <option value=""></option>
                                </select>
                              </div>
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
