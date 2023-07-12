import React, { useEffect, useRef, useState } from "react";
import Layout from "../1.CommonLayout/Layout";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonSpinner from "../../CommonSpinner";
import Pagination from "../../Pagination";

const ViewSearchResults = () => {
  const { data } = useParams();
  const dataFromParams = JSON.parse(decodeURIComponent(data));
  const goTo = useNavigate();
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
    // localities: "",
    assetCategory: "",
    banks: "",
  });
  const { states, assetCategory, cities, banks } = searchFields;
  const [sortText, setSortText] = useState("Relevance");

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
      let cityByState = {};
      if (dataFromParams.state_id) {
        cityByState = await axios.post(`/sam/v1/property/by-city`, {
          state_id: dataFromParams.state_id,
        });
      }

      // store states, banks and asset categories into searchFields useState.
      setSearchFields({
        ...searchFields,
        states: allStates.data,
        cities: cityByState.data,
        banks: allBanks.data,
        assetCategory: assetCategories.data,
      });
    } catch (error) {}
  };

  const getPropertyData = async () => {
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
      console.log(dataToPost);
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
      // toast.error("Internal server error");
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

  // This function will run on change of input fields.
  const onFieldsChange = async (e) => {
    let apis = {
      cityAPI: `/sam/v1/property/by-city`,
      addressAPI: `/sam/v1/property/by-address`,
    };
    const { name, value } = e.target;
    if (name === "states") {
      // Store state id ( if available ) into dataToPost useState (It is required for search functionality).
      if (value) {
        setDataToPost({ ...dataToPost, state_id: parseInt(value) });
      } else {
        delete dataToPost.state_id;
        delete dataToPost.city_id;
      }
      // If input is state then post selected state id to api for getting cities based on selected state.
      const cityByState = await axios.post(apis.cityAPI, {
        state_id: parseInt(value),
      });
      // Store cities data into searchField useState.
      setSearchFields({ ...searchFields, cities: cityByState.data });
    } else if (name === "cities") {
      // Store city id ( if available ) into dataToPost useState (It is required for search functionality).
      if (value) {
        setDataToPost({ ...dataToPost, city_id: parseInt(value) });
      } else {
        delete dataToPost.city_id;
      }
      // If input is cities then post selected city id to api for getting locality info. based on selected city.
      // const localityByCity = await axios.post(apis.addressAPI, {
      //   city_id: parseInt(value),
      // });
      // Store locality data into searchField useState.
      // setSearchFields({ ...searchFields, localities: localityByCity.data });
    }
    // else if (name === "localities") {
    //   // Store locality value ( if available ) into dataToPost useState (It is required for search functionality).
    //   if (value) {
    //     setDataToPost({ ...dataToPost, locality: value });
    //   } else {
    //     delete dataToPost.locality;
    //   }
    // }
    else if (name === "asset") {
      // Store asset type id ( if available ) into dataToPost useState (It is required for search functionality).
      if (value) {
        setDataToPost({ ...dataToPost, type_id: parseInt(value) });
      } else {
        delete dataToPost.type_id;
      }
    } else if (name === "bank") {
      // Store bank id ( if available ) into dataToPost useState (It is required for search functionality).
      if (value) {
        setDataToPost({ ...dataToPost, bank_id: parseInt(value) });
      } else {
        delete dataToPost.bank_id;
      }
    }
  };

  const propertyMinPrices = [
    10000000, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000,
    350000000, 400000000, 450000000, 500000000,
  ];

  const propertyMaxPrices = [
    10000000, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000,
    350000000, 400000000, 450000000, 500000000, 550000000,
  ];

  let propertyMinArea = [
    100, 200, 300, 400, 500, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 25000,
  ];
  let propertyMaxArea = [
    100, 200, 300, 400, 500, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 25000,
    50000,
  ];

  const maxPrice = "550000000";
  const minPrice = "10000000";
  const maxArea = "50000";
  const minArea = "100";

  const [filtersCount, setFiltersCount] = useState(0);
  const [priceFilterSelected, setPriceFilterSelected] = useState(false);
  const [areaFilterSelected, setAreaFilterSelected] = useState(false);

  useEffect(() => {
    if (priceFilterSelected) {
      setFiltersCount(filtersCount + 1);
    } else {
      setFiltersCount(filtersCount === 0 ? 0 : filtersCount - 1);
    }
  }, [priceFilterSelected]);

  useEffect(() => {
    if (areaFilterSelected) {
      setFiltersCount(filtersCount + 1);
    } else {
      setFiltersCount(filtersCount === 0 ? 0 : filtersCount - 1);
    }
  }, [areaFilterSelected]);

  const onMoreFiltersInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "min_price") {
      if (value) {
        setPriceFilterSelected(true);
        let allOptions = document.querySelectorAll(".max-price-options");
        allOptions.forEach((option) => {
          if (parseInt(value) >= parseInt(option.value)) {
            option.setAttribute("disabled", true);
            option.nextElementSibling.selected = true;
            setDataToPost({
              ...dataToPost,
              [name]: value,
              max_price: option.nextElementSibling.value,
            });
          } else {
            option.removeAttribute("disabled");
          }
        });
      } else {
        delete dataToPost.min_price;
        delete dataToPost.max_price;
        if (!dataToPost.max_price) {
          setPriceFilterSelected(false);
        } else {
          setPriceFilterSelected(true);
        }
        let allOptions = document.querySelectorAll(".max-price-options");
        allOptions.forEach((option) => {
          option.removeAttribute("disabled");
          if (!option.value) {
            option.selected = true;
          }
        });
      }
    } else if (name === "max_price") {
      if (value) {
        setPriceFilterSelected(true);
        if (dataToPost.min_price) {
          setDataToPost({ ...dataToPost, [name]: value });
        } else {
          setDataToPost({ ...dataToPost, [name]: value, min_price: minPrice });
        }
      } else {
        if (dataToPost.min_price) {
          setPriceFilterSelected(true);
          setDataToPost({
            ...dataToPost,
            [name]: maxPrice,
          });
        } else {
          setPriceFilterSelected(false);
        }
      }
    } else if (name === "min_area") {
      if (value) {
        setAreaFilterSelected(true);
        let allOptions = document.querySelectorAll(".max-carpet-area-options");
        allOptions.forEach((option) => {
          if (parseInt(value) >= parseInt(option.value)) {
            option.setAttribute("disabled", true);
            option.nextElementSibling.selected = true;
            setDataToPost({
              ...dataToPost,
              [name]: value,
              max_area: option.nextElementSibling.value,
            });
          } else {
            option.removeAttribute("disabled");
          }
        });
      } else {
        let allOptions = document.querySelectorAll(".max-carpet-area-options");
        allOptions.forEach((option) => {
          option.removeAttribute("disabled");
          if (!option.value) {
            option.selected = true;
          }
        });
        delete dataToPost.min_area;
        delete dataToPost.max_area;

        if (!dataToPost.max_area) {
          setAreaFilterSelected(false);
        } else {
          setAreaFilterSelected(true);
        }
      }
    } else if (name === "max_area") {
      if (value) {
        if (dataToPost.min_area) {
          setDataToPost({ ...dataToPost, [name]: value });
        } else {
          setDataToPost({ ...dataToPost, [name]: value, min_area: minArea });
        }
      } else {
        if (dataToPost.min_area) {
          setAreaFilterSelected(true);
          setDataToPost({
            ...dataToPost,
            [name]: maxArea,
          });
        } else {
          setAreaFilterSelected(false);
        }
      }
    } else if (name === "age") {
      if (value) {
        setDataToPost({ ...dataToPost, [name]: parseInt(value) });
      } else {
        delete dataToPost.age;
      }
    } else if (name === "title_clear_property") {
      if (value) {
        setDataToPost({ ...dataToPost, [name]: parseInt(value) });
      } else {
        delete dataToPost.title_clear_property;
      }
    } else if (name === "territory") {
      if (value) {
        setDataToPost({ ...dataToPost, [name]: value });
      } else {
        delete dataToPost.territory;
      }
    }
  };

  useEffect(() => {
    if (dataToPost) {
      getSearchDetails();
      getPropertyData();
    }
  }, []);

  return (
    <Layout>
      <section className="section-padding searched-results-wrapper">
        <div className="container-fluid min-200vh">
          <div
            className="row extra-filters-row justify-content-center align-items-center"
            style={{ height: "80px" }}
          >
            <div className="col-xl-1 col-md-2 col-12 mt-3 mt-md-0">
              <div className="inner-box">
                <div className="select-div">
                  <select
                    name="states"
                    id="states"
                    className="form-select"
                    aria-label=".form-select-sm example"
                    onChange={onFieldsChange}
                  >
                    <option value="">State</option>
                    {states ? (
                      states.map((state, Index) => {
                        let optionToSelectByDefault = document.getElementById(
                          `stateFilter-${state.state_id}`
                        );
                        if (dataToPost.state_id && optionToSelectByDefault) {
                          if (dataToPost.state_id === state.state_id) {
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
                <div className="select-div">
                  <select
                    name="cities"
                    id="cities"
                    className="form-select"
                    aria-label=".form-select-sm example"
                    onChange={onFieldsChange}
                  >
                    <option value="">City</option>
                    {cities
                      ? cities.map((city, Index) => {
                          let optionToSelectByDefault = document.getElementById(
                            `cityFilter-${city.city_id}`
                          );
                          if (dataToPost.city_id && optionToSelectByDefault) {
                            if (dataToPost.city_id === city.city_id) {
                              optionToSelectByDefault.selected = true;
                            }
                          }
                          return (
                            <option
                              id={`cityFilter-${city.city_id}`}
                              key={Index}
                              value={city.city_id}
                            >
                              {city.city_name}
                            </option>
                          );
                        })
                      : ""}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-xl-1 col-md-2 col-12 mt-3 mt-md-0">
              <div className="inner-box">
                <div className="select-div">
                  <select
                    name="asset"
                    id="asset"
                    className="form-select"
                    aria-label=".form-select-sm example"
                    onChange={onFieldsChange}
                  >
                    <option value="">Category</option>
                    {assetCategory
                      ? assetCategory.map((category, Index) => {
                          let optionToSelectByDefault = document.getElementById(
                            `categoryFilter-${category.type_id}`
                          );
                          if (dataToPost.type_id && optionToSelectByDefault) {
                            if (dataToPost.type_id === category.type_id) {
                              optionToSelectByDefault.selected = true;
                            }
                          }
                          return (
                            <option
                              id={`categoryFilter-${category.type_id}`}
                              key={Index}
                              value={category.type_id}
                            >
                              {category.type_name}
                            </option>
                          );
                        })
                      : ""}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-xl-1 col-md-2 col-12 mt-3 mt-md-0">
              <div className="inner-box">
                <div className="select-div">
                  <select
                    name="bank"
                    id="bank"
                    className="form-select"
                    aria-label=".form-select-sm example"
                    onChange={onFieldsChange}
                  >
                    <option value="">Bank</option>
                    {banks
                      ? banks.map((bank, Index) => {
                          return (
                            <option key={Index} value={bank.bank_id}>
                              {bank.bank_name}
                            </option>
                          );
                        })
                      : ""}
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
                      <span className="me-2 badge bg-dark">{filtersCount}</span>
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
                                id="min_price"
                                name="min_price"
                                className="form-select form-select-sm"
                                aria-label=".form-select-sm example"
                                onChange={onMoreFiltersInputChange}
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
                                id="max_price"
                                name="max_price"
                                className="form-select form-select-sm"
                                aria-label=".form-select-sm example"
                                onChange={onMoreFiltersInputChange}
                              >
                                <option className="max-price-options" value="">
                                  Max
                                </option>
                                {propertyMaxPrices.map((price, Index) => {
                                  return (
                                    <option
                                      className="max-price-options"
                                      value={price}
                                      key={Index}
                                    >
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
                                onChange={onMoreFiltersInputChange}
                              >
                                <option value=""></option>
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
                                onChange={onMoreFiltersInputChange}
                              >
                                <option value=""></option>
                                <option value="gram panchayat limit">
                                  Gram Panchayat Limit
                                </option>
                                <option value="corporate">
                                  Corporate limit
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
                                id="min_area"
                                name="min_area"
                                className="form-select form-select-sm"
                                aria-label=".form-select-sm example"
                                onChange={onMoreFiltersInputChange}
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
                                id="max_area"
                                name="max_area"
                                className="form-select form-select-sm"
                                aria-label=".form-select-sm example"
                                onChange={onMoreFiltersInputChange}
                              >
                                <option
                                  className="max-carpet-area-options"
                                  value=""
                                >
                                  Max
                                </option>
                                {propertyMaxArea.map((area, Index) => {
                                  return (
                                    <option
                                      className="max-carpet-area-options"
                                      value={area}
                                      key={Index}
                                    >
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
                                id="age"
                                name="age"
                                className="form-select form-select-sm"
                                aria-label=".form-select-sm example"
                                onChange={onMoreFiltersInputChange}
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
              <button
                onClick={() => {
                  getPropertyData();
                }}
                className="btn btn-primary w-100 text-center"
              >
                Search
              </button>
            </div>
          </div>
          <div className="property-wrapper">
            <div className="container-fluid display-on-search py-3">
              <div className="row">
                <div className="col-12 d-flex justify-content-md-end">
                  <div className="container-fluid p-0">
                    <div className="row justify-content-end">
                      <div className="" style={{ width: "fit-content" }}>
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
                                <span className="me-2">
                                  <i className="bi bi-filter-right"></i>
                                </span>
                                Sort by : {sortText}
                              </div>
                            </div>
                            <ul
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              // }}
                              className="dropdown-menu shadow w-100"
                            >
                              <li
                                onClick={(e) => {
                                  setSortText(e.target.textContent);
                                }}
                              >
                                <span className="dropdown-item">Relevance</span>
                              </li>
                              <li
                                onClick={(e) => {
                                  setSortText(e.target.textContent);
                                }}
                              >
                                <span className="dropdown-item">
                                  Price - Low to High
                                </span>
                              </li>
                              <li
                                onClick={(e) => {
                                  setSortText(e.target.textContent);
                                }}
                              >
                                <span className="dropdown-item">
                                  Price - High to Low
                                </span>
                              </li>
                              <li
                                onClick={(e) => {
                                  setSortText(e.target.textContent);
                                }}
                              >
                                <span className="dropdown-item">
                                  Most Recent
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <hr />
                </div>
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
                    const { count, category, city_name, market_value, range } =
                      property;
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
                                {localData ? (
                                  <NavLink
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    to={{
                                      pathname: `/list-of-properties/${encodeURIComponent(
                                        JSON.stringify({
                                          type: category,
                                          city: city_name,
                                          range: range,
                                          bank_id: dataToPost.bank_id
                                            ? dataToPost.bank_id
                                            : "",
                                        })
                                      )}`,
                                    }}
                                    className="btn btn-primary common-btn-font me-2"
                                    style={{ width: "30%" }}
                                  >
                                    View
                                  </NavLink>
                                ) : (
                                  <button
                                    className="btn btn-primary common-btn-font me-2"
                                    style={{ width: "30%" }}
                                    onClick={() => {
                                      toast.info(
                                        "Please login to view property details"
                                      );
                                      goTo("/login");
                                    }}
                                  >
                                    View
                                  </button>
                                )}

                                {/* {localData ? (
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
                                )} */}
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
      {/* <div
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
                placeholder="Enter your message here"
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
      </div> */}
    </Layout>
  );
};

export default ViewSearchResults;
