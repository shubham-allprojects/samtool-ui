import React from "react";
import Footers from "./Footer";
import Header from "./Header";

const Layout = ({ children, backToSearchResults, disableHomeLink }) => {
  return (
    <>
      <Header
        backToSearchResults={backToSearchResults}
        disableHomeLink={disableHomeLink}
      />
      {children}
      <Footers />
    </>
  );
};

export default Layout;
