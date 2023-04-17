import React, { useEffect, useRef, useState } from "react";
import HomeAboutUs from "./HomeAboutUs";
import Layout from "../1.CommonLayout/Layout";
import axios from "axios";
import { rootTitle } from "../../CommonFunctions";
import Pagination from "../../Pagination";
import CommonSpinner from "../../CommonSpinner";
import { useNavigate } from "react-router-dom";
import ViewPropertyResults from "../ViewPropertyResults";
import { toast } from "react-toastify";

function Home() {
  // useState to store data of each field e.g all states, all banks etc.
  const [searchFields, setSearchFields] = useState({
    states: "",
    cities: "",
    localities: "",
    assetCategory: "",
    banks: "",
  });
  const data = JSON.parse(localStorage.getItem("data"));
  const goTo = useNavigate();
  const [selectedPropertyResults, setSelectedPropertyResults] = useState([]);
  const homePageRef = useRef();
  const viewCurrentPropertyResultsRef = useRef();

  // useState to store values of each select box for search functionality.
  const [dataToPost, setDataToPost] = useState({
    batch_size: 4,
    batch_number: 1,
  });

  const { batch_size } = dataToPost;
  const [loading, setLoading] = useState(false);

  // After we click on search button It will store data/response from api into this useState.
  const [propertyData, setPropertyData] = useState([]);

  // Object destructuring.
  const { states, assetCategory, cities, localities, banks } = searchFields;

  const url = `/sam/v1/property`;

  // It will fetch all states, banks, assets from api and will map those values to respective select fields.
  const getSearchDetails = async () => {
    let apis = {
      stateAPI: `${url}/by-state`,
      bankAPI: `${url}/by-bank`,
      categoryAPI: `${url}/by-category`,
    };
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
  };

  // This function will run on change of input fields.
  const onFieldsChange = async (e) => {
    let apis = {
      cityAPI: `${url}/by-city`,
      addressAPI: `${url}/by-address`,
    };
    const { name, value } = e.target;
    const fiveSectionCol = document.querySelectorAll(".five-section-col");

    if (name === "states") {
      // Store state id ( if available ) into dataToPost useState (It is required for search functionality).
      if (value) {
        setDataToPost({ ...dataToPost, state_id: parseInt(value) });
      } else {
        delete dataToPost.state_id;
      }
      // If input is state then post selected state id to api for getting cities based on selected state.
      const cityByState = await axios.post(apis.cityAPI, {
        state_id: parseInt(value),
      });
      // Store cities data into searchField useState.
      setSearchFields({ ...searchFields, cities: cityByState.data });
      // Unhide city select box when we select state.
      document.getElementById("city-col").classList.remove("d-none");
      // This is to set width of background white box based on number of select input boxes.
      fiveSectionCol.forEach((col) => {
        col.classList.remove("w-30");
        col.classList.add("w-22");
      });
    } else if (name === "cities") {
      // Store city id ( if available ) into dataToPost useState (It is required for search functionality).
      if (value) {
        setDataToPost({ ...dataToPost, city_id: parseInt(value) });
      } else {
        delete dataToPost.city_id;
      }
      // If input is cities then post selected city id to api for getting locality info. based on selected city.
      const localityByCity = await axios.post(apis.addressAPI, {
        city_id: parseInt(value),
      });
      // Store locality data into searchField useState.
      setSearchFields({ ...searchFields, localities: localityByCity.data });
      // Unhide select box when we select city.
      document.getElementById("locality-col").classList.remove("d-none");
      // This is to set width of background white box based on number of select input boxes.
      fiveSectionCol.forEach((col) => {
        col.classList.remove("w-22");
        col.classList.add("w-18");
      });
    } else if (name === "localities") {
      // Store locality value ( if available ) into dataToPost useState (It is required for search functionality).
      if (value) {
        setDataToPost({ ...dataToPost, locality: value });
      } else {
        delete dataToPost.locality;
      }
    } else if (name === "asset") {
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

  const [pageCount, setPageCount] = useState(0);
  const paginationRef = useRef();
  // This will run after Search button click.
  const getPropertyData = async (e) => {
    e.preventDefault();
    setLoading(true);
    paginationRef.current.classList.add("d-none");
    document.getElementById("properties").scrollIntoView(true);
    // Unhide div and display search results in card format.
    document.querySelectorAll(".display-on-search").forEach((item) => {
      item.classList.remove("d-none");
    });
    let apis = {
      searchAPI: `${url}/count-category`,
    };
    let dataForTotalCount = {
      ...dataToPost,
      batch_size: 1000,
      batch_number: 1,
    };

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
  };

  // This will run when we click any page link in pagination. e.g. prev, 1, 2, 3, 4, next.
  const handlePageClick = async (pageNumber) => {
    document.getElementById("properties").scrollIntoView(true);
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
      searchAPI: `${url}/count-category`,
    };
    const res = await axios.post(apis.searchAPI, dataOfNextOrPrevPage);
    return res.data;
  };

  // Change navbar color on scroll on HomePage only.
  const changeNavBarColor = () => {
    let nav = document.querySelector(".navbar");
    nav.classList.add("navbar-lightBg");
    window.onscroll = function () {
      if (document.documentElement.scrollTop > 150) {
        nav.classList.add("header-scrolled");
        nav.classList.remove("navbar-lightBg");
      } else {
        nav.classList.remove("header-scrolled");
        nav.classList.add("navbar-lightBg");
      }
    };
  };

  let nav = document.querySelector(".navbar");
  const viewCurrentProperty = async (type, city, range) => {
    if (data) {
      viewCurrentPropertyResultsRef.current.classList.remove("d-none");
      setDisableHomeLink(true);
      window.scrollTo(0, 0);
      nav.style.background =
        "linear-gradient(0deg, rgb(2, 77, 251) 0%, rgb(0, 157, 255) 100%)";
      homePageRef.current.classList.add("d-none");
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
            nav.classList.remove("navbar-lightBg");
          });
      } catch (error) {}
    } else {
      toast.info("Please login to view property details");
      goTo("/login");
    }
  };

  const backToSearchResults = () => {
    setDisableHomeLink(false);
    viewCurrentPropertyResultsRef.current.classList.add("d-none");
    homePageRef.current.classList.remove("d-none");
    document.getElementById("properties").scrollIntoView(true);
    nav.style.removeProperty("background");
  };

  const [disableHomeLink, setDisableHomeLink] = useState(false);

  // This will run every time we refresh page or if some state change occurs.
  useEffect(() => {
    rootTitle.textContent = "SAM TOOL - HOME";
    getSearchDetails();
    changeNavBarColor();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout
      backToSearchResults={backToSearchResults}
      disableHomeLink={disableHomeLink}
    >
      <section className="full-home-page-section skyblue-bg" ref={homePageRef}>
        <section className="home-wrapper">
          <div className="container-fluid">
            {/* 5 select boxes */}
            <div className="home-top-row">
              <div className="row five-box-row">
                <div className="five-section-col w-30 col-12">
                  <div className="inner-box">
                    <label htmlFor="state">State</label>
                    <div className="select-div">
                      <select
                        id="state"
                        name="states"
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={onFieldsChange}
                      >
                        <option value=""></option>
                        {states
                          ? states.map((state, Index) => {
                              return (
                                <option key={Index} value={state.state_id}>
                                  {state.state_name}
                                </option>
                              );
                            })
                          : ""}
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="five-section-col w-30 col-12 d-none mt-3 mt-md-0"
                  id="city-col"
                >
                  <div className="inner-box">
                    <label htmlFor="city">City</label>
                    <div className="select-div">
                      <select
                        id="city"
                        name="cities"
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={onFieldsChange}
                      >
                        <option value=""></option>
                        {cities
                          ? cities.map((city, Index) => {
                              return (
                                <option key={Index} value={city.city_id}>
                                  {city.city_name}
                                </option>
                              );
                            })
                          : ""}
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="five-section-col w-30 col-12 d-none mt-3 mt-md-0"
                  id="locality-col"
                >
                  <div className="inner-box">
                    <label htmlFor="locality">Locality</label>
                    <div className="select-div">
                      <select
                        id="locality"
                        name="localities"
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={onFieldsChange}
                      >
                        <option value=""></option>
                        {localities
                          ? localities.map((data, Index) => {
                              return (
                                <option key={Index} value={data.locality}>
                                  {data.locality +
                                    " " +
                                    data.village +
                                    " " +
                                    data.pincode}
                                </option>
                              );
                            })
                          : ""}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="five-section-col w-30 col-12 mt-3 mt-md-0">
                  <div className="inner-box">
                    <label htmlFor="asset">Asset Category</label>
                    <div className="select-div">
                      <select
                        name="asset"
                        id="asset"
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={onFieldsChange}
                      >
                        <option value=""></option>
                        {assetCategory
                          ? assetCategory.map((category, Index) => {
                              return (
                                <option key={Index} value={category.type_id}>
                                  {category.type_name}
                                </option>
                              );
                            })
                          : ""}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="five-section-col w-30 col-12 mt-3 mt-md-0">
                  <div className="inner-box">
                    <label htmlFor="bank">Bank</label>
                    <div className="select-div">
                      <select
                        name="bank"
                        id="bank"
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={onFieldsChange}
                      >
                        <option value=""></option>
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
              </div>
            </div>
            {/* Search button*/}
            <div className="row justify-content-center py-4">
              <div className="text-center">
                <button
                  className={`btn btn-lg btn-primary common-btn-font ${
                    Object.keys(dataToPost).length > 2 ? "" : "disabled"
                  }`}
                  onClick={getPropertyData}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {/* After clicking on search button using this div id the ui will scroll to property results div */}
          <div id="properties"></div>
          <div className="home-bottom-heading display-on-search d-none">
            <h1 className="text-center text-white">RECENT LISTINGS</h1>
          </div>
        </section>
        {/* Properties component to show property details (In card format) on click of search button */}
        {/* We are sending propertyData array (which contains our search results) as a prop */}
        <section className="property-wrapper">
          <div className="container-fluid d-none display-on-search py-3">
            <div className="row">
              {loading ? (
                <CommonSpinner
                  spinnerColor="primary"
                  spinnerText="Please wait...."
                />
              ) : !propertyData ? (
                <div className="py-5 text-center">
                  <h2 className="text-capitalize">Sorry! No result found :(</h2>
                  <span className="text-muted">
                    Please try with other options
                  </span>
                </div>
              ) : (
                propertyData.map((property, Index) => {
                  const {
                    title,
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
                            src="images2.jpg"
                            alt=""
                          />
                          <div className="card-body">
                            <h3 className="card-title text-uppercase">
                              {title}
                            </h3>
                            <div className="text-capitalize text-primary fw-bold">
                              {`${
                                count > 1
                                  ? count + " Properties"
                                  : count + " Property"
                              }`}
                            </div>
                            <div className="text-capitalize">
                              <span>Type: </span>
                              <span className="common-btn-font">
                                {category}
                              </span>
                            </div>
                            <div className="text-capitalize">
                              <span>Location: </span>
                              <span className="common-btn-font">
                                {city_name}
                              </span>
                            </div>
                            <div className="text-capitalize">
                              <span>Market Price: </span>
                              <span className="common-btn-font">
                                <i className="bi bi-currency-rupee"></i>
                                {`${Math.round(
                                  parseInt(market_value) / 10000000
                                )} Crores`}
                              </span>
                            </div>

                            <div className="text-capitalize">
                              <span>Range: </span>
                              <span className="common-btn-font">
                                <i className="bi bi-currency-rupee"></i>
                                {`${Math.round(
                                  parseInt(range.split("-")[0]) / 10000000
                                )} Crores`}
                              </span>
                              <span className="mx-2 common-btn-font">-</span>
                              <span className="common-btn-font">
                                <i className="bi bi-currency-rupee"></i>
                                {`${Math.round(
                                  parseInt(range.split("-")[1]) / 10000000
                                )} Crores`}
                              </span>
                            </div>
                            <div className="mt-2">
                              <button
                                onClick={() => {
                                  viewCurrentProperty(
                                    category,
                                    city_name,
                                    range
                                  );
                                }}
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
        </section>
        {/* About us section component */}
        <HomeAboutUs />
      </section>
      <section
        ref={viewCurrentPropertyResultsRef}
        className="section-padding d-none min-100vh"
      >
        <div className="container-fluid">
          <div className="row p-md-2">
            <div className="card p-3 border-0">
              <div className="mb-3 mb-md-4">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={backToSearchResults}
                >
                  <i className="bi bi-arrow-left"></i> Back
                </button>
              </div>
              <ViewPropertyResults
                selectedPropertyResults={selectedPropertyResults}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
export default Home;
