import React from "react";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import BreadCrumb from "./BreadCrumb";

const AddProperty = () => {
  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9 mt-4 mt-md-0">
            {/* <BreadCrumb /> */}
            <section className="add-property-wrapper wrapper">
              <div className="container-fluid">
                <div className="row justify-content-center">
                  <div className="col-md-10">
                    <form action="" className="card shadow p-4">
                      <h2 className="fw-bold">Add Property</h2>
                      <hr />
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="category"
                            >
                              Category:
                            </label>
                            <input
                              name="category"
                              id="category"
                              className="form-control"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="city_name"
                            >
                              City:
                            </label>
                            <input
                              name="city_name"
                              id="city_name"
                              className="form-control"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="market_value"
                            >
                              Market Value:
                            </label>
                            <input
                              name="market_value"
                              id="market_value"
                              className="form-control"
                              type="number"
                            />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="form-group mb-3">
                            <div className="row">
                              <div className="col-12">
                                <label className="form-label fw-bold">
                                  Range:
                                </label>
                              </div>
                              <div className="col-md-5">
                                Min:
                                <input className="form-control" type="number" />
                              </div>

                              <div className="col-md-5">
                                Max:
                                <input className="form-control" type="number" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="col-12 text-end">
                            <button type="button" className="btn btn-primary">Add</button>
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
