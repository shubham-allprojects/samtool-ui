import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Only loggedIn user will have access to the components wrapped in this component.
const Protected = ({ children }) => {
  const goTo = useNavigate();
  const checkStatusOfLogin = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (!data) {
      goTo("/access-denied");
    }
  };
  useEffect(() => {
    checkStatusOfLogin();
  });

  return children;
};

export default Protected;
