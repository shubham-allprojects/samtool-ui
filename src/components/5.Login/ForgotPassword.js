import React, { useState } from "react";
import Layout from "../1.CommonLayout/Layout";
import resetPassImg from "../../images/resetPass.svg";
import axios from "axios";

const ForgotPassword = () => {
  const [emailValue, setEmailValue] = useState("");
  const resetPassword = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `/sam/v1/customer-registration/email-validation`,
        JSON.stringify({ email: emailValue })
      )
      .then((res) => {
        if (res.data.status === 1) {
          alert("Email sent successfully");
          e.target.reset();
        } else {
          alert("User does not exists");
        }
      });
  };
  return (
    <Layout>
      <section className="forgot-password section-padding min-100vh">
        <div className="container wrapper">
          <div className="row justify-content-lg-between justify-content-center">
            <div className="col-xl-5">
              <img src={resetPassImg} alt="" className="set-pass-img" />
            </div>
            <div className="col-xl-5">
              <form
                onSubmit={resetPassword}
                className="card shadow justify-content-center p-5"
              >
                <h2 className="text-center fw-bold">Reset your password</h2>
                <hr />
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
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
                <button className="btn btn-primary">
                  Send password reset email
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
