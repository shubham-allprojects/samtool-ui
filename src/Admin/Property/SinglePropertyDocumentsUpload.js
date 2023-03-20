import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";

const SinglePropertyDocumentsUpload = () => {
  const { id } = useParams();
  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 mt-4 mt-md-0">
            <BreadCrumb />
            <section className="upload-documents-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <h4 className="fw-bold text-primary p-0">
                    Property Id: {id}
                  </h4>
                  <hr />
                </div>
                <div className="row border p-4">
                  <h5 className="mb-3">Upload Property Images</h5>
                  <div className="col-4">
                    <input type="file" multiple className="form-control" />
                  </div>
                  <div className="col-6">
                    <button className="btn btn-primary">Upload</button>
                  </div>
                </div>
                {/* <div className="row border p-4 mt-4">
                  <h5 className="mb-3">Upload Property Documents</h5>
                  <div className="col-4">
                    <input type="file" className="form-control" />
                  </div>
                  <div className="col-6">
                    <button className="btn btn-primary">Upload</button>
                  </div>
                </div> */}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePropertyDocumentsUpload;
