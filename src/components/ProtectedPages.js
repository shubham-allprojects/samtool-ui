import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedPages = ({ children }) => {
  const goTo = useNavigate();
  const ProtectAllPages = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      goTo("/access-denied");
    }
  };
  useEffect(() => {
    ProtectAllPages();
  });

  return children;
};

export default ProtectedPages;
