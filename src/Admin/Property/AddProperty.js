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
                  <h3 className="fw-bold">Add Property</h3>
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
