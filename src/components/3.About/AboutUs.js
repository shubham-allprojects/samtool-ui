import React, { useEffect } from "react";
import { rootTitle } from "../../CommonFunctions";
import Layout from "../1.CommonLayout/Layout";

const AboutUs = () => {
  useEffect(() => {
    rootTitle.textContent = "SAM TOOL - ABOUT";
  }, []);

  return (
    <Layout>
      <section className="section-padding about-wrapper min-100vh">
        <div className="container-fluid">
          <div className="row wrapper">
            <div className="text-center">
              <h1>About Us Content</h1>
              <h5 className="text-muted">Coming soon.....</h5>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
