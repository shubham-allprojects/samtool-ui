import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Only loggedIn user will have access to the components wrapped in this component.
const ProtectedForLoggedInUser = ({ children }) => {
  const goTo = useNavigate();
  const checkStatusOfLogin = async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (!data) {
      goTo("/access-denied");
    } else {
      try {
        let res = await axios.get(`/sam/v1/user-registration/logout`, {
          headers: { Authorization: data.logintoken },
        });
        if (res.data === "Session expired or Invalid user") {
          localStorage.removeItem("data");
          localStorage.setItem("userSession", "invalid");
          goTo("/login");
        }
      } catch (error) {}
    }
  };
  useEffect(() => {
    checkStatusOfLogin();
  });

  return children;
};

export default ProtectedForLoggedInUser;
