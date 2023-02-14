import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { rootTitle } from "../../CommonFunctions";
import Layout from "../1.CommonLayout/Layout";

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email_address: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const { full_name, email_address, message } = formData;
  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "full_name") {
      setFormData({ ...formData, [name]: value });
    } else if (name === "email_address") {
      setFormData({ ...formData, [name]: value });
    } else if (name === "message") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      e.target.reset();
      toast.success("Message sent successfully");
      console.log(formData);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    rootTitle.textContent = "SAM TOOL - CONTACT";
  }, []);

  return (
    <Layout>
      <section className="contact-wrapper">
        <div className="contact-bg-img">
          <div className="container-fluid text-white">
            <div className="row contact-first-row">
              <p
                className="fw-bolder contact-title"
                style={{ marginBottom: "-11px" }}
              >
                CONTACT US
              </p>
              <small className="contact-subtitle">Home / Contact Us</small>
            </div>
          </div>
          <div className="contact-social-icons">
            <div className="contact-icon">
              <i className="bi bi-facebook"></i>
            </div>
            <div className="contact-icon ps-4">
              <i className="bi bi-linkedin"></i>
            </div>
          </div>
        </div>
        <div className="container contact-form-wrapper position-relative py-4 py-md-0">
          <div className="row">
            <div className="col-xl-12">
              <form
                onSubmit={onFormSubmit}
                className="card bg-white shadow contact-form py-5 px-3"
              >
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form-title mb-4">
                        <span>
                          <i className="bi bi-person-vcard"></i>
                        </span>
                        <span className="fw-bold fs-5 getintouch-text">
                          Get In Touch
                        </span>
                      </div>
                      <div className="form-group mb-3">
                        <input
                          onChange={onInputChange}
                          name="full_name"
                          type="text"
                          className="form-control"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          onChange={onInputChange}
                          type="email"
                          name="email_address"
                          className="form-control"
                          placeholder="Email Address"
                        />
                      </div>
                      <div className="form-group mb-4">
                        <textarea
                          onChange={onInputChange}
                          style={{ resize: "none" }}
                          name="message"
                          id=""
                          rows="5"
                          className="form-control"
                          placeholder="Message"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        style={{ borderRadius: "0" }}
                      >
                        {loading ? (
                          <>
                            <div
                              className="spinner-grow spinner-grow-sm text-light me-2"
                              role="status"
                            ></div>
                            Sending....
                          </>
                        ) : (
                          <>
                            Send Now <i className="bi bi-arrow-right ps-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="col-md-2 d-md-flex d-none justify-content-center">
                      <div className="vr bg-secondary"></div>
                    </div>
                    <div className="col-md-5 d-flex align-items-center mt-5 mt-md-0">
                      <div className="contact-details">
                        <p>
                          <i className="pe-3 bi bi-envelope-fill text-primary"></i>
                          example@mail.com
                        </p>
                        <p>
                          <i className="pe-3 bi bi-telephone-fill text-primary"></i>
                          464066935, 4567869394
                        </p>
                        <p>
                          <i className="pe-3 bi bi-geo-alt-fill text-primary"></i>
                          Example Address, Location
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
