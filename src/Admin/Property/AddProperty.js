import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
// import BreadCrumb from "./BreadCrumb";

let authHeader = "";
const AddProperty = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }

  const [formData, setFormData] = useState({
    is_sold: 0,
    is_available_for_sale: 0,
    sale_availability_date: "Not Available",
    status: "",
    is_stressed: 1,
    address_details: {
      locality: "Urban",
    },
  });

  const { is_sold } = formData;
  const { locality } = formData.address_details;

  const [propertyCategories, setPropertyCategories] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankBranches, setBankBranches] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const branchSelectBoxRef = useRef();
  const citySelectBoxRef = useRef();

  const getDataFromApi = async () => {
    const propertyCategoryRes = await axios.get(`/sam/v1/property/by-category`);
    setPropertyCategories(propertyCategoryRes.data);
    const bankRes = await axios.get(`/sam/v1/property/by-bank`);
    setBanks(bankRes.data);
    const statesRes = await axios.get(`/sam/v1/property/by-state`);
    setAllStates(statesRes.data);
  };

  const commonFnToSaveFormData = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const commonFnToSaveAdressDetails = (name, value) => {
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
    if (name === "property_type") {
      if (value) {
        commonFnToSaveFormData(name, value);
      }
    } else if (name === "property_number") {
      commonFnToSaveFormData(name, value);
    } else if (name === "bank") {
      if (value) {
        branchSelectBoxRef.current.classList.remove("d-none");
        const branchRes = await axios.get(`/sam/v1/property/auth/${value}`, {
          headers: authHeader,
        });
        console.log(branchRes.data);
        setBankBranches(branchRes.data);
      } else {
        branchSelectBoxRef.current.classList.add("d-none");
      }
    } else if (name === "bank_branch_id") {
      commonFnToSaveFormData(name, parseInt(value));
    } else if (name === "saleable_area") {
      commonFnToSaveFormData(name, `${value} sq. ft.`);
    } else if (name === "carpet_area") {
      commonFnToSaveFormData(name, `${value} sq. ft.`);
    } else if (name === "market_price") {
      commonFnToSaveFormData(name, `${value} Rs`);
    } else if (name === "ready_reckoner_price") {
      commonFnToSaveFormData(name, `${value} Rs`);
    } else if (name === "expected_price") {
      commonFnToSaveFormData(name, `${value} Rs`);
    } else if (name === "completion_date") {
      commonFnToSaveFormData(name, value);
    } else if (name === "purchase_date") {
      commonFnToSaveFormData(name, value);
    } else if (name === "mortgage_date") {
      commonFnToSaveFormData(name, value);
    } else if (name === "is_sold") {
      const notForSale = document.getElementById("notForSale");
      if (value === "1") {
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
        });
      }
    } else if (name === "is_available_for_sale") {
      setFormData({
        ...formData,
        [name]: parseInt(value),
      });
    } else if (name === "sale_availability_date") {
      commonFnToSaveFormData(name, value);
    } else if (name === "flat_number") {
      commonFnToSaveAdressDetails(name, parseInt(value));
    } else if (name === "building_name") {
      commonFnToSaveAdressDetails(name, value);
    } else if (name === "society_name") {
      commonFnToSaveAdressDetails(name, value);
    } else if (name === "plot_number") {
      commonFnToSaveAdressDetails(name, parseInt(value));
    } else if (name === "locality") {
      commonFnToSaveAdressDetails(name, value);
    } else if (name === "landmark") {
      commonFnToSaveAdressDetails(name, value);
    } else if (name === "state") {
      if (value) {
        commonFnToSaveAdressDetails(name, value);
        const citiesRes = await axios.post(`/sam/v1/property/by-city`, {
          state_id: parseInt(value),
        });
        setAllCities(citiesRes.data);
        citySelectBoxRef.current.classList.remove("d-none");
      } else {
        citySelectBoxRef.current.classList.add("d-none");
      }
    } else if (name === "city") {
      commonFnToSaveAdressDetails(name, value);
    } else if (name === "zip") {
      commonFnToSaveAdressDetails(name, parseInt(value));
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    getDataFromApi();
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-8 mt-4 mt-md-0">
            {/* <BreadCrumb /> */}
            <section className="add-property-wrapper wrapper">
              <div className="container-fluid">
                <div className="row justify-content-center">
                  <div className="col-xl-12">
                    <form onSubmit={onFormSubmit} className="card p-xl-2">
                      <div className="card-body">
                        <h4 className="fw-bold">Add Property</h4>
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
                                htmlFor="property_type"
                              >
                                Property type
                              </label>
                              <select
                                id="property_type"
                                name="property_type"
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
                                        value={data.type_name}
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
                          <div className="col-xl-4 col-md-6">
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
                                onChange={onInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mt-md-3 mt-xl-0">
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
                            className="col-xl-4 col-md-6 mt-3 d-none"
                            ref={branchSelectBoxRef}
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
                                Salable area (sq. ft.)
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="saleable_area"
                                name="saleable_area"
                                onChange={onInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6">
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="carpet_area"
                              >
                                Carpet area (sq. ft.)
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="carpet_area"
                                name="carpet_area"
                                onChange={onInputChange}
                                required
                              />
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
                                onChange={onInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6">
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
                                onChange={onInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mt-md-3 mt-xl-0">
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
                                required
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mb-3 mb-xl-0">
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="is_sold"
                              >
                                Is sold?
                              </label>
                              <select
                                id="is_sold"
                                name="is_sold"
                                className="form-select"
                                onChange={onInputChange}
                                required
                              >
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                              </select>
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
                                <option id="notForSale" value="0">
                                  No
                                </option>
                                <option value="1">Yes</option>
                              </select>
                            </div>
                          </div>
                          <div
                            className={`col-xl-4 col-md-6 mb-3 mb-xl-0 ${
                              is_sold === 1 ? "d-none" : ""
                            }`}
                          >
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
                                onChange={onInputChange}
                                required={is_sold === 1 ? false : true}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Row 5 - Address Details */}
                        <div className="row mb-3">
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
                                className="form-control "
                                onChange={onInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mb-3 mb-xl-0">
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
                                className="form-control "
                                onChange={onInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-6 mb-3 mb-xl-0">
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
                                className="form-control "
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
                                className="form-control "
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
                                className="form-control "
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
                                className="form-control "
                                onChange={onInputChange}
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-6 mb-3 mb-xl-0">
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
                            className="col-xl-4 col-md-6 mb-3 mb-xl-0 d-none"
                            ref={citySelectBoxRef}
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
                                required
                              >
                                <option value=""></option>
                                {allCities ? (
                                  allCities.map((data) => {
                                    return (
                                      <option
                                        key={data.city_id}
                                        value={data.city_id}
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
                          <div className="col-xl-4 col-md-6 mb-3 mb-xl-0">
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
                                className="form-control"
                              ></input>
                            </div>
                          </div>
                        </div>
                        <div className="row text-end">
                          <div className="col-12">
                            <button type="submit" className="btn btn-primary">
                              Add
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

export default AddProperty;
