import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
// import { NavLink } from "react-router-dom";
// import { toast } from "react-toastify";
import { rootTitle } from "../../CommonFunctions";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";
import CommonSpinner from "../../CommonSpinner";
import Pagination from "../../Pagination";
import ViewPropertyResults from "../../components/ViewPropertyResults";

let authHeader = "";
let propertiesPerPage = 4;
const ViewAllProperties = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyResults, setSelectedPropertyResults] = useState([]);
  const allPropertiesPageRef = useRef();
  const viewCurrentPropertyResultsRef = useRef();

  const [pageCount, setPageCount] = useState(0);
  const paginationRef = useRef();

  const getPropertiesFromApi = async () => {
    setLoading(true);
    // Hide pagination while loading.
    paginationRef.current.classList.add("d-none");
    const dataToPost = {
      batch_number: 1,
      batch_size: propertiesPerPage,
    };

    const propertiesRes = await axios.post(
      `/sam/v1/property/auth/all-properties`,
      dataToPost,
      { headers: authHeader }
    );

    const propertyCountRes = await axios.get(
      `/sam/v1/property/auth/property-count`,
      { headers: authHeader }
    );

    let arr = propertyCountRes.data;
    let totalCount = 0;

    arr.forEach((type) => {
      totalCount += type.count;
    });

    if (propertyCountRes.data) {
      setPageCount(Math.ceil(totalCount / propertiesPerPage));
    }

    if (propertiesRes.data.length > 0) {
      paginationRef.current.classList.remove("d-none");
      setProperties(propertiesRes.data);
    } else {
      paginationRef.current.classList.add("d-none");
    }
    setLoading(false);
  };

  // This will run when we click any page link in pagination. e.g. prev, 1, 2, 3, 4, next.
  const handlePageClick = async (pageNumber) => {
    window.scrollTo(0, 0);
    let currentPage = pageNumber.selected + 1;
    const nextOrPrevPagePropertyData = await fetchMoreProperties(currentPage);
    setProperties(nextOrPrevPagePropertyData);
  };

  // Fetch more jobs on page click.
  const fetchMoreProperties = async (currentPage) => {
    const dataToPost = {
      batch_number: currentPage,
      batch_size: propertiesPerPage,
    };
    const propertiesRes = await axios.post(
      `/sam/v1/property/auth/all-properties`,
      dataToPost,
      { headers: authHeader }
    );
    console.log(propertiesRes.data);
    return propertiesRes.data;
  };

  // const deleteProperty = (propertyId) => {
  //   const propertiesToShow = properties.filter((property) => {
  //     return property._id !== propertyId;
  //   });
  //   toast.success(`Property with ID: ${propertyId} deleted Successfuly`);
  //   setProperties(propertiesToShow);
  // };

  const viewCurrentProperty = async (type, city, range) => {
    viewCurrentPropertyResultsRef.current.classList.remove("d-none");
    window.scrollTo(0, 0);
    allPropertiesPageRef.current.classList.add("d-none");
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
        });
    } catch (error) {}
  };

  const backToAllPropertiesPage = () => {
    viewCurrentPropertyResultsRef.current.classList.add("d-none");
    allPropertiesPageRef.current.classList.remove("d-none");
  };

  useEffect(() => {
    rootTitle.textContent = "ADMIN - PROPERTIES";
    getPropertiesFromApi();
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div
            className="col-xl-10 col-lg-9 col-md-8"
            ref={allPropertiesPageRef}
          >
            <BreadCrumb />
            <>
              <h1 className="text-center text-primary fw-bold">Properties</h1>
              <hr />
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "60vh" }}
                >
                  <CommonSpinner
                    spinnerColor="primary"
                    height="4rem"
                    width="4rem"
                  />
                </div>
              ) : properties.length <= 0 ? (
                <div className="d-flex align-items-center justify-content-center mt-5">
                  <h1 className="fw-bold custom-heading-color">
                    Sorry ! No Properties Found :(
                  </h1>
                </div>
              ) : (
                <section className="admin-view-all-properties">
                  <div className="container-fluid">
                    <div className="row">
                      {properties.map((property, Index) => {
                        const {
                          category,
                          city_name,
                          market_value,
                          expected_price,
                          property_id,
                          property_number,
                        } = property;
                        return (
                          <div className="col-xl-3 col-md-6" key={Index}>
                            <div className="admin-property-card-wrapper">
                              <div className="card mb-4">
                                <div className="top-line"></div>
                                <img
                                  className="card-img-top"
                                  src="/images2.jpg"
                                  alt=""
                                />
                                <div className="card-body">
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
                                    <span>Expected Price: </span>
                                    <span className="common-btn-font">
                                      <i className="bi bi-currency-rupee"></i>
                                      {`${Math.round(
                                        parseInt(expected_price) / 10000000
                                      )} Crores`}
                                    </span>
                                  </div>
                                  <div className="mt-3 d-flex">
                                    {/* <NavLink
                                      to={`/admin/property/properties/view-property/${property_id}`}
                                      className="btn btn-sm btn-outline-success property-button-wrapper"
                                    >
                                      <i className="bi bi-eye-fill"></i>
                                    </NavLink> */}
                                    <button className="btn btn-sm btn-outline-success property-button-wrapper">
                                      <i className="bi bi-eye-fill"></i>
                                    </button>
                                    <button className="mx-2 btn btn-sm btn-outline-primary property-button-wrapper">
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger property-button-wrapper">
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}
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
            </>
          </div>
          <div
            className="col-xl-10 col-lg-9 col-md-8 d-none"
            ref={viewCurrentPropertyResultsRef}
          >
            <>
              <div className="container-fluid">
                <div className="row">
                  <div className="card border-0">
                    <div className="my-4">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={backToAllPropertiesPage}
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
            </>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAllProperties;
