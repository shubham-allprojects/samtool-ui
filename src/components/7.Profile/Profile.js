import React, { useState, useEffect } from "react";
import Layout from "../1.CommonLayout/Layout";
import axios from "axios";
import { rootTitle } from "../../CommonFunctions";
import { NavLink } from "react-router-dom";

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
    rootTitle.textContent = "SAM TOOL - PROFILE";
    getUserProfileDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <section className="profile-wrapper section-padding min-100vh">
        <div className="container-fluid wrapper">
          <div className="row justify-content-center">
            <div className="col-xl-3">
              <div className="card">
                <img
                  src="profile.png"
                  alt="Profile Pic"
                  className="card-img-top"
                />
                <div className="card-body text-center">
                  <h3 className="card-title">
                    {user_type === "Individual User"
                      ? `${first_name} ${last_name}`
                      : `${company_name} - (${organization_type})`}
                  </h3>
                  <span className="text-muted">{`${user_type} ( ${
                    userRole === 1
                      ? "Admin"
                      : userRole === 2
                      ? "Editor"
                      : "Viewer"
                  } )`}</span>
                </div>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="card p-2">
                <div className="profile-icon-wrapper text-center">
                  <i className="bi bi-geo-alt-fill fs-1"></i>
                </div>
                <h3 className="text-center">Address Details</h3>
                <div className="card-body text-center">
                  <div className="row justify-content-center">
                    <div className="col-6">
                      <div className="card py-2">
                        <h5>Locality</h5>
                        <span>{locality}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card py-2">
                        <h5>State</h5>
                        <span>{state_name}</span>
                      </div>
                    </div>
                    <div className="col-6 mt-4">
                      <div className="card py-2">
                        <h5>City</h5>
                        <span>{city}</span>
                      </div>
                    </div>
                    <div className="col-6 mt-4">
                      <div className="card py-2">
                        <h5>Zip</h5>
                        <span>{zip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="profile-icon-wrapper text-center">
                <i className="bi bi-person-vcard fs-1"></i>
              </div>
              <div className="card">Personal details</div>
            </div>
            <div className="col-xl-3">
              <div className="card">Links</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
