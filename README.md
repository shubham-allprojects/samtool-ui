mkcert -key-file sam-key.pem -cert-file sam-cert.pem "localhost"  
docker-compose -f docker-compose.dev.yml up

                <div
                  className={`login-alert alert alert-${alertClr} alert-dismissible show d-flex align-items-center ${
                    alertVisible ? "" : "d-none"
                  }`}
                  role="alert"
                >
                  <span>
                    <i
                      className={`bi bi-exclamation-triangle-fill me-2 ${
                        alertClr === "danger" || alertClr === "warning"
                          ? ""
                          : "d-none"
                      }`}
                    ></i>
                  </span>
                  <small className="fw-bold">{alertMsg}</small>
                  <i
                    onClick={() => setAlertDetails({ alertVisible: false })}
                    className="bi bi-x login-alert-close-btn close"
                  ></i>
                </div>



           {loading ? (
                          <>
                            <span
                              className="spinner-grow spinner-grow-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Verifying....
                          </>
                        ) : (
                          "Verify token"
                        )}

   <div className="container d-none" ref={paginationRef}>
            <div className="row">
              <div className="col-12 mb-3">
                <Pagination
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                />
              </div>
            </div>
          </div>

          await axios.post(apis.searchAPI, dataToPost).then((res) => {
      // Store Searched results into propertyData useState.
      setPropertyData(res.data);
      setTimeout(() => {
        setLoading(false);
        if (res.data) {
          paginationRef.current.classList.remove("d-none");
        } else {
          paginationRef.current.classList.add("d-none");
        }
      }, 100);
    });
