import React, { useEffect } from "react";
import { rootTitle } from "../../CommonFunctions";
import Layout from "../1.CommonLayout/Layout";
import aboutUs from "../../images/about-us.svg";
import whyUs from "../../images/whyUs.svg";
import { NavLink } from "react-router-dom";

const AboutUs = () => {
  useEffect(() => {
    rootTitle.textContent = "SAM TOOL - ABOUT";
  }, []);

  return (
    <Layout>
      <section className="section-padding about-wrapper min-100vh">
        <div className="container-fluid">
          {/* Who we are */}
          <div className="row px-xl-5 px-lg-4 px-md-3 px-2 wrapper">
            <div className="col-md-6 d-flex align-items-center">
              <div>
                <h1 className="fw-bold custom-text-secondary">ABOUT US</h1>
                <span className="common-btn-font">
                  Finding the right property requires a lot of time and effort.
                  Won`t it be convenient if all the properties that fit your
                  needs were literally served to you on a platter? Well, explore
                  more properties here that will match your expectations
                  perfectly.
                </span>
                <br />
                <NavLink to="/contact" className="mt-3 btn btn-outline-primary">
                  Get in touch
                </NavLink>
              </div>
            </div>
            <div className="col-md-6 mt-5 mt-md-0">
              <div>
                <img src={aboutUs} alt="about-us" className="img-fluid" />
              </div>
            </div>
          </div>
          {/* Why choose us */}
          <div className="row px-xl-5 px-lg-4 px-md-3 px-2 wrapper">
            <div className="col-md-6 mt-5 mt-md-0">
              <div>
                <img src={whyUs} alt="why-us" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <h1 className="custom-text-secondary fw-bold">
                  WHY CHOOSE US ?
                </h1>
              </div>
              <div className="row">
                <div className="col-1">
                  <i className="bi bi-caret-right-fill"></i>
                </div>
                <div className="col-xl-11 p-0">
                  We have a strong track record of succesful project
                </div>
              </div>
              <div className="row">
                <div className="col-1">
                  <i className="bi bi-caret-right-fill"></i>
                </div>
                <div className="col-xl-11 p-0">
                  We have a dedicated team with the expertise and skills
                </div>
              </div>
              <div className="row">
                <div className="col-1">
                  <i className="bi bi-caret-right-fill"></i>
                </div>
                <div className="col-xl-11 p-0">
                  We negotiate the best deals for our clients
                </div>
              </div>
              <div className="row">
                <div className="col-1">
                  <i className="bi bi-caret-right-fill"></i>
                </div>
                <div className="col-xl-11 p-0">
                  We have a solid network of resources in the industry
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
