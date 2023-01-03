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
  addressFilled,
  setAddressFilled,
}) => {
  // Getting only required validation details from RegisterMainPage.
  const {
    emailValidationMessage,
    mobileValidationMessage,
    zipCodeValidationMessage,
    zipCodeValidationColor,
  } = validationDetails;

  const { citiesByState, cityVisibilityClass } = cityUseState;

  // useState to store all states coming from api.
  const [states, setStates] = useState([]);
  // Function to get all states from api so that we can map states in select state field.
  const getAllSates = async () => {
    const allStates = await axios.get(`/sam/v1/property/by-state`);
    setStates(allStates.data);
  };

  useEffect(() => {
    getAllSates();
  }, []);

  return (
    <>
      {/* Address Row 1 */}
      <div className="row addressRow1 mt-lg-3 mt-4">
        <div className="col-lg-2 mb-lg-0 mb-2">Address</div>
        {/* <div className="col-lg-2 mb-lg-0 mb-2">
          <input
            onBlur={onInputBlur}
            name="address"
            type="text"
            className="form-control"
            placeholder="Block-House No Street"
            required
          />
        </div>
        <div className="col-lg-2 mb-lg-0 mb-2">
          <input
            onBlur={onInputBlur}
            name="locality"
            type="text"
            className="form-control"
            placeholder="Locality, Area"
            required
          />
        </div> */}
        <div className="col-lg-2 mb-lg-0 mb-2">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              readOnly
              checked={addressFilled}
            />
            <a
              style={{ cursor: "pointer" }}
              onClick={() => {
                setAddressFilled(false);
              }}
              class=""
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Launch demo modal
            </a>
          </div>
        </div>
      </div>
      {/* Address Row 2 */}
      {/* <div className="row addressRow2 mt-lg-3 mt-md-0">
        <div className="offset-lg-2 col-lg-2 mb-lg-0 mb-2">
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
        <div className={`col-lg-2 mb-lg-0 mb-2 ${cityVisibilityClass}`}>
          <select
            onChange={onInputChange}
            onBlur={onInputBlur}
            name="city"
            type="text"
            className="form-select"
            placeholder="city"
            required
          >
            <option id="selectedCity" value="" style={{ color: "gray" }}>
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

        <div className="col-lg-2">
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
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => {
                  setAddressFilled(true);
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonFormFields;
