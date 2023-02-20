import React, { useEffect } from "react";
import { rootTitle } from "../../CommonFunctions";
import Layout from "../1.CommonLayout/Layout";
import aboutUs from "../../images/about-us.svg";

const AboutUs = () => {
  useEffect(() => {
    rootTitle.textContent = "SAM TOOL - ABOUT";
  }, []);

  return (
    <Layout>
      <section className="section-padding about-wrapper min-100vh">
        <div className="container-fluid wrapper">
          <div className="row px-xl-5 px-lg-4 px-md-3">
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
              </div>
            </div>
            <div className="col-md-6 mt-5 mt-md-0">
              <div>
                <img src={aboutUs} alt="about-us" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
