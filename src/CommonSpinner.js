import React from "react";

const CommonSpinner = ({
  spinnerColor = "black",
  height = "3rem",
  width = "3rem",
}) => {
  return (
    <div className="text-center my-5">
      <div
        className={`spinner-border text-${spinnerColor}`}
        style={{ height: height, width: width }}
        role="status"
      ></div>
    </div>
  );
};

export default CommonSpinner;
