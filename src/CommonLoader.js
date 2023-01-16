import React from "react";

const CommonLoader = ({
  spinnerColor = "black",
  height = "3rem",
  width = "3rem",
}) => {
  return (
    <div className="text-center my-5">
      <div
        class={`spinner-border text-${spinnerColor}`}
        style={{ height: height, width: width }}
        role="status"
      ></div>
    </div>
  );
};

export default CommonLoader;
