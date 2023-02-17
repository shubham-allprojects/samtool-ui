import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Only loggedIn user will have access to the components wrapped in this component.
const AdminProtected = ({ children }) => {
  const goTo = useNavigate();
  const checkIsAdmin = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      if (data.roleId !== 1) {
        goTo("/");
      }
    } else {
      goTo("/");
    }
  };
  useEffect(() => {
    checkIsAdmin();
  });

  return children;
};

export default AdminProtected;
