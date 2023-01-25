import React, { useState, useEffect } from "react";
import Layout from "../1.CommonLayout/Layout";
import axios from "axios";

const Profile = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const [userType, setUserType] = useState("");
  // To store updated user details.
  const [commonUserDetails, setCommonUserDetails] = useState({});

  // Object destructuring.
  const {
    user_type,
    mobile_number,
    locality,
    address,
    city,
    state_name,
    zip,
    email,
  } = commonUserDetails;

  const [orgUserDetails, setOrgUserDetails] = useState({});

  // Object destructuring.
  const {
    cin_number,
    company_name,
    gst_number,
    organization_type,
    tan_number,
  } = orgUserDetails;

  const [individualUserDetails, setIndividualUserDetails] = useState({});

  // Object destructuring.
  const { first_name, middle_name, last_name, pan_number, aadhar_number } =
    individualUserDetails;

  // Function will provide login token of user from localStorage and also some urls are stored in this function.
  const setHeaderAndUrl = () => {
    let headers = "";
    if (data) {
      headers = { Authorization: data.logintoken };
    }
    let url = `/sam/v1/user-registration/auth`;
    return [headers, url];
  };

  // Function will get the data of user whose details are to be edited.
  const getUserProfileDetails = async () => {
    const [headers, url] = setHeaderAndUrl();
    if (data) {
      const userId = data.userId;
      await axios
        .get(`${url}/${userId}`, { headers: headers })
        .then(async (res) => {
          const { individual_user, org_user, user_details } = res.data;
          if (individual_user) {
            const {
              first_name,
              middle_name,
              last_name,
              pan_number,
              aadhar_number,
            } = individual_user;
            setIndividualUserDetails({
              first_name: first_name,
              middle_name: middle_name,
              last_name: last_name,
              pan_number: pan_number,
              aadhar_number: aadhar_number,
            });
          } else if (org_user) {
            const {
              cin_number,
              company_name,
              gst_number,
              organization_type,
              tan_number,
            } = org_user;
            setOrgUserDetails({
              cin_number: cin_number,
              company_name: company_name,
              gst_number: gst_number,
              organization_type: organization_type,
              tan_number: tan_number,
            });
          }
          const {
            user_type,
            mobile_number,
            locality,
            city,
            state_name,
            state_id,
            zip,
            email_address,
            address,
          } = user_details;
          setUserType(user_type);
          setCommonUserDetails({
            state_id: parseInt(state_id),
            address: address,
            mobile_number: mobile_number,
            locality: locality,
            city: city,
            state_name: state_name,
            zip: zip,
            email: email_address,
            user_type: user_type,
          });
        });
    }
  };

  useEffect(() => {
    getUserProfileDetails();
  }, []);

  return (
    <Layout>
      <section className="profile-wrapper section-padding min-100vh">
        <div className="container-fluid wrapper">
          <div className="row justify-content-center">
            <div className="col-11">
              <div className="row border p-4 shadow">
                {/* Profile image */}
                <div className="col-md-3 text-center text-md-start">
                  <img
                    src="profile.png"
                    alt="Profile Pic"
                    className="img-fluid"
                  />
                </div>
                <div className="col-xl-9 col-md-9">
                  {/* Name & designation */}
                  <div className="row">
                    <div className="col-xl-12 text-center text-md-start">
                      <span className="fw-bold fs-3 text-warning">
                        {userType === "Individual User"
                          ? `${first_name} ${last_name}`
                          : `${company_name} - (${organization_type})`}
                      </span>
                      <br />
                      <span className="text-muted">{userType}</span>
                    </div>
                  </div>
                  {/* Other details */}
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <p className="text-muted fw-bold">Address</p>
                      <span className="text-muted">Locality:</span> {locality}
                      <br />
                      <span className="text-muted">City:</span> {city}
                      <br />
                      <span className="text-muted">State:</span> {state_name}
                      <br />
                      <span className="text-muted">Zip:</span> {zip}
                    </div>
                    {userType === "Individual User" ? (
                      <>
                        <div className="offset-md-1 col-md-3 mt-4 mt-md-0">
                          <div>
                            <p className="text-muted fw-bold">Mobile</p>
                            <p>{mobile_number}</p>
                          </div>
                          <div className="mt-4 mt-md-5">
                            <p className="text-muted fw-bold">PAN</p>
                            <p>{pan_number}</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mt-4 mt-md-0">
                            <p className="text-muted fw-bold">AADHAAR</p>
                            <p>{aadhar_number}</p>
                          </div>
                          <div className="mt-4 mt-md-5">
                            <p className="text-muted fw-bold">EMAIL</p>
                            <p>{email}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="offset-md-1 col-md-3 mt-4 mt-md-0">
                          <div>
                            <p className="text-muted fw-bold">CIN</p>
                            <p>{cin_number}</p>
                          </div>
                          <div className="mt-4 mt-md-5">
                            <p className="text-muted fw-bold">TAN</p>
                            <p>{tan_number}</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mt-4 mt-md-0">
                            <p className="text-muted fw-bold">GST</p>
                            <p>{gst_number}</p>
                          </div>
                          <div className="mt-4 mt-md-5">
                            <p className="text-muted fw-bold">EMAIL</p>
                            <p>{email}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-6 mt-4 mt-md-0">
                  <p className="text-muted">
                    some text Lorem ipsum dolor sit amet.
                  </p>

                  <div className="progress mt-4">
                    <div
                      className="progress-bar bg-warning"
                      title="25%"
                      role="progressbar"
                      style={{ width: "75%" }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                    >
                      75%
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-5 justify-content-between">
                <div className="col-xl-4 col-md-6 border border-2 shadow profile-details-div">
                  <div className="p-3">
                    <div className="row justify-content-center">
                      <div className="col-1">
                        <i className="bi bi-mortarboard-fill"></i>
                      </div>
                      <div className="col-11">
                        <small className="text-muted">Some details</small>
                        <br />
                        <small className="text-muted">Heading1: </small>
                        <small>Description1</small>
                        <br />
                        <small className="text-muted">Heading2: </small>
                        <small>Description2</small>
                        <br />
                        <small className="text-muted">Heading3: </small>
                        <small>Description3</small>
                        <br />
                        <small className="text-muted">Heading4: </small>
                        <small>Description4</small>
                        <br />
                      </div>
                      <div className="col-12">
                        <hr />
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-1">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <div className="col-11">
                        <small className="text-muted">
                          Personal Information
                        </small>
                        <br />
                        <small className="text-muted">Birth Date: </small>
                        <small>March 17, 1989</small>
                        <br />
                        <small className="text-muted">Gender: </small>
                        <small>Male</small>
                        <br />
                        <small className="text-muted">Nationality: </small>
                        <small>Indian</small>
                        <br />
                        <small className="text-muted">Marital Status: </small>
                        <small>Married</small>
                        <br />
                        <small className="text-muted">DL Number: </small>
                        <small>HS0952363723</small>
                        <br />
                        <small className="text-muted">User Id: </small>
                        <small>ABCD28998</small>w
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 mt-4 mt-md-0 border border-2 shadow profile-details-div">
                  <div className="p-3">
                    <div className="row justify-content-center">
                      <div className="col-1">
                        <i className="bi bi-person-workspace"></i>
                      </div>
                      <div className="col-11">
                        <small className="">Other details</small>
                      </div>
                      <div className="col-1">
                        <i className="bi bi-circle-fill"></i>
                      </div>
                      <div className="col-11">
                        <small className="text-muted">Some details</small>
                        <br />
                        <small className="text-muted">detail 1 example</small>
                        <br />
                        <small className="text-muted">
                          detail 2 example Lorem ipsum dolor sit.
                        </small>
                      </div>
                      <div className="col-12">
                        <hr />
                      </div>
                      <div className="col-1">
                        <i className="bi bi-circle-fill"></i>
                      </div>
                      <div className="col-11">
                        <small className="text-muted">Some details</small>
                        <br />
                        <small className="text-muted">detail 1 example</small>
                        <br />
                        <small className="text-muted">
                          detail 2 example Lorem ipsum dolor sit.
                        </small>
                      </div>
                      <div className="col-12">
                        <hr />
                      </div>
                      <div className="col-1">
                        <i className="bi bi-circle-fill"></i>
                      </div>
                      <div className="col-11">
                        <small className="text-muted">Some details</small>
                        <br />
                        <small className="text-muted">detail 1 example</small>
                        <br />
                        <small className="text-muted">
                          detail 2 example Lorem ipsum dolor sit.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6  mt-4 mt-xl-0 border border-2 shadow profile-details-div ">
                  <div className="p-3">
                    <span className="fw-bolder">Some Heading</span>
                    <br />
                    <div className="row justify-content-center">
                      <div className="col-5 mt-3">
                        <div className="progress circled-div">
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: "89%" }}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            +89%
                          </div>
                        </div>
                      </div>
                      <div className="col-12 my-3">
                        <span className="text-muted">
                          Lorem ipsum dolor sit:
                        </span>
                        <span>5</span>
                      </div>
                      <div className="col-6">
                        <span className="badge w-100 rounded-pill bg-warning text-dark">
                          text1
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="badge w-100 rounded-pill bg-outline-warning text-dark">
                          text2
                        </span>
                      </div>
                      <div className="col-6 mt-2">
                        <span className="badge w-100 rounded-pill bg-warning text-dark">
                          text3
                        </span>
                      </div>
                      <div className="col-6 mt-2">
                        <span className="badge w-100 rounded-pill bg-outline-warning text-dark">
                          text4
                        </span>
                      </div>
                      <div className="col-6 mt-2">
                        <span className="badge w-100 rounded-pill bg-warning text-dark">
                          text5
                        </span>
                      </div>
                      <div className="col-6 mt-2">
                        <span className="badge w-100 rounded-pill bg-outline-warning text-dark">
                          text6
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 mt-4 border border-2 shadow profile-details-div ">
                  <div className="p-3">
                    <span className="fw-bolder">Other Heading</span>
                    <br />
                    <div className="row justify-content-center">
                      <div className="col-5 mt-3">
                        <div className="progress circled-div">
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: "79%" }}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            +79%
                          </div>
                        </div>
                      </div>
                      <div className="col-12 my-3">
                        <span className="text-muted">Specials:</span>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn fourth-div-btn btn-warning btn-sm position-relative"
                        >
                          Text 1
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                            79+
                          </span>
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn fourth-div-btn btn-outline-warning btn-sm position-relative"
                        >
                          Text 2
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                            79+
                          </span>
                        </button>
                      </div>
                      <div className="col-6 mt-3">
                        <button
                          type="button"
                          className="btn fourth-div-btn btn-warning btn-sm position-relative"
                        >
                          Text 3
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                            79+
                          </span>
                        </button>
                      </div>
                      <div className="col-6 mt-3">
                        <button
                          type="button"
                          className="btn fourth-div-btn btn-outline-warning btn-sm position-relative"
                        >
                          Text 4
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                            79+
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
