import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// Receiving validationDetails, onInputChange, onInputBlur as a props from organization/individual main form.
const CommonFormFields = ({
  validationDetails,
  onInputChange,
  onInputBlur,
  resetValues,
  cityUseState,
}) => {
  // Getting only required validation details from RegisterMainPage.
  const {
    emailValidationMessage,
    mobileValidationMessage,
    zipCodeValidationMessage,
    zipCodeValidationColor,
  } = validationDetails;

  const [addressDetails, setAddressDetails] = useState({});

  const {
    flat_number,
    building_name,
    society_name,
    plot_number,
    locality,
    landmark,
    village,
  } = addressDetails;

  const [addressValues, setAddressValues] = useState({
    addressValue: "",
    labelValue: "Add Details",
    textAreaVisibility: "d-none",
  });

  const { addressValue, labelValue, textAreaVisibility } = addressValues;
  const { citiesByState, cityVisibilityClass } = cityUseState;

  // useState to store all states coming from api.
  const [states, setStates] = useState([]);
  // Function to get all states from api so that we can map states in select state field.
  const getAllSates = async () => {
    const allStates = await axios.get(`/sam/v1/property/by-state`);
    setStates(allStates.data);
  };

  const onAddressFormSubmit = (e) => {
    e.preventDefault();
    let valuesArray = [
      flat_number ? `Flat No: ${flat_number}` : "",
      building_name ? `Building Name: ${building_name}` : "",
      society_name ? `Society Name: ${society_name}` : "",
      plot_number ? `Plot No: ${plot_number}` : "",
      locality ? `Locality: ${locality}` : "",
      landmark ? `Landmark: ${landmark}` : "",
      village ? `Village: ${village}` : "",
    ];

    let mainArray = [];
    for (let i of valuesArray) {
      if (i !== "") {
        mainArray.push(i);
      }
    }
    setAddressValues({
      addressValue: mainArray.join(", "),
      labelValue: "Edit Details",
      textAreaVisibility: "",
    });
  };

  const setValues = (name, value) => {
    setAddressDetails({ ...addressDetails, [name]: value });
  };

  const onAddressInputsChange = (e) => {
    const { name, value } = e.target;
    if (name === "flat_number") {
      setValues(name, value);
    } else if (name === "building_name") {
      setValues(name, value);
    } else if (name === "society_name") {
      setValues(name, value);
    } else if (name === "plot_number") {
      setValues(name, value);
    } else if (name === "locality") {
      setValues(name, value);
    } else if (name === "landmark") {
      setValues(name, value);
    } else if (name === "village") {
      setValues(name, value);
    }
  };

  useEffect(() => {
    getAllSates();
  }, []);

  return (
    <>
      {/* Address Row 1 */}
      <div className="row addressRow1 mt-lg-3 mt-4">
        <div className="col-lg-2 mb-lg-0 mb-2">Address</div>
        <div className="col-lg-6 mb-lg-0 mb-2">
          <label
            style={{ cursor: "pointer" }}
            className="text-primary text-decoration-underline form-label"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            {labelValue}
          </label>
          <textarea
            style={{ resize: "none" }}
            value={addressValue}
            readOnly
            className="form-control"
            cols="30"
            rows="4"
          ></textarea>
        </div>
      </div>

      {/* Email */}
      <div className="row emailRow mt-lg-3 mt-4">
        <div className="col-lg-2 mb-lg-0 mb-2">
          Email Address<span className="text-danger">*</span>
        </div>
        <div className="col-lg-2">
          <input
            onChange={onInputChange}
            onBlur={onInputBlur}
            name="email"
            type="email"
            className="form-control"
            placeholder="XXX@YYY.com"
            required
          />
          <span
            className={`pe-1 ${
              emailValidationMessage ? "text-danger" : "d-none"
            }`}
          >
            {emailValidationMessage}
          </span>
        </div>
      </div>
      {/* Contact */}
      <div className="row contactRow mt-lg-3 mt-4">
        <div className="col-lg-2 mb-lg-0 mb-2">
          Contact Number
          {/* <span className="text-danger">*</span> */}
        </div>
        <div className="col-lg-2 mb-lg-0 mb-2">
          <input
            onBlur={onInputBlur}
            name="landline_number"
            type="Number"
            placeholder="Landline Number (Optional)"
            className="form-control "
          />
        </div>
        <div className="col-lg-2 mb-lg-0 mb-2">
          <input
            onChange={onInputChange}
            onBlur={onInputBlur}
            name="mobile_number"
            type="Number"
            placeholder="Mobile Number"
            required
            className="form-control"
          />
          <span
            className={`pe-1 ${
              mobileValidationMessage ? "text-danger" : "d-none"
            }`}
          >
            {mobileValidationMessage}
          </span>

          <span className="form-text d-none"></span>
        </div>
      </div>
      {/* SAM T & C */}
      <div className="row SamTermsConditionsRow mt-3">
        <div className="offset-lg-2 col-lg-4">
          <NavLink to="/">SAM Terms and Conditions</NavLink>
        </div>
      </div>
      {/* Agree T & C */}
      <div className="row agreeTermsConditionsRow mt-3">
        <div className="col-lg-4">
          <input
            type="checkbox"
            className="form-check-input"
            id="agreeTermsConditions"
            required
          />
          <label
            className="form-check-label ms-3"
            htmlFor="agreeTermsConditions"
          >
            I Agree to the Terms and Conditions
          </label>
        </div>
      </div>
      {/* Form submit or Cancel */}
      <div className="row submitCancelRow mt-4 mb-4 mb-md-0">
        <div className="offset-lg-2 col-lg-2 col-md-4 col-6">
          <button className="btn btn-primary text-white">
            <i className="me-1 bi bi-check-lg"></i>
            Submit
          </button>
        </div>
        <div className="col-lg-2 col-md-4 col-6">
          <button
            className="btn btn-secondary text-dark"
            onClick={(e) => {
              e.preventDefault();
              e.target.closest("form").reset();
              resetValues();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Address
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <input
                      id="flat_number"
                      name="flat_number"
                      type="number"
                      className="form-control "
                      onChange={onAddressInputsChange}
                      placeholder="Flat Number"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <input
                      id="building_name"
                      name="building_name"
                      type="text"
                      className="form-control "
                      onChange={onAddressInputsChange}
                      placeholder="Building Name"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <input
                      id="society_name"
                      name="society_name"
                      type="text"
                      className="form-control "
                      onChange={onAddressInputsChange}
                      placeholder="Society Name"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <input
                      id="plot_number"
                      name="plot_number"
                      type="number"
                      className="form-control "
                      onChange={onAddressInputsChange}
                      placeholder="Plot Number"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <input
                    // onBlur={onInputBlur}
                    id="locality"
                    name="locality"
                    type="text"
                    className="form-control "
                    onChange={onAddressInputsChange}
                    placeholder="Locality, Area"
                  />
                </div>

                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <input
                      id="landmark"
                      name="landmark"
                      type="text"
                      className="form-control "
                      onChange={onAddressInputsChange}
                      placeholder="Landmark"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <input
                      id="village"
                      name="village"
                      type="text"
                      className="form-control "
                      onChange={onAddressInputsChange}
                      placeholder="Village"
                    />
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <div className="form-group mb-3">
                    <select
                      onChange={onInputChange}
                      onBlur={onInputBlur}
                      name="state"
                      type="text"
                      className="form-select"
                      placeholder="State"
                      required
                    >
                      <option value="" style={{ color: "gray" }}>
                        State
                      </option>
                      {states
                        ? states.map((state, Index) => {
                            return (
                              <option
                                id={`state-name-${state.state_id}`}
                                key={Index}
                                value={state.state_id}
                              >
                                {state.state_name}
                              </option>
                            );
                          })
                        : ""}
                    </select>
                  </div>
                </div>
                <div className={`col-md-4 ${cityVisibilityClass}`}>
                  <div className="form-group mb-3">
                    <select
                      onChange={onInputChange}
                      onBlur={onInputBlur}
                      name="city"
                      type="text"
                      className="form-select"
                      placeholder="city"
                      required
                    >
                      <option
                        id="selectedCity"
                        value=""
                        style={{ color: "gray" }}
                      >
                        City
                      </option>
                      {citiesByState
                        ? citiesByState.map((city, Index) => {
                            return (
                              <option key={Index} value={city.city_name}>
                                {city.city_name}
                              </option>
                            );
                          })
                        : ""}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      onChange={onInputChange}
                      onBlur={onInputBlur}
                      placeholder="Zipcode"
                      name="zip"
                      className={`form-control border-${zipCodeValidationColor}`}
                      required
                    ></input>
                    <span
                      className={`pe-1 ${
                        zipCodeValidationMessage ? "text-danger" : "d-none"
                      }`}
                    >
                      {zipCodeValidationMessage}
                    </span>
                  </div>
                </div> */}
                <div className="modal-footer">
                  <button
                    onClick={onAddressFormSubmit}
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonFormFields;
