import React, { useState } from "react";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
// import BreadCrumb from "./BreadCrumb";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    min_value: null,
    max_value: null,
    is_sold: 0,
    is_available_for_sale: 0,
  });

  const [err, setErr] = useState({
    maxValueErr: false,
  });

  const { min_value, max_value, is_sold, is_available_for_sale } = formData;
  const { maxValueErr } = err;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "min_value") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === "max_value") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === "is_sold") {
      if (value === "1") {
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
      if (value === "1") {
        setFormData({
          ...formData,
          [name]: parseInt(value),
        });
      } else {
        setFormData({
          ...formData,
          [name]: parseInt(value),
        });
      }
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (max_value > min_value) {
      setErr({ ...err, maxValueErr: false });
    } else {
      setErr({ ...err, maxValueErr: true });
    }
  };
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
                    <form className="card p-xl-2">
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
                          <div className="col-xl-4">
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
                                <option value="Commercial">Commercial</option>
                                <option value="Residential">Residential</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-xl-4">
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
                          <div className="col-xl-4">
                            <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="bank_branch_id"
                              >
                                Bank branch
                              </label>
                              <select
                                id="bank_branch_id"
                                name="bank_branch_id"
                                className="form-select"
                              >
                                <option value="0">wxyz branch</option>
                                <option value="1">wxxyz1 branch</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Row 2 */}
                        <div className="row mb-3">
                          <div className="col-12">
                            <h5 className="fw-bold text-primary">Area</h5>
                          </div>
                          <div className="col-xl-4">
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
                          <div className="col-xl-4">
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
                          <div className="col-xl-4">
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
                          <div className="col-xl-4">
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
                          <div className="col-xl-4">
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
                        <div className="row">
                          <div className="col-12">
                            <h5 className="fw-bold text-primary">
                              Dates & Availability
                            </h5>
                          </div>
                          <div className="col-xl-4 mb-xl-3">
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
                          <div className="col-xl-4 mb-xl-3">
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
                          <div className="col-xl-4 mb-xl-3">
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
                          <div className="col-xl-4">
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
                            className={`col-xl-4 ${
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
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                              </select>
                            </div>
                          </div>
                          <div
                            className={`col-xl-4 ${
                              is_available_for_sale === 1 ? "" : "d-none"
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
