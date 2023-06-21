import React, { useEffect, useRef, useState } from "react";
import HomeAboutUs from "./HomeAboutUs";
import Layout from "../1.CommonLayout/Layout";
import axios from "axios";
import { rootTitle } from "../../CommonFunctions";
import Pagination from "../../Pagination";
import CommonSpinner from "../../CommonSpinner";
import { NavLink, useNavigate } from "react-router-dom";
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

  // This function will run on change of input fields.
  const onFieldsChange = async (e) => {
    let apis = {
      cityAPI: `${url}/by-city`,
      addressAPI: `${url}/by-address`,
    };
    const { name, value } = e.target;
    // const fiveSectionCol = document.querySelectorAll(".");

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
      // document.getElementById("city-col").classList.remove("d-none");
      // This is to set width of background white box based on number of select input boxes.
      // fiveSectionCol.forEach((col) => {
      //   col.classList.remove("col-md-2");
      //   col.classList.add("col-md-2");
      // });
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
      // document.getElementById("locality-col").classList.remove("d-none");
      // This is to set width of background white box based on number of select input boxes.
      // fiveSectionCol.forEach((col) => {
      //   col.classList.remove("w-22");
      //   col.classList.add("w-18");
      // });
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
            console.log(res.data);
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

            <div className="d-flex justify-content-center">
              <div className="row five-box-row">
                <div className="col-xl-2 col-lg-3 col-md-4 col-12">
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
                  className="col-xl-2 col-lg-3 col-md-4 col-12  mt-3 mt-md-0"
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
                {/* <div
                  className="col-md-2 col-12 mt-3 mt-md-0"
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
                </div> */}
                <div className="col-xl-2 col-lg-3 col-md-4 col-12 mt-3 mt-md-0">
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
                {/* <div className="col-md-2 col-12 mt-3 mt-md-0">
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
                </div> */}
                {/* <div className="col-md-2 col-12 mt-3 mt-md-0">
                  <div className="inner-box">
                    <label htmlFor="more-filters">More Filters</label>
                    <div className="dropdown">
                      <div
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        className="form-select form-select-sm"
                      ></div>
                      <ul
                        className="dropdown-menu more-filters-dropdown-menu"
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
                </div> */}
              </div>
            </div>

            {/* Search button*/}
            <div className="row justify-content-center py-4 search-btn-wrapper">
              <div className="text-center">
                {/* <button
                  className={`btn btn-primary common-btn-font ${
                    Object.keys(dataToPost).length > 2 ? "" : "disabled"
                  }`}
                  onClick={getPropertyData}
                >
                  Search
                </button> */}
                <NavLink
                  className={`btn btn-primary common-btn-font ${
                    Object.keys(dataToPost).length > 2 ? "" : "disabled"
                  }`}
                  to={{
                    pathname: `/property-search-results/${encodeURIComponent(
                      JSON.stringify(dataToPost)
                    )}`,
                  }}
                >
                  Search
                </NavLink>
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

      {/* comment modal */}

      <div
        className="modal fade"
        id="commentModal"
        tabindex="-1"
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
  );
}
export default Home;
