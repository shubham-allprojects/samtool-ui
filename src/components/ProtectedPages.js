import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedPages = ({ children }) => {
  const goTo = useNavigate();
  const ProtectAllPages = async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      try {
        let res = await axios.get(`/sam/v1/user-registration/logout`, {
          headers: { Authorization: data.logintoken },
        });
        if (res.data === "Session expired or invalid user") {
          localStorage.removeItem("data");
          localStorage.removeItem("remainingTime")
          localStorage.setItem("userSession", "invalid");
          goTo("/login");
        } else {
          goTo("/access-denied");
        }
      } catch (error) {}
    }
  };
  useEffect(() => {
    ProtectAllPages();
  });

  return children;
};

export default ProtectedPages;
