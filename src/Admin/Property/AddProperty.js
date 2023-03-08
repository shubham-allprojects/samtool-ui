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
    min_value: null,
    max_value: null,
    is_sold: 0,
    is_available_for_sale: 0,
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

  const onInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "min_value") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === "max_value") {
      setFormData({ ...formData, [name]: parseInt(value) });
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
                        {/* Row 1 */}
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
                              >
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
                        {/* Row 2 */}
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
                              />
                            </div>
                          </div>
                        </div>

                        {/* Row 3 */}
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
                              />
                            </div>
                          </div>
                        </div>

                        {/* Row 4 */}
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
                                onChange={onInputChange}
                                id="is_sold"
                                name="is_sold"
                                className="form-select"
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
                                onChange={onInputChange}
                                id="is_available_for_sale"
                                name="is_available_for_sale"
                                className="form-select"
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
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div className="row">
                          <button type="submit" className="btn btn-primary">
                            Add
                          </button>
                        </div> */}
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
