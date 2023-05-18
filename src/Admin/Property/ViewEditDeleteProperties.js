import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { rootTitle } from "../../CommonFunctions";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";
import CommonSpinner from "../../CommonSpinner";
import Pagination from "../../Pagination";
import ViewProperty from "./ViewProperty";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { toggleClassOfNextPrevPageItems } from "../../CommonFunctions";

let authHeader = "";
let propertiesPerPage = 4;
let zipError = false;
let areaError = false;
const ViewEditDeleteProperties = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateBtnLoading, setUpdateBtnLoading] = useState(false);
  const allPropertiesPageRef = useRef();
  const viewCurrentPropertyRef = useRef();
  const editPropertyRef = useRef();
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const paginationRef = useRef();

  // useStates for delete functionalities
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [totalPropertyCount, setTotalPropertyCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [storedDataToPost, setStoredDataToPost] = useState({});
  const [
    confirmDeletePropertyBtnDisabled,
    setConfirmDeletePropertyBtnDisabled,
  ] = useState(true);
  const confirmDeletePropertyInputRef = useRef();

  const getPropertiesFromApi = async () => {
    setLoading(true);
    // Hide pagination while loading.
    paginationRef.current.classList.add("d-none");
    setLoading(true);
    let dataToPost = {
      batch_number: 1,
      batch_size: propertiesPerPage,
    };
    setStoredDataToPost(dataToPost);
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

    setTotalPropertyCount(totalCount);

    let totalPages = Math.ceil(totalCount / propertiesPerPage);
    if (propertyCountRes.data) {
      setPageCount(totalPages);
    }

    if (propertiesRes.data.length > 0) {
      paginationRef.current.classList.remove("d-none");
      setProperties(propertiesRes.data);
    } else {
      paginationRef.current.classList.add("d-none");
    }
    setLoading(false);
  };

  const toggleActivePageClass = (activePage) => {
    let arr = document.querySelectorAll(".page-item");
    arr.forEach((pageItem) => {
      if (parseInt(pageItem.textContent) === activePage) {
        pageItem.classList.add("active");
      } else {
        pageItem.classList.remove("active");
      }
    });
  };

  // This will run when we click any page link in pagination. e.g. prev, 1, 2, 3, 4, next.
  const handlePageClick = async (pageNumber) => {
    window.scrollTo(0, 0);
    let currentPage = pageNumber.selected + 1;
    toggleActivePageClass(currentPage);
    setCurrentPageNumber(currentPage);
    const nextOrPrevPagePropertyData = await fetchMoreProperties(currentPage);
    setProperties(nextOrPrevPagePropertyData);
    toggleClassOfNextPrevPageItems();
  };

  // Fetch more jobs on page click.
  const fetchMoreProperties = async (currentPage) => {
    const dataToPost = {
      batch_number: currentPage,
      batch_size: propertiesPerPage,
    };
    setStoredDataToPost(dataToPost);
    const propertiesRes = await axios.post(
      `/sam/v1/property/auth/all-properties`,
      dataToPost,
      { headers: authHeader }
    );
    return propertiesRes.data;
  };

  const deleteProperty = async (propertyId) => {
    try {
      await axios
        .delete(`/sam/v1/property/auth/delete-property/${propertyId}`, {
          headers: authHeader,
        })
        .then((res) => {
          if (res.data.msg === 0) {
            toast.success(`Property deleted successfully`);
            confirmDeletePropertyInputRef.current.value = "";
            setConfirmDeletePropertyBtnDisabled(true);
            setTotalPropertyCount(totalPropertyCount - 1);
            if (totalPropertyCount - 1 !== 0) {
              let newPageCount = Math.ceil(
                (totalPropertyCount - 1) / propertiesPerPage
              );
              setPageCount(newPageCount);
              if (newPageCount < currentPageNumber) {
                handlePageClick({ selected: currentPageNumber - 2 });
              } else {
                handlePageClick({ selected: currentPageNumber - 1 });
              }
            } else {
              setProperties(false);
            }
          } else {
            toast.error("Internal server error");
          }
        });
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  const onDeletePropertyBtnClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
    confirmDeletePropertyInputRef.current.value = "";
    setConfirmDeletePropertyBtnDisabled(true);
  };
  const [propertiesLinkDisabled, setPropertiesLinkDisabled] = useState(false);

  const viewCurrentProperty = async (id) => {
    console.log(id);
    const currentPropertyRes = await axios.get(
      `/sam/v1/property/single-property/${id}`,
      { headers: authHeader }
    );
    setSelectedProperty(currentPropertyRes.data);
    viewCurrentPropertyRef.current.classList.remove("d-none");
    window.scrollTo(0, 0);
    allPropertiesPageRef.current.classList.add("d-none");
    setPropertiesLinkDisabled(true);
  };

  const backToAllPropertiesPage = async () => {
    const propertiesRes = await axios.post(
      `/sam/v1/property/auth/all-properties`,
      storedDataToPost,
      { headers: authHeader }
    );
    setProperties(propertiesRes.data);
    setPropertiesLinkDisabled(false);
    viewCurrentPropertyRef.current.classList.add("d-none");
    editPropertyRef.current.classList.add("d-none");
    allPropertiesPageRef.current.classList.remove("d-none");
  };

  const [possessionCheckValue, setPossessionCheckValue] = useState({
    titleClearYes: false,
    titleClearNo: false,
  });

  const { titleClearYes, titleClearNo } = possessionCheckValue;

  // const goTo = useNavigate();
  const [formData, setFormData] = useState({
    address_details: {},
  });
  const {
    completion_date,
    purchase_date,
    mortgage_date,
    market_price,
    ready_reckoner_price,
    expected_price,
    saleable_area,
    carpet_area,
    property_number,
    property_id,
    is_sold,
    territory,
    distress_value,
    is_stressed,
    // is_available_for_sale,
  } = formData;
  const {
    locality,
    flat_number,
    building_name,
    society_name,
    plot_number,
    landmark,
    zip,
  } = formData.address_details;

  const [propertyCategories, setPropertyCategories] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankBranches, setBankBranches] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [zipCodeValidationMessage, setZipCodeValidationMessage] = useState("");
  const [areaValidationMessage, setAreaValidationMessage] = useState("");
  // const branchSelectBoxRef = useRef();
  // const citySelectBoxRef = useRef();
  const notSoldCheckRef = useRef();
  const [mainPageLoading, setMainPageLoading] = useState(false);
  const [idOfState, setIdOfState] = useState();

  const commonFnToSaveFormData = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const commonFnToSaveAddressDetails = (name, value) => {
    setFormData({
      ...formData,
      address_details: {
        ...formData.address_details,
        [name]: value,
        address: locality,
      },
    });
  };

  const onInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "type_id") {
      if (value) {
        commonFnToSaveFormData(name, parseInt(value));
      }
    }
    // else if (name === "property_number") {
    //   commonFnToSaveFormData(name, value);
    // }
    else if (name === "bank") {
      if (value) {
        // branchSelectBoxRef.current.classList.remove("d-none");
        const branchRes = await axios.get(
          `/sam/v1/property/auth/bank-branches/${value}`,
          {
            headers: authHeader,
          }
        );
        setBankBranches(branchRes.data);
      } else {
        // branchSelectBoxRef.current.classList.add("d-none");
      }
    } else if (name === "bank_branch_id") {
      commonFnToSaveFormData(name, parseInt(value));
    } else if (name === "is_stressed") {
      console.log(value);
      commonFnToSaveFormData(name, parseInt(value));
    }
    // else if (name === "status") {
    //   commonFnToSaveFormData(name, value);
    // }
    else if (name === "territory") {
      commonFnToSaveFormData(name, value);
    } else if (name === "saleable_area") {
      commonFnToSaveFormData(name, `${value} sq. ft.`);
    } else if (name === "carpet_area") {
      commonFnToSaveFormData(name, `${value} sq. ft.`);
    } else if (name === "market_price") {
      commonFnToSaveFormData(name, parseInt(value));
    } else if (name === "ready_reckoner_price") {
      commonFnToSaveFormData(name, parseInt(value));
    } else if (name === "expected_price") {
      commonFnToSaveFormData(name, parseInt(value));
    } else if (name === "distress_value") {
      commonFnToSaveFormData(name, parseInt(value));
    } else if (name === "completion_date") {
      commonFnToSaveFormData(name, value);
    } else if (name === "purchase_date") {
      commonFnToSaveFormData(name, value);
    } else if (name === "mortgage_date") {
      commonFnToSaveFormData(name, value);
    } else if (name === "is_sold") {
      const notForSale = document.getElementById("notForSale");
      if (value === "1") {
        notSoldCheckRef.current.removeAttribute("checked");
        if (notForSale) {
          notForSale.selected = true;
        }
        setFormData({
          ...formData,
          [name]: parseInt(value),
          is_available_for_sale: 0,
        });
      } else {
        setFormData({
          ...formData,
          [name]: parseInt(value),
          is_available_for_sale: 1,
        });
      }
    } else if (name === "is_available_for_sale") {
      setFormData({
        ...formData,
        [name]: parseInt(value),
      });
    }
    // else if (name === "sale_availability_date") {
    //   commonFnToSaveFormData(name, value);
    // }
    else if (name === "flat_number") {
      commonFnToSaveAddressDetails(name, parseInt(value));
    } else if (name === "building_name") {
      commonFnToSaveAddressDetails(name, value);
    } else if (name === "society_name") {
      commonFnToSaveAddressDetails(name, value);
    } else if (name === "plot_number") {
      commonFnToSaveAddressDetails(name, parseInt(value));
    } else if (name === "locality") {
      commonFnToSaveAddressDetails(name, value);
    } else if (name === "landmark") {
      commonFnToSaveAddressDetails(name, value);
    } else if (name === "state") {
      if (value) {
        commonFnToSaveAddressDetails(name, parseInt(value));
        const citiesRes = await axios.post(`/sam/v1/property/by-city`, {
          state_id: parseInt(value),
        });
        setAllCities(citiesRes.data);
        // citySelectBoxRef.current.classList.remove("d-none");
      } else {
        // citySelectBoxRef.current.classList.add("d-none");
      }
    } else if (name === "city") {
      commonFnToSaveAddressDetails(name, parseInt(value));
    } else if (name === "zip") {
      if (value) {
        commonFnToSaveAddressDetails(name, parseInt(value));
      }
    } else if (name === "title_clear_property") {
      if (value === "1") {
        setPossessionCheckValue({ titleClearYes: true, titleClearNo: false });
        setFormData({
          ...formData,
          [name]: parseInt(value),
          possession_of_the_property: "Owner / Customer consent",
        });
      } else if (value === "0") {
        setPossessionCheckValue({ titleClearYes: false, titleClearNo: true });
        setFormData({
          ...formData,
          [name]: parseInt(value),
          possession_of_the_property: "Legally attached",
        });
      } else {
        setPossessionCheckValue({ titleClearYes: false, titleClearNo: false });
      }
    }
  };

  const resetValidationsOnSubmit = () => {
    setAreaValidationMessage("");
    setZipCodeValidationMessage("");
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setUpdateBtnLoading(true);
    await axios
      .post(`/sam/v1/customer-registration/zipcode-validation`, {
        zipcode: String(zip),
        state_id: parseInt(idOfState),
      })
      .then((res) => {
        if (res.data.status === 0) {
          setZipCodeValidationMessage("Invalid ZipCode.");
          zipError = true;
          setUpdateBtnLoading(false);
        } else {
          setAreaValidationMessage("");
          zipError = false;
        }
      });
    if (parseInt(saleable_area) < parseInt(carpet_area)) {
      setAreaValidationMessage("Carpet area must be less than salable area.");
      areaError = true;
      setUpdateBtnLoading(false);
    } else {
      setAreaValidationMessage("");
      areaError = false;
    }
    if (zipError || areaError) {
      if (zipError === false) {
        setZipCodeValidationMessage("");
      }
      if (areaError === false) {
        setAreaValidationMessage("");
      }
    } else {
      try {
        console.log(JSON.stringify(formData));
        await axios
          .post(`/sam/v1/property/auth/update-property`, formData, {
            headers: authHeader,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.status === 0) {
              resetValidationsOnSubmit();
              toast.success("Property updated successfully");
              setUpdateBtnLoading(false);
              window.scrollTo(0, 0);
            } else {
              toast.error("Internal server error");
              setUpdateBtnLoading(false);
            }
          });
      } catch (error) {
        toast.error("Internal server error");
        setUpdateBtnLoading(false);
      }
    }
  };

  let defaultTypeId;
  const [otherValuesToShow, setOtherValuesToShow] = useState({});
  const { type_name, state_name, city_name } = otherValuesToShow;

  const getCurrentPropertyDataToUpdate = async (propertyId) => {
    setMainPageLoading(true);
    // let propertyId = localStorage.getItem("propertyId");
    if (propertyId) {
      allPropertiesPageRef.current.classList.add("d-none");
      editPropertyRef.current.classList.remove("d-none");
      setPropertiesLinkDisabled(true);
      // Get details from api e.g. state, banks etc.
      const propertyCategoryRes = await axios.get(
        `/sam/v1/property/by-category`
      );
      setPropertyCategories(propertyCategoryRes.data);
      const bankRes = await axios.get(`/sam/v1/property/by-bank`);
      setBanks(bankRes.data);
      const statesRes = await axios.get(`/sam/v1/property/by-state`);
      setAllStates(statesRes.data);

      // Get current property values
      const currentPropertyRes = await axios.get(
        `/sam/v1/property/single-property/${propertyId}`,
        { headers: authHeader }
      );
      // console.log(currentPropertyRes.data);
      const {
        type_name,
        branch_name,
        city_name,
        completion_date,
        purchase_date,
        mortgage_date,
        market_price,
        ready_reckoner_price,
        expected_price,
        flat_no,
        plot_no,
        saleable_area,
        carpet_area,
        property_number,
        society_name,
        locality,
        zip,
        is_sold,
        is_available_for_sale,
        status,
        is_stressed,
        property_id,
        state_id,
        state_name,
        city_id,
        bank_id,
        territory,
        possession_of_the_property,
        title_clear_property,
        distress_value,
        bank_branch_id,
      } = currentPropertyRes.data;
      setOtherValuesToShow(currentPropertyRes.data);
      setIdOfState(state_id);

      setAllDefaultValues(
        propertyCategoryRes.data,
        state_id,
        city_name,
        bank_id,
        branch_name,
        type_name,
        status,
        is_stressed,
        is_sold,
        is_available_for_sale,
        title_clear_property,
        bank_branch_id
      );

      if (currentPropertyRes.data) {
        setFormData({
          ...formData,
          property_id: property_id,
          type_id: defaultTypeId,
          bank_branch_id: parseInt(bank_branch_id),
          property_number: property_number,
          is_stressed: parseInt(is_stressed),
          is_available_for_sale: parseInt(is_available_for_sale),
          sale_availability_date: "2005-12-26 23:50:30",
          saleable_area: saleable_area,
          carpet_area: carpet_area,
          ready_reckoner_price: parseInt(ready_reckoner_price),
          expected_price: parseInt(expected_price),
          market_price: parseInt(market_price),
          completion_date: completion_date,
          purchase_date: purchase_date,
          mortgage_date: mortgage_date,
          is_sold: parseInt(is_sold),
          status: status,
          territory: territory,
          possession_of_the_property: possession_of_the_property,
          title_clear_property: parseInt(title_clear_property),
          distress_value: distress_value,
          address_details: {
            address: locality,
            locality: locality,
            flat_number: parseInt(flat_no),
            building_name: "Random name",
            society_name: society_name,
            plot_number: parseInt(plot_no),
            landmark: "Pune landmark",
            city: parseInt(city_id),
            zip: parseInt(zip),
            state: parseInt(state_id),
          },
        });
      }
    }
  };

  const setAllDefaultValues = async (
    propertyCategoryRes,
    state_id,
    city_name,
    bank_id,
    branch_name,
    type_name,
    status,
    is_stressed,
    is_sold,
    is_available_for_sale,
    title_clear_property,
    bank_branch_id
  ) => {
    // Set default value for property type and make it selected in property_type select box
    // propertyCategoryRes.forEach((i) => {
    //   if (i.type_name === type_name) {
    //     defaultTypeId = i.type_id;
    //     let defaultPropertyType = document.getElementById(
    //       `property-type-${i.type_id}`
    //     );
    //     if (defaultPropertyType) {
    //       defaultPropertyType.selected = true;
    //     }
    //   }
    // });

    // Default state
    let defaultState = document.getElementById(`state-${state_id}`);
    if (defaultState) {
      defaultState.selected = true;
    }

    // default city
    const citiesRes = await axios.post(`/sam/v1/property/by-city`, {
      state_id: parseInt(state_id),
    });
    setAllCities(citiesRes.data);
    let defaultCity = document.getElementById(city_name);
    if (defaultCity) {
      defaultCity.selected = true;
    }

    // To make default bank selected in bank select box
    let defaultBank = document.getElementById(`bank-${bank_id}`);
    if (defaultBank) {
      defaultBank.selected = true;
      const branchRes = await axios.get(
        `/sam/v1/property/auth/bank-branches/${defaultBank.value}`,
        {
          headers: authHeader,
        }
      );
      setBankBranches(branchRes.data);

      // Set default value for branch and make it selected in branch select box
      let defaultBranch = document.getElementById(`branch-${bank_branch_id}`);
      if (defaultBranch) {
        defaultBranch.selected = true;
      }
    }

    // default status
    // let defaultStatus = document.getElementById(`status-${status}`);
    // if (defaultStatus) {
    //   defaultStatus.selected = true;
    // }

    // default value of stressed status
    let defaultValueOfStressed = document.getElementById(
      `stressed-${is_stressed}`
    );
    if (defaultValueOfStressed) {
      defaultValueOfStressed.checked = true;
    }

    // default is_sold value
    let defaultIsSold = document.getElementById(`is_sold-${is_sold}`);
    if (defaultIsSold) {
      defaultIsSold.checked = true;
    }

    // default is_available_for_sale value
    let defaultIsAvailableForSale = document.getElementById(
      `is_available_for_sale-${is_available_for_sale}`
    );
    if (defaultIsAvailableForSale) {
      defaultIsAvailableForSale.selected = true;
    }

    // default title_clear_property value
    let defaultTitleClear = document.getElementById(
      `title_clear_property-${title_clear_property}`
    );
    if (defaultTitleClear) {
      defaultTitleClear.selected = true;
    }
    if (title_clear_property === "1") {
      setPossessionCheckValue({ titleClearYes: true, titleClearNo: false });
    } else {
      setPossessionCheckValue({ titleClearYes: false, titleClearNo: true });
    }
    setMainPageLoading(false);
  };

  useEffect(() => {
    rootTitle.textContent = "ADMIN - PROPERTIES";
    if (data) {
      getPropertiesFromApi();
    }
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar
            propertiesLinkDisabled={propertiesLinkDisabled}
            backToAllPropertiesPage={backToAllPropertiesPage}
          />
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
              ) : !properties ? (
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

                                  {expected_price ? (
                                    <div className="text-capitalize">
                                      <span>Expected Price: </span>
                                      <span className="common-btn-font">
                                        <i className="bi bi-currency-rupee"></i>
                                        {`${(
                                          parseInt(expected_price) / 10000000
                                        ).toFixed(2)} Cr.`}
                                      </span>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  <div className="mt-3 d-flex">
                                    <button
                                      onClick={() => {
                                        viewCurrentProperty(property_id);
                                      }}
                                      className="btn btn-sm btn-outline-success property-button-wrapper"
                                    >
                                      <i className="bi bi-eye-fill"></i>
                                    </button>

                                    <button
                                      onClick={() => {
                                        getCurrentPropertyDataToUpdate(
                                          property_id
                                        );
                                        getCurrentPropertyDataToUpdate(
                                          property_id
                                        );
                                      }}
                                      className="mx-2 btn btn-sm btn-outline-primary property-button-wrapper"
                                    >
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>

                                    <button
                                      data-bs-toggle="modal"
                                      data-bs-target="#confirmDeletePropertyModal"
                                      onClick={() => {
                                        onDeletePropertyBtnClick(property_id);
                                      }}
                                      className="btn btn-sm btn-outline-danger property-button-wrapper"
                                    >
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                    <NavLink
                                      onClick={() => {
                                        localStorage.setItem(
                                          "property_number",
                                          property_number
                                        );
                                      }}
                                      to={`/admin/property/single-property-documents-upload`}
                                      className="btn btn-sm btn-outline-dark property-button-wrapper ms-2"
                                    >
                                      <i className="bi bi-upload"></i>
                                    </NavLink>
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
            ref={viewCurrentPropertyRef}
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
                    <ViewProperty selectedProperty={selectedProperty} />
                  </div>
                </div>
              </div>
            </>
          </div>
          <div
            className="col-xl-10 col-lg-9 col-md-8 d-none"
            ref={editPropertyRef}
          >
            <>
              <BreadCrumb
                isUpdatePropertyPageActive={true}
                backToAllPropertiesPage={backToAllPropertiesPage}
              />
              <section className="add-property-wrapper mb-4">
                <div className="container-fluid">
                  <div className="row justify-content-center">
                    <div className="col-xl-12">
                      <div
                        className={`${
                          mainPageLoading ? "" : "d-none"
                        } d-flex align-items-center justify-content-center`}
                        style={{ minHeight: "75vh" }}
                      >
                        <CommonSpinner
                          spinnerColor="primary"
                          height="5rem"
                          width="5rem"
                          spinnerType="grow"
                        />
                      </div>

                      <form
                        onSubmit={onFormSubmit}
                        className={`card p-xl-2 ${
                          mainPageLoading ? "d-none" : ""
                        }`}
                      >
                        <div className="card-body">
                          <h4 className="fw-bold">Update Property</h4>
                          <hr />
                          <div className="row mb-3">
                            <div className="col-12 d-md-flex justify-content-md-start">
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  <span className="common-btn-font">
                                    Property ID
                                  </span>
                                  <span className="badge bg-light text-primary ms-2">
                                    {property_id}
                                  </span>
                                </button>
                              </div>

                              <div>
                                <button
                                  type="button"
                                  className="btn btn-primary ms-md-2 mt-md-0 mt-3"
                                >
                                  <span className="common-btn-font">
                                    Property Number
                                  </span>
                                  <span className="badge bg-light text-primary ms-2">
                                    {property_number}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Row 1 - Basic Details */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <h5 className="fw-bold text-primary">
                                Basic details
                              </h5>
                            </div>
                            {type_name ? (
                              <div className="col-xl-4 col-md-6">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="type_name"
                                  >
                                    Property type
                                  </label>
                                  <input
                                    id="type_name"
                                    type="text"
                                    className="form-control"
                                    defaultValue={type_name}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}

                            <div className="col-xl-4 col-md-6">
                              <div className="form-group">
                                <label
                                  className="form-label common-btn-font"
                                  htmlFor="bank"
                                >
                                  Bank
                                </label>
                                <select
                                  id="bank"
                                  name="bank"
                                  className="form-select"
                                  onChange={onInputChange}
                                  disabled
                                >
                                  <option value=""></option>
                                  {banks ? (
                                    banks.map((data) => {
                                      return (
                                        <option
                                          key={data.bank_id}
                                          value={data.bank_id}
                                          id={`bank-${data.bank_id}`}
                                        >
                                          {data.bank_name}
                                        </option>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </select>
                              </div>
                            </div>
                            <div
                              className="col-xl-4 col-md-6 mt-xl-0 mt-3"
                              // ref={branchSelectBoxRef}
                            >
                              <div className="form-group">
                                <label
                                  className="form-label common-btn-font"
                                  htmlFor="bank_branch_id"
                                >
                                  Branch
                                </label>
                                <select
                                  id="bank_branch_id"
                                  name="bank_branch_id"
                                  className="form-select"
                                  onChange={onInputChange}
                                  disabled
                                >
                                  <option value=""></option>
                                  {bankBranches ? (
                                    bankBranches.map((data) => {
                                      return (
                                        <option
                                          key={data.branch_id}
                                          value={data.branch_id}
                                          id={`branch-${data.branch_id}`}
                                        >
                                          {data.branch_name}
                                        </option>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </select>
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6 mt-3">
                              <div className="form-group">
                                <label
                                  className="form-label common-btn-font"
                                  htmlFor="title_clear_property"
                                >
                                  Title clear Property
                                </label>
                                <select
                                  id="title_clear_property"
                                  name="title_clear_property"
                                  className="form-select"
                                  onChange={onInputChange}
                                  disabled
                                >
                                  <option value=""></option>
                                  <option id="title_clear_property-1" value="1">
                                    Yes
                                  </option>
                                  <option id="title_clear_property-0" value="0">
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6 mt-3">
                              <div className="form-group">
                                <label
                                  className="form-label common-btn-font"
                                  htmlFor="possession"
                                >
                                  Possession of the property
                                </label>
                                <div id="possession">
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="inlineRadioOptions"
                                      id="possessionValue1"
                                      value="possessionValue"
                                      disabled
                                      checked={titleClearNo}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="possessionValue1"
                                    >
                                      Legally attached
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="inlineRadioOptions"
                                      id="possessionValue2"
                                      value="possessionValue"
                                      disabled
                                      checked={titleClearYes}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="possessionValue2"
                                    >
                                      Owner / Customer consent
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {is_stressed ? (
                              <div className="col-xl-4 col-md-6 mt-3">
                                <div className="form-group">
                                  <label
                                    htmlFor="is_stressed"
                                    className="form-label common-btn-font"
                                  >
                                    Is stressed?
                                  </label>
                                  <input
                                    id="is_stressed"
                                    type="text"
                                    className="form-control"
                                    defaultValue={
                                      is_stressed === 1 ? "Yes" : "No"
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {territory ? (
                              <div className="col-xl-4 col-md-6 mt-3">
                                <div className="form-group">
                                  <label
                                    htmlFor="territory"
                                    className="form-label common-btn-font"
                                  >
                                    Territory
                                  </label>
                                  <input
                                    type="text"
                                    id="territory"
                                    name="territory"
                                    className="form-control"
                                    defaultValue={territory}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          {/* Row 2 - Area Details*/}
                          <div className="row mb-3">
                            <div className="col-12">
                              <h5 className="fw-bold text-primary">Area</h5>
                            </div>
                            {saleable_area ? (
                              <div className="col-xl-4 col-md-6">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="saleable_area"
                                  >
                                    Saleable area (sq. ft.)
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="saleable_area"
                                    name="saleable_area"
                                    defaultValue={
                                      saleable_area
                                        ? parseInt(
                                            saleable_area.split("sqrt")[0]
                                          )
                                        : ""
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {carpet_area ? (
                              <div className="col-xl-4 col-md-6 mt-3 mt-md-0">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="carpet_area"
                                  >
                                    Carpet area (sq. ft.)
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="carpet_area"
                                    name="carpet_area"
                                    defaultValue={
                                      saleable_area
                                        ? parseInt(carpet_area.split("sqrt")[0])
                                        : ""
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>

                          {/* Row 3 - Pricing Details */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <h5 className="fw-bold text-primary">Pricing</h5>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <div className="form-group">
                                <label
                                  htmlFor="market_price"
                                  className="form-label common-btn-font"
                                >
                                  Market price (Rs.)
                                </label>
                                <input
                                  className="form-control"
                                  type="number"
                                  id="market_price"
                                  name="market_price"
                                  defaultValue={market_price}
                                  onChange={onInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6 mt-3 mt-md-0">
                              <div className="form-group">
                                <label
                                  htmlFor="ready_reckoner_price"
                                  className="form-label common-btn-font"
                                >
                                  Ready reckoner price (Rs.)
                                </label>
                                <input
                                  type="number"
                                  id="ready_reckoner_price"
                                  name="ready_reckoner_price"
                                  className="form-control"
                                  defaultValue={ready_reckoner_price}
                                  onChange={onInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6 mt-3 mt-xl-0">
                              <div className="form-group">
                                <label
                                  className="form-label common-btn-font"
                                  htmlFor="expected_price"
                                >
                                  Expected price (Rs.)
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="expected_price"
                                  name="expected_price"
                                  defaultValue={expected_price}
                                  onChange={onInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6 mt-3">
                              <div className="form-group">
                                <label
                                  className="form-label common-btn-font"
                                  htmlFor="distress_value"
                                >
                                  Distress Value (Rs.)
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="distress_value"
                                  name="distress_value"
                                  onChange={onInputChange}
                                  defaultValue={distress_value}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Row 4 - Dates & Availability Details */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <h5 className="fw-bold text-primary">
                                Dates & Availability
                              </h5>
                            </div>
                            {completion_date ? (
                              <div className="col-xl-4 mb-3 col-md-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="completion_date"
                                    className="form-label common-btn-font"
                                  >
                                    Completion date
                                  </label>
                                  <input
                                    className="form-control"
                                    type="date"
                                    id="completion_date"
                                    name="completion_date"
                                    defaultValue={
                                      completion_date
                                        ? completion_date.split(" ")[0]
                                        : ""
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {purchase_date ? (
                              <div className="col-xl-4 mb-3 col-md-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="purchase_date"
                                    className="form-label common-btn-font"
                                  >
                                    Purchase date
                                  </label>
                                  <input
                                    className="form-control"
                                    type="date"
                                    id="purchase_date"
                                    name="purchase_date"
                                    defaultValue={
                                      purchase_date
                                        ? purchase_date.split(" ")[0]
                                        : ""
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            <div className="col-xl-4 mb-3 col-md-6">
                              <div className="form-group">
                                <label
                                  htmlFor="mortgage_date"
                                  className="form-label common-btn-font"
                                >
                                  Mortgage date
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  id="mortgage_date"
                                  name="mortgage_date"
                                  onChange={onInputChange}
                                  defaultValue={
                                    mortgage_date
                                      ? mortgage_date.split(" ")[0]
                                      : ""
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6 mb-3 mb-xl-0">
                              <div className="form-group">
                                <label className="form-label common-btn-font">
                                  Is sold?
                                </label>
                                <br />
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="is_sold"
                                    value="1"
                                    id="is_sold-1"
                                    onChange={onInputChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio1"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="is_sold"
                                    value="0"
                                    id="is_sold-0"
                                    onChange={onInputChange}
                                    ref={notSoldCheckRef}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio2"
                                  >
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div
                              className={`col-xl-4 col-md-6 mb-3 mb-xl-0 ${
                                is_sold === 1 ? "d-none" : ""
                              }`}
                            >
                              <div className="form-group">
                                <label
                                  className="form-label common-btn-font"
                                  htmlFor="is_available_for_sale"
                                >
                                  Available for sale?
                                </label>
                                <select
                                  id="is_available_for_sale"
                                  name="is_available_for_sale"
                                  className="form-select"
                                  onChange={onInputChange}
                                  required
                                >
                                  <option
                                    value="1"
                                    id="is_available_for_sale-1"
                                  >
                                    Yes
                                  </option>
                                  <option
                                    value="0"
                                    id="is_available_for_sale-0"
                                  >
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {/* Row 5 - Address Details */}
                          <div className="row">
                            <div className="col-12">
                              <h5 className="fw-bold text-primary">Address</h5>
                            </div>
                            {flat_number ? (
                              <div className="col-xl-4 mb-3 col-md-6">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="flat_number"
                                  >
                                    Flat No.
                                  </label>
                                  <input
                                    id="flat_number"
                                    name="flat_number"
                                    type="number"
                                    className="form-control"
                                    defaultValue={flat_number}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {building_name ? (
                              <div className="col-xl-4 col-md-6 mb-3">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="building_name"
                                  >
                                    Building Name
                                  </label>
                                  <input
                                    id="building_name"
                                    name="building_name"
                                    type="text"
                                    className="form-control"
                                    defaultValue={building_name}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {society_name ? (
                              <div className="col-xl-4 col-md-6 mb-3">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="society_name"
                                  >
                                    Society Name
                                  </label>
                                  <input
                                    id="society_name"
                                    name="society_name"
                                    type="text"
                                    className="form-control"
                                    defaultValue={society_name}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {plot_number ? (
                              <div className="col-xl-4 mb-3 col-md-6">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="plot_number"
                                  >
                                    Plot No.
                                  </label>
                                  <input
                                    id="plot_number"
                                    name="plot_number"
                                    type="number"
                                    className="form-control"
                                    defaultValue={plot_number}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {locality ? (
                              <div className="col-xl-4 mb-3 col-md-6">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="locality"
                                  >
                                    Locality
                                  </label>
                                  <input
                                    id="locality"
                                    name="locality"
                                    type="text"
                                    className="form-control"
                                    defaultValue={locality}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}

                            {landmark ? (
                              <div className="col-xl-4 col-md-6 mb-3">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="landmark"
                                  >
                                    Landmark
                                  </label>
                                  <input
                                    id="landmark"
                                    name="landmark"
                                    type="text"
                                    className="form-control"
                                    defaultValue={landmark}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}

                            {state_name ? (
                              <div className="col-xl-4 col-md-6 mb-3">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="state"
                                  >
                                    State
                                  </label>
                                  <input
                                    id="state"
                                    name="state"
                                    className="form-control"
                                    defaultValue={state_name}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {city_name ? (
                              <div className="col-xl-4 col-md-6 mb-3">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="city"
                                  >
                                    City
                                  </label>
                                  <input
                                    id="city"
                                    name="city"
                                    className="form-control"
                                    defaultValue={city_name}
                                    disabled
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            {zip ? (
                              <div className="col-xl-4 col-md-6 mb-3">
                                <div className="form-group">
                                  <label
                                    className="form-label common-btn-font"
                                    htmlFor="zip"
                                  >
                                    Zip
                                  </label>
                                  <input
                                    type="text"
                                    id="zip"
                                    name="zip"
                                    defaultValue={zip}
                                    disabled
                                    className="form-control"
                                  ></input>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <hr />
                          <div className="row justify-content-end pt-2">
                            <div className="col-xl-2 col-12">
                              <button
                                disabled={updateBtnLoading ? true : false}
                                type="submit"
                                className="btn btn-primary common-btn-font w-100"
                              >
                                {updateBtnLoading ? (
                                  <>
                                    <span className="spinner-grow spinner-grow-sm me-2"></span>
                                    Updating...
                                  </>
                                ) : (
                                  "Update"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </>
          </div>
        </div>
      </div>
      {/* Modal */}
      <div
        className="modal fade"
        id="confirmDeletePropertyModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm confirm-delete-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Are you sure ?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label
                htmlFor="confirm-delete-property-input"
                className="form-label"
              >
                Please type <span className="fw-bold">Delete</span> to confirm.
              </label>
              <input
                onChange={(e) => {
                  if (e.target.value === "Delete") {
                    setConfirmDeletePropertyBtnDisabled(false);
                  } else {
                    setConfirmDeletePropertyBtnDisabled(true);
                  }
                }}
                ref={confirmDeletePropertyInputRef}
                type="text"
                name="confirm-delete-property-id"
                id="confirm-delete-property-input"
                className="form-control"
              />
              <button
                onClick={() => {
                  deleteProperty(selectedPropertyId);
                }}
                data-bs-dismiss="modal"
                disabled={confirmDeletePropertyBtnDisabled}
                className="btn btn-danger w-100 mt-3 fw-bold"
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewEditDeleteProperties;
