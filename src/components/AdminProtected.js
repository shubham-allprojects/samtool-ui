import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Only loggedIn user will have access to the components wrapped in this component.
const AdminProtected = ({ children }) => {
  const goTo = useNavigate();
  const checkIsAdmin = async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      if (data.roleId !== 1) {
        goTo("/access-denied");
      } else {
        try {
          let res = await axios.get(`/sam/v1/user-registration/logout`, {
            headers: { Authorization: data.logintoken },
          });
          if (res.data !== "Valid user") {
            localStorage.removeItem("data");
            localStorage.setItem("userSession", "invalid");
            goTo("/login");
          }
        } catch (error) {}
      }
    } else {
      goTo("/access-denied");
    }
  };
  useEffect(() => {
    checkIsAdmin();
  });

  return children;
};

export default AdminProtected;
