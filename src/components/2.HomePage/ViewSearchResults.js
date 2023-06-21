import React, { useEffect, useRef, useState } from "react";
import Layout from "../1.CommonLayout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonSpinner from "../../CommonSpinner";
import Pagination from "../../Pagination";

const ViewSearchResults = () => {
  const { data } = useParams();
  const dataFromParams = JSON.parse(decodeURIComponent(data));
  const [dataToPost, setDataToPost] = useState(dataFromParams);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const paginationRef = useRef();
  const { batch_size } = dataFromParams;
  const [propertyData, setPropertyData] = useState([]);
  const localData = JSON.parse(localStorage.getItem("data"));
  const [searchFields, setSearchFields] = useState({
    states: "",
    cities: "",
    localities: "",
    assetCategory: "",
    banks: "",
  });

  const { states, assetCategory, cities, localities, banks } = searchFields;

  // It will fetch all states, banks, assets from api and will map those values to respective select fields.
  const getSearchDetails = async () => {
    let apis = {
      stateAPI: `/sam/v1/property/by-state`,
      bankAPI: `/sam/v1/property/by-bank`,
      categoryAPI: `/sam/v1/property/by-category`,
    };
    try {
      // Get all states from api.
      const allStates = await axios.get(apis.stateAPI);
      // Get all banks from api.
      const allBanks = await axios.get(apis.bankAPI);
      // Get all asset Categories from api.
      const assetCategories = await axios.get(apis.categoryAPI);

      // store states, banks and asset categories into searchFields useState.
      setSearchFields({
        ...searchFields,
        states: allStates.data,
        banks: allBanks.data,
        assetCategory: assetCategories.data,
      });
    } catch (error) {}
  };

  const getPropertyData = async () => {
    console.log(dataToPost);
    setLoading(true);
    paginationRef.current.classList.add("d-none");
    window.scrollTo(0, 0);
    let apis = {
      searchAPI: `/sam/v1/property/count-category`,
    };
    let dataForTotalCount = {
      ...dataToPost,
      batch_size: 1000,
      batch_number: 1,
    };
    try {
      // This api is only for getting all the records and count length of array of properties so that we can decide page numbers for pagination.
      await axios.post(apis.searchAPI, dataForTotalCount).then((res) => {
        if (res.data) {
          setPageCount(Math.ceil(res.data.length / batch_size));
        }
      });
      // Post data and get Searched result from response.
      await axios.post(apis.searchAPI, dataToPost).then((res) => {
        // Store Searched results into propertyData useState.
        setPropertyData(res.data);
        setLoading(false);
        if (res.data) {
          paginationRef.current.classList.remove("d-none");
        } else {
          paginationRef.current.classList.add("d-none");
        }
      });
    } catch (error) {
      toast.error("Internal server error");
      setLoading(false);
    }
  };

  // This will run when we click any page link in pagination. e.g. prev, 1, 2, 3, 4, next.
  const handlePageClick = async (pageNumber) => {
    window.scrollTo(0, 0);
    let currentPage = pageNumber.selected + 1;
    const nextOrPrevPagePropertyData = await fetchMoreProperties(currentPage);
    setPropertyData(nextOrPrevPagePropertyData);
  };

  // Fetch more jobs on page click.
  const fetchMoreProperties = async (currentPage) => {
    let dataOfNextOrPrevPage = {
      ...dataToPost,
      batch_size: batch_size,
      batch_number: currentPage,
    };
    let apis = {
      searchAPI: `/sam/v1/property/count-category`,
    };
    const res = await axios.post(apis.searchAPI, dataOfNextOrPrevPage);
    return res.data;
  };

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

  useEffect(() => {
    if (dataToPost) {
      getPropertyData();
      getSearchDetails();
    }
  }, []);

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
                      {states ? (
                        states.map((state, Index) => {
                          let optionToSelectByDefault = document.getElementById(
                            `stateFilter-${state.state_id}`
                          );
                          if (
                            dataFromParams.state_id &&
                            optionToSelectByDefault
                          ) {
                            if (
                              String(dataFromParams.state_id) ===
                              String(state.state_id)
                            ) {
                              optionToSelectByDefault.selected = true;
                            }
                          }
                          return (
                            <option
                              id={`stateFilter-${state.state_id}`}
                              key={Index}
                              value={state.state_id}
                            >
                              {state.state_name}
                            </option>
                          );
                        })
                      ) : (
                        <></>
                      )}
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
                          <div className="col-md-6 mb-3">
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
                          <div className="col-md-6 mb-3">
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
                          <div className="col-12">
                            <hr />
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
                            <hr />
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor=""
                              className="form-label common-btn-font"
                            >
                              Carpet Area ( sqft )
                            </label>
                          </div>
                          <div className="col-md-6 mb-3">
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
                          <div className="col-md-6 mb-3">
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
                            <hr />
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor=""
                              className="form-label common-btn-font"
                            >
                              Age of Property
                            </label>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="inner-box">
                              <div className="select-div">
                                <select
                                  id="propertyAge"
                                  name="propertyAge"
                                  className="form-select form-select-sm"
                                  aria-label=".form-select-sm example"
                                  onChange={onInputChange}
                                >
                                  <option value=""></option>
                                  <option value="1">Less than 1 year</option>
                                  <option value="3">Less than 3 years</option>
                                  <option value="5">Less than 5 years</option>
                                  <option value="10">Less than 10 years</option>
                                  <option value="10">More than 10 years</option>
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
            <div className="property-wrapper">
              <div className="container-fluid display-on-search py-3">
                <div className="row">
                  {loading ? (
                    <CommonSpinner
                      spinnerColor="primary"
                      spinnerText="Please wait...."
                    />
                  ) : !propertyData ? (
                    <div className="py-5 text-center">
                      <h2 className="text-capitalize">
                        Sorry! No result found :(
                      </h2>
                      <span className="text-muted">
                        Please try with other options
                      </span>
                    </div>
                  ) : (
                    propertyData.map((property, Index) => {
                      const {
                        count,
                        category,
                        city_name,
                        market_value,
                        range,
                      } = property;
                      return (
                        <div className="col-xl-3 col-lg-4 col-md-6" key={Index}>
                          <div className="property-card-wrapper">
                            <div className="card mb-2">
                              <div className="top-line"></div>
                              <img
                                className="card-img-top"
                                src="/images2.jpg"
                                alt=""
                              />
                              <div className="card-body">
                                {count ? (
                                  <div className="text-capitalize text-primary fw-bold">
                                    {`${
                                      count > 1
                                        ? count + " Properties"
                                        : count + " Property"
                                    }`}
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {category ? (
                                  <div className="text-capitalize">
                                    <span>Type: </span>
                                    <span className="common-btn-font">
                                      {category}
                                    </span>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {city_name ? (
                                  <div className="text-capitalize">
                                    <span>Location: </span>
                                    <span className="common-btn-font">
                                      {city_name}
                                    </span>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {market_value ? (
                                  <div className="text-capitalize">
                                    <span>Market Price: </span>
                                    <span className="common-btn-font">
                                      <i className="bi bi-currency-rupee"></i>
                                      {`${(
                                        parseInt(market_value) / 10000000
                                      ).toFixed(2)} Cr.`}
                                    </span>
                                  </div>
                                ) : (
                                  <></>
                                )}

                                {range ? (
                                  <div className="text-capitalize">
                                    <span>Range: </span>
                                    <span className="common-btn-font">
                                      <i className="bi bi-currency-rupee"></i>
                                      {`${(
                                        parseInt(range.split("-")[0]) / 10000000
                                      ).toFixed(2)} Cr.`}
                                    </span>
                                    <span className="mx-2 common-btn-font">
                                      -
                                    </span>
                                    <span className="common-btn-font">
                                      <i className="bi bi-currency-rupee"></i>
                                      {`${(
                                        parseInt(range.split("-")[1]) / 10000000
                                      ).toFixed(2)} Cr.`}
                                    </span>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                <div className="mt-2">
                                  <button
                                    // onClick={() => {
                                    //   viewCurrentProperty(
                                    //     category,
                                    //     city_name,
                                    //     range
                                    //   );
                                    // }}
                                    className="btn btn-primary common-btn-font me-2"
                                    style={{ width: "30%" }}
                                  >
                                    View
                                  </button>
                                  {localData ? (
                                    <>
                                      <button
                                        data-bs-toggle="modal"
                                        data-bs-target="#commentModal"
                                        className="btn btn-primary common-btn-font"
                                        style={{ width: "30%" }}
                                      >
                                        Contact
                                      </button>
                                    </>
                                  ) : (
                                    <></>
                                  )}
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
              <div className="container d-none" ref={paginationRef}>
                <div className="row">
                  <div className="col-12 mb-3">
                    <Pagination
                      handlePageClick={handlePageClick}
                      pageCount={pageCount}
                    />
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
              <div className="modal-body pt-0">
                <textarea
                  placeholder="Enter your comments"
                  name=""
                  id=""
                  rows="5"
                  className="form-control"
                  style={{ resize: "none" }}
                ></textarea>
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-primary w-100 common-btn-font"
                  >
                    <span>
                      <i className="bi bi-send-fill me-2"></i>Send
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ViewSearchResults;
