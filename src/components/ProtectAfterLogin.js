import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectAfterLogin = ({ children }) => {
  const goTo = useNavigate();
  const checkStatusOfLogin = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      goTo("/");
    }
  };
  useEffect(() => {
    checkStatusOfLogin();
  });

  return children;
};

export default ProtectAfterLogin;
