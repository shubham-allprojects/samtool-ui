import React, { useState } from "react";
import Layout from "../1.CommonLayout/Layout";
import resetPassImg from "../../images/resetPass.svg";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [emailValue, setEmailValue] = useState("");
  const [alertDetails, setAlertDetails] = useState({
    alertVisible: false,
    alertMsg: "",
    alertClr: "",
  });

  const [displayOfSections, setDisplayOfSections] = useState({
    mainSectionDisplay: "",
    afterSubmitSectionDisplay: "d-none",
  });

  const { alertMsg, alertClr, alertVisible } = alertDetails;
  const { mainSectionDisplay, afterSubmitSectionDisplay } = displayOfSections;

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          `/sam/v1/customer-registration/email-validation`,
          JSON.stringify({ email: emailValue })
        )
        .then((res) => {
          if (res.data.status === 1) {
            e.target.reset();
            localStorage.setItem("forgotPassUserName", emailValue);
            setDisplayOfSections({
              mainSectionDisplay: "d-none",
              afterSubmitSectionDisplay: "",
            });
          } else {
            setAlertDetails({
              alertVisible: true,
              alertClr: "danger",
              alertMsg:
                "Email address is either invalid or not a verified email address",
            });
          }
        });
    } catch (error) {
      toast.error("Internal server error!");
    }
  };
  return (
    <Layout>
      <section className="forgot-password section-padding min-100vh">
        <ToastContainer autoClose={6000} />
        <div className="container wrapper">
          <div
            className={`row justify-content-lg-between justify-content-center ${mainSectionDisplay}`}
          >
            <div className="col-xl-5 col-lg-5 col-md-8 order-2 order-lg-1 mt-lg-0 mt-5">
              <img src={resetPassImg} alt="" className="set-pass-img" />
            </div>
            <div className="col-xl-5 col-lg-6 col-md-8 order-1 order-lg-2">
              <form
                onSubmit={resetPassword}
                className="card shadow justify-content-center p-4 p-md-5"
              >
                <h2 className="text-center fw-bold">Reset your password</h2>
                <hr />

                <div
                  className={`login-alert alert alert-${alertClr} alert-dismissible show ${
                    alertVisible ? "" : "d-none"
                  }`}
                  role="alert"
                >
                  <small className="fw-bold">{alertMsg}</small>

                  <i
                    onClick={() => setAlertDetails({ alertVisible: false })}
                    className="bi bi-x login-alert-close-btn close"
                  ></i>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label common-btn-font">
                    Enter your user account's verified email address and we will
                    send you a password reset link.
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    required
                    onChange={(e) => {
                      setEmailValue(e.target.value);
                    }}
                  />
                </div>
                <button className="btn btn-primary common-btn-font">
                  Send password reset email
                </button>
              </form>
            </div>
          </div>
          <div
            className={`row justify-content-center ${afterSubmitSectionDisplay}`}
          >
            <div className="col-xl-4 col-lg-5 col-md-6">
              <div className="card shadow p-4 bg-primary text-white">
                <span className="mb-3">
                  Check your email for a link to reset your password. If it
                  doesn't appear within a few minutes, check your spam folder.
                </span>
                <NavLink
                  to="/login"
                  className="btn btn-outline-light common-btn-font"
                >
                  Return to sign in
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
