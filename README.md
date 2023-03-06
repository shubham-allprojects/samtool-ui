mkcert -key-file sam-key.pem -cert-file sam-cert.pem "localhost"  
docker-compose -f docker-compose.dev.yml up

     <div className="form-group">
                              <label
                                className="form-label common-btn-font"
                                htmlFor="is_available_for_sale"
                              >
                                Available for sale?
                              </label>
                              <select
                                id="is_available_for_sale"
                                name="is_available_for_sale"
                                className="form-select"
                              >
                                <option value="Commercial">Yes</option>
                                <option value="Residential">No</option>
                              </select>
                            </div>

   <div className="row">
                        <div className="col-xl-8">
                          <div className="form-group mb-3">
                            <div className="row">
                              <div className="col-12">
                                <label className="form-label fw-bold">
                                  Range:
                                </label>
                              </div>
                              <div className="col-md-6">
                                Min:
                                <input
                                  onChange={onInputChange}
                                  name="min_value"
                                  className="form-control"
                                  type="number"
                                  required
                                />
                              </div>

                              <div className="col-md-6">
                                Max:
                                <input
                                  onChange={onInputChange}
                                  name="max_value"
                                  className={`form-control ${
                                    maxValueErr ? "border-danger" : ""
                                  }`}
                                  type="number"
                                  required
                                />
                                <span
                                  className={`text-danger ${
                                    maxValueErr ? "" : "d-none"
                                  }`}
                                >
                                  Maximum value must be greater than minimum
                                  value
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
