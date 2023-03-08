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
      address: "Wakad",
      locality: "Urban",
      flat_number: 303,
      building_name: "Pune",
      society_name: "ABCchouk",
      plot_number: 1001,
      landmark: "Pune",
      city: "Pune",
      zip: 456652,
      state: "Maharashtra",
    },
  });

  const { is_sold } = formData;

  const [propertyCategories, setPropertyCategories] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankBranches, setBankBranches] = useState([]);
  const branchSelectBoxRef = useRef();

  const getDataFromApi = async () => {
    const propertyCategoryRes = await axios.get(`/sam/v1/property/by-category`);
    setPropertyCategories(propertyCategoryRes.data);
    const bankRes = await axios.get(`/sam/v1/property/by-bank`);
    setBanks(bankRes.data);
  };

  const commonFnToSaveFormData = (name, value) => {
    setFormData({ ...formData, [name]: value });
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
      commonFnToSaveFormData(name, value);
    } else if (name === "saleable_area") {
    } else if (name === "carpet_area") {
    } else if (name === "market_price") {
    } else if (name === "ready_reckoner_price") {
    } else if (name === "expected_price") {
    } else if (name === "completion_date") {
    } else if (name === "purchase_date") {
    } else if (name === "mortgage_date") {
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
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <button type="submit" className="btn btn-primary">
                            Add
                          </button>
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
