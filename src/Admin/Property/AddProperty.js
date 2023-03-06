import React, { useState } from "react";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
// import BreadCrumb from "./BreadCrumb";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    min_value: null,
    max_value: null,
  });

  const [err, setErr] = useState({
    maxValueErr: false,
  });

  const { min_value, max_value } = formData;
  const { maxValueErr } = err;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "min_value") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === "max_value") {
      setFormData({ ...formData, [name]: parseInt(value) });
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
                    <h4 className="fw-bold">Add Property</h4>
                    <hr />
                    <form className="card">
                      <div className="card-body">
                        {/* Row 1 */}
                        <div className="row mb-3">
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
                                htmlFor="is_available_for_sale"
                              >
                                Available for sale?
                              </label>
                              <select
                                id="is_available_for_sale"
                                name="is_available_for_sale"
                                className="form-select"
                              >
                                <option value="Commercial">Yes</option>
                                <option value="Residential">No</option>
                              </select>
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
