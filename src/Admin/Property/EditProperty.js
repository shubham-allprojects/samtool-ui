import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";

let authHeader = "";
let zipError = false;
let areaError = false;
const EditProperty = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }

  const goTo = useNavigate();
  const [formData, setFormData] = useState({});
  const [currentPropertyData, setCurrentPropertyData] = useState({});
  const {
    completion_date,
    sale_availability_date,
    purchase_date,
    mortgage_date,
    market_price,
    ready_reckoner_price,
    expected_price,
    Flat_No,
    plot_no,
    saleable_area,
    carpet_area,
    property_number,
    building_name,
    society_name,
    locality,
    landmark,
    PIN,
  } = currentPropertyData;
  // const { locality, state, zip } = formData.address_details;

  const [propertyCategories, setPropertyCategories] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankBranches, setBankBranches] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [zipCodeValidationMessage, setZipCodeValidationMessage] = useState("");
  const [areaValidationMessage, setAreaValidationMessage] = useState("");
  const branchSelectBoxRef = useRef();
  const citySelectBoxRef = useRef();
  const notSoldCheckRef = useRef();

  // const getDataFromApi = async () => {
  //   const propertyCategoryRes = await axios.get(`/sam/v1/property/by-category`);
  //   setPropertyCategories(propertyCategoryRes.data);
  //   const bankRes = await axios.get(`/sam/v1/property/by-bank`);
  //   setBanks(bankRes.data);
  //   const statesRes = await axios.get(`/sam/v1/property/by-state`);
  //   setAllStates(statesRes.data);
  // };

  // const commonFnToSaveFormData = (name, value) => {
  //   setFormData({ ...formData, [name]: value });
  // };

  // const commonFnToSaveAddressDetails = (name, value) => {
  //   setFormData({
  //     ...formData,
  //     address_details: {
  //       ...formData.address_details,
  //       [name]: value,
  //       address: locality,
  //     },
  //   });
  // };

  const onInputChange = async (e) => {
    // const { name, value } = e.target;
    // if (name === "type_id") {
    //   if (value) {
    //     commonFnToSaveFormData(name, parseInt(value));
    //   }
    // } else if (name === "property_number") {
    //   commonFnToSaveFormData(name, value);
    // } else if (name === "bank") {
    //   if (value) {
    //     branchSelectBoxRef.current.classList.remove("d-none");
    //     const branchRes = await axios.get(
    //       `/sam/v1/property/auth/bank-branches/${value}`,
    //       {
    //         headers: authHeader,
    //       }
    //     );
    //     setBankBranches(branchRes.data);
    //   } else {
    //     branchSelectBoxRef.current.classList.add("d-none");
    //   }
    // } else if (name === "bank_branch_id") {
    //   commonFnToSaveFormData(name, parseInt(value));
    // } else if (name === "is_stressed") {
    //   commonFnToSaveFormData(name, parseInt(value));
    // } else if (name === "status") {
    //   commonFnToSaveFormData(name, value);
    // } else if (name === "saleable_area") {
    //   commonFnToSaveFormData(name, `${value} sq. ft.`);
    // } else if (name === "carpet_area") {
    //   commonFnToSaveFormData(name, `${value} sq. ft.`);
    // } else if (name === "market_price") {
    //   commonFnToSaveFormData(name, parseInt(value));
    // } else if (name === "ready_reckoner_price") {
    //   commonFnToSaveFormData(name, parseInt(value));
    // } else if (name === "expected_price") {
    //   commonFnToSaveFormData(name, parseInt(value));
    // } else if (name === "completion_date") {
    //   commonFnToSaveFormData(name, value);
    // } else if (name === "purchase_date") {
    //   commonFnToSaveFormData(name, value);
    // } else if (name === "mortgage_date") {
    //   commonFnToSaveFormData(name, value);
    // } else if (name === "is_sold") {
    //   const is_available_for_sale-1 = document.getElementById("is_available_for_sale-1");
    //   if (value === "1") {
    //     notSoldCheckRef.current.removeAttribute("checked");
    //     if (is_available_for_sale-1) {
    //       is_available_for_sale-1.selected = true;
    //     }
    //     setFormData({
    //       ...formData,
    //       [name]: parseInt(value),
    //       is_available_for_sale: 0,
    //     });
    //   } else {
    //     setFormData({
    //       ...formData,
    //       [name]: parseInt(value),
    //       is_available_for_sale: 1,
    //     });
    //   }
    // } else if (name === "is_available_for_sale") {
    //   setFormData({
    //     ...formData,
    //     [name]: parseInt(value),
    //   });
    // } else if (name === "sale_availability_date") {
    //   commonFnToSaveFormData(name, value);
    // } else if (name === "flat_number") {
    //   commonFnToSaveAddressDetails(name, parseInt(value));
    // } else if (name === "building_name") {
    //   commonFnToSaveAddressDetails(name, value);
    // } else if (name === "society_name") {
    //   commonFnToSaveAddressDetails(name, value);
    // } else if (name === "plot_number") {
    //   commonFnToSaveAddressDetails(name, parseInt(value));
    // } else if (name === "locality") {
    //   commonFnToSaveAddressDetails(name, value);
    // } else if (name === "landmark") {
    //   commonFnToSaveAddressDetails(name, value);
    // } else if (name === "state") {
    //   if (value) {
    //     commonFnToSaveAddressDetails(name, parseInt(value));
    //     const citiesRes = await axios.post(`/sam/v1/property/by-city`, {
    //       state_id: parseInt(value),
    //     });
    //     setAllCities(citiesRes.data);
    //     citySelectBoxRef.current.classList.remove("d-none");
    //   } else {
    //     citySelectBoxRef.current.classList.add("d-none");
    //   }
    // } else if (name === "city") {
    //   commonFnToSaveAddressDetails(name, parseInt(value));
    // } else if (name === "zip") {
    //   if (value) {
    //     commonFnToSaveAddressDetails(name, parseInt(value));
    //   }
    // }
  };

  // const resetValidationsOnSubmit = () => {
  //   setAreaValidationMessage("");
  //   setZipCodeValidationMessage("");
  // };

  const onFormSubmit = async (e) => {
    // e.preventDefault();
    // await axios
    //   .post(`/sam/v1/customer-registration/zipcode-validation`, {
    //     zipcode: String(zip),
    //     state_id: parseInt(state),
    //   })
    //   .then((res) => {
    //     if (res.data.status === 0) {
    //       setZipCodeValidationMessage("Invalid ZipCode.");
    //       zipError = true;
    //     } else {
    //       setAreaValidationMessage("");
    //       zipError = false;
    //     }
    //   });
    // if (parseInt(saleable_area) < parseInt(carpet_area)) {
    //   setAreaValidationMessage("Carpet area must be less than salable area.");
    //   areaError = true;
    // } else {
    //   setAreaValidationMessage("");
    //   areaError = false;
    // }
    // if (zipError || areaError) {
    //   if (zipError === false) {
    //     setZipCodeValidationMessage("");
    //   }
    //   if (areaError === false) {
    //     setAreaValidationMessage("");
    //   }
    // } else {
    //   console.log(formData);
    //   try {
    //     await axios
    //       .post(`/sam/v1/property/auth/update-property`, formData, {
    //         headers: authHeader,
    //       })
    //       .then((res) => {
    //         if (res.data.msg === 0) {
    //           resetValidationsOnSubmit();
    //           toast.success("Property added successfully");
    //           e.target.reset();
    //           goTo("/admin/property/single-property-documents-upload");
    //         } else {
    //           toast.error("Internal server error");
    //         }
    //       });
    //   } catch (error) {
    //     toast.error("Internal server error");
    //   }
    // }
  };

  const getCurrentPropertyDataToUpdate = async () => {
    let propertyId = localStorage.getItem("propertyId");
    if (propertyId) {
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
      if (currentPropertyRes.data) {
        setCurrentPropertyData(currentPropertyRes.data);
        console.log(currentPropertyRes.data);
      }

      // Set default value for property type and make it selected in property_type select box
      propertyCategoryRes.data.forEach((i) => {
        if (i.type_name === currentPropertyRes.data.type_name) {
          let defaultPropertyType = document.getElementById(
            `property-type-${i.type_id}`
          );
          if (defaultPropertyType) {
            defaultPropertyType.selected = true;
          }
        }
      });

      // To make default bank selected in bank select box
      let defaultBank = document.getElementById(
        currentPropertyRes.data.branch_name.split(",")[0]
      );
      if (defaultBank) {
        defaultBank.selected = true;
      }
      const branchRes = await axios.get(
        `/sam/v1/property/auth/bank-branches/${defaultBank.value}`,
        {
          headers: authHeader,
        }
      );
      setBankBranches(branchRes.data);

      // Set default value for branch  and make it selected in branch select box
      branchRes.data.forEach((i) => {
        if (i.branch_name === currentPropertyRes.data.branch_name) {
          let defaultBranch = document.getElementById(`branch-${i.branch_id}`);
          if (defaultBranch) {
            defaultBranch.selected = true;
          }
        }
      });

      // default status
      let defaultStatus = document.getElementById(
        `status-${currentPropertyRes.data.status}`
      );
      if (defaultStatus) {
        defaultStatus.selected = true;
      }

      // default value of stressed status
      let defaultValueOfStressed = document.getElementById(
        `stressed-${currentPropertyRes.data.is_stressed}`
      );
      if (defaultValueOfStressed) {
        defaultValueOfStressed.checked = true;
      }

      // default state
      let defaultStateId = "";
      statesRes.data.forEach((i) => {
        if (i.state_name === currentPropertyRes.data.state_name) {
          defaultStateId = i.state_id;
          let defaultState = document.getElementById(`state-${i.state_id}`);
          if (defaultState) {
            defaultState.selected = true;
          }
        }
      });

      // default city
      const citiesRes = await axios.post(`/sam/v1/property/by-city`, {
        state_id: parseInt(defaultStateId),
      });
      setAllCities(citiesRes.data);
      let defaultCity = document.getElementById(
        currentPropertyRes.data.city_name
      );
      if (defaultCity) {
        defaultCity.selected = true;
      }

      // default is_sold value
      let defaultIsSold = document.getElementById(
        `is_sold-${currentPropertyRes.data.is_sold}`
      );
      if (defaultIsSold) {
        defaultIsSold.checked = true;
      }

      // default is_available_for_sale value
      let defaultIsAvailableForSale = document.getElementById(
        `is_available_for_sale-${currentPropertyRes.data.is_available_for_sale}`
      );
      if (defaultIsAvailableForSale) {
        defaultIsAvailableForSale.selected = true;
      }
    }
  };

  useEffect(() => {
    getCurrentPropertyDataToUpdate();
    // notSoldCheckRef.current.setAttribute("checked", "true");
    // getDataFromApi();
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 mt- mt-md-0">
            <BreadCrumb />
            <section className="add-property-wrapper mb-4">
              <div className="container-fluid">
                <div className="row justify-content-center">
                  <div className="col-xl-12">
                    <form onSubmit={onFormSubmit} className="card p-xl-2">
                      <div className="card-body">
                        <h4 className="fw-bold">Update Property</h4>
                        <hr />
                        {/* Row 1 - Basic Details */}
                        <div className="row mb-3">
                          <div className="col-12">
                            <h5 className="fw-bold text-primary">
                              Basic details
                            </h5>
                          </div>
                          <div className="col-xl-4 col-md-6">
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="type_id"
                              >
                                Property type
                              </label>
                              <select
                                id="type_id"
                                name="type_id"
                                className="form-select"
                                onChange={onInputChange}
                                required
                              >
                                <option value=""></option>
                                {propertyCategories ? (
                                  propertyCategories.map((data) => {
                                    return (
                                      <option
                                        key={data.type_id}
                                        value={data.type_id}
                                        id={`property-type-${data.type_id}`}
                                      >
                                        {data.type_name}
                                      </option>
                                    );
                                  })
                                ) : (
                                  <></>
                                )}
                              </select>
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mt-3 mt-md-0">
                            <div className="form-group">
                              <label
                                htmlFor="property_number"
                                className="form-label common-btn-font"
                              >
                                Property Number
                              </label>
                              <input
                                type="text"
                                id="property_number"
                                name="property_number"
                                className="form-control"
                                defaultValue={property_number}
                                onChange={onInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mt-3 mt-xl-0">
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
                                required
                              >
                                <option value=""></option>
                                {banks ? (
                                  banks.map((data) => {
                                    return (
                                      <option
                                        key={data.bank_id}
                                        value={data.bank_id}
                                        id={data.bank_name}
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
                            className="col-xl-4 col-md-6 mt-3"
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
                                required
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
                              <label className="form-label common-btn-font">
                                Is stressed?
                              </label>
                              <br />
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="is_stressed"
                                  value="1"
                                  id="stressed-1"
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
                                  name="is_stressed"
                                  value="0"
                                  id="stressed-0"
                                  onChange={onInputChange}
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
                          <div className="col-xl-4 col-md-6 mt-3">
                            <div className="form-group">
                              <label
                                htmlFor="status"
                                className="form-label common-btn-font"
                              >
                                Status
                              </label>
                              <br />
                              <select
                                name="status"
                                onChange={onInputChange}
                                id="status"
                                className="form-select"
                                required
                              >
                                <option value=""></option>
                                <option id="status-0" value="0">
                                  0
                                </option>
                                <option id="status-1" value="1">
                                  1
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Row 2 - Area Details*/}
                        <div className="row mb-3">
                          <div className="col-12">
                            <h5 className="fw-bold text-primary">Area</h5>
                          </div>
                          <div className="col-xl-4 col-md-6">
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="saleable_area"
                              >
                                Saleable area (sq. ft.)
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="saleable_area"
                                name="saleable_area"
                                defaultValue={
                                  saleable_area
                                    ? parseInt(saleable_area.split("sqrt")[0])
                                    : ""
                                }
                                onChange={onInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mt-3 mt-md-0">
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="carpet_area"
                              >
                                Carpet area (sq. ft.)
                              </label>
                              <input
                                type="number"
                                className={`form-control ${
                                  areaValidationMessage ? "border-danger" : ""
                                }`}
                                id="carpet_area"
                                name="carpet_area"
                                defaultValue={
                                  saleable_area
                                    ? parseInt(carpet_area.split("sqrt")[0])
                                    : ""
                                }
                                onChange={onInputChange}
                                required
                              />
                              <span
                                className={`text-danger ${
                                  areaValidationMessage ? "" : "d-none"
                                }`}
                              >
                                {areaValidationMessage}
                              </span>
                            </div>
                          </div>
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
                        </div>

                        {/* Row 4 - Dates & Availability Details */}
                        <div className="row mb-3">
                          <div className="col-12">
                            <h5 className="fw-bold text-primary">
                              Dates & Availability
                            </h5>
                          </div>
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
                                onChange={onInputChange}
                                required
                              />
                            </div>
                          </div>
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
                                onChange={onInputChange}
                                defaultValue={
                                  purchase_date
                                    ? purchase_date.split(" ")[0]
                                    : ""
                                }
                                required
                              />
                            </div>
                          </div>
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
                          <div className={`col-xl-4 col-md-6 mb-3 mb-xl-0`}>
                            {/* ${is_sold === 1 ? "d-none" : ""} */}
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
                                <option value="1" id="is_available_for_sale-1">
                                  Yes
                                </option>
                                <option value="0" id="is_available_for_sale-0">
                                  No
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className={`col-xl-4 col-md-6`}>
                            {/* ${is_sold === 1 ? "d-none" : ""} */}
                            <div className="form-group">
                              <label
                                htmlFor="sale_availability_date"
                                className="form-label common-btn-font"
                              >
                                Sale availability
                              </label>
                              <input
                                className="form-control"
                                type="date"
                                id="sale_availability_date"
                                name="sale_availability_date"
                                defaultValue={
                                  sale_availability_date
                                    ? sale_availability_date.split(" ")[0]
                                    : ""
                                }
                                onChange={onInputChange}
                                // required={is_sold === 1 ? false : true}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Row 5 - Address Details */}
                        <div className="row">
                          <div className="col-12">
                            <h5 className="fw-bold text-primary">Address</h5>
                          </div>
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
                                defaultValue={Flat_No}
                                onChange={onInputChange}
                              />
                            </div>
                          </div>
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
                                onChange={onInputChange}
                              />
                            </div>
                          </div>
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
                                onChange={onInputChange}
                              />
                            </div>
                          </div>
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
                                defaultValue={plot_no}
                                onChange={onInputChange}
                              />
                            </div>
                          </div>
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
                                onChange={onInputChange}
                              />
                            </div>
                          </div>

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
                                onChange={onInputChange}
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-6 mb-3">
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="state"
                              >
                                State
                              </label>
                              <select
                                id="state"
                                name="state"
                                className="form-select"
                                onChange={onInputChange}
                                required
                              >
                                <option value=""></option>
                                {allStates ? (
                                  allStates.map((data) => {
                                    return (
                                      <option
                                        key={data.state_id}
                                        value={data.state_id}
                                        id={`state-${data.state_id}`}
                                      >
                                        {data.state_name}
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
                            className="col-xl-4 col-md-6 mb-3"
                            // ref={citySelectBoxRef}
                          >
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="city"
                              >
                                City
                              </label>
                              <select
                                id="city"
                                name="city"
                                className="form-select"
                                onChange={onInputChange}
                                // required={state !== "" ? true : false}
                              >
                                <option value=""></option>
                                {allCities ? (
                                  allCities.map((data) => {
                                    return (
                                      <option
                                        key={data.city_id}
                                        value={data.city_id}
                                        id={data.city_name}
                                      >
                                        {data.city_name}
                                      </option>
                                    );
                                  })
                                ) : (
                                  <></>
                                )}
                              </select>
                            </div>
                          </div>
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
                                onChange={onInputChange}
                                id="zip"
                                name="zip"
                                defaultValue={PIN}
                                className={`form-control ${
                                  zipCodeValidationMessage
                                    ? "border-danger"
                                    : ""
                                }`}
                              ></input>
                              <span
                                className={`text-danger ${
                                  zipCodeValidationMessage ? "" : "d-none"
                                }`}
                              >
                                {zipCodeValidationMessage}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="row text-end">
                          <div className="col-12">
                            <button type="submit" className="btn btn-primary">
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProperty;
