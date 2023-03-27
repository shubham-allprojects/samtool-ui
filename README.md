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