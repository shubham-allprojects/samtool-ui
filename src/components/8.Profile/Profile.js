import React, { useState, useEffect } from "react";
import Layout from "../1.CommonLayout/Layout";
import axios from "axios";

const Profile = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const [userRole, setUserRole] = useState("");
  // To store updated user details.
  const [commonUserDetails, setCommonUserDetails] = useState({});

  // Object destructuring.
  const { mobile_number, locality, user_type, city, state_name, zip, email } =
    commonUserDetails;

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
  const { first_name, last_name, pan_number, aadhar_number } =
    individualUserDetails;

  // Function will provide login token of user from localStorage and also some urls are stored in this function.
  const setHeaderAndUrl = () => {
    let headers = "";
    let role = "";
    if (data) {
      headers = { Authorization: data.logintoken };
      role = data.roleId;
    }
    let url = `/sam/v1/user-registration/auth`;
    return [headers, url, role];
  };

  // Function will get the data of user whose details are to be edited.
  const getUserProfileDetails = async () => {
    const [headers, url, role] = setHeaderAndUrl();
    if (data) {
      setUserRole(role);
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
    // eslint-disable-next-line
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
                      <span className="fw-bold fs-3 text-primary">
                        {user_type === "Individual User"
                          ? `${first_name} ${last_name}`
                          : `${company_name} - (${organization_type})`}
                      </span>
                      <br />
                      <span className="text-muted">{`${user_type} ( ${
                        userRole === 1
                          ? "Admin"
                          : userRole === 2
                          ? "Editor"
                          : "Viewer"
                      } )`}</span>
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
                    {user_type === "Individual User" ? (
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
                      className="progress-bar bg-primary"
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
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
