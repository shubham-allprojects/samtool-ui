import { Routes, Route } from "react-router-dom";
import Home from "./components/2.HomePage/Home";
import LoginMainPage from "./components/5.Login/LoginMainPage";
import SetPassword from "./components/6.Registration/SetPassword";
import Registration from "./components/6.Registration/RegistrationMainPage";
import ScrollToTop from "./components/ScrollToTop";
import VerifyToken from "./components/6.Registration/VerifyToken";
import Profile from "./components/7.Profile/Profile";
import ProtectedForLoggedInUser from "./components/ProtectedForLoggedInUser";
import EditUserDetails from "./components/7.Profile/EditUserDetails";
import ScrollButton from "./components/ScrollButton";
import Contact from "./components/4.Contact/Contact";
import PageNotFound from "./components/PageNotFound";
import AdminHomePage from "./Admin/AdminHomePage";
import ViewEditDeleteProperties from "./Admin/Property/ViewEditDeleteProperties";
import ViewProperty from "./Admin/Property/ViewProperty";
import UploadProperties from "./Admin/Property/UploadProperties";
import ChangePassword from "./components/5.Login/ChangePassword";
import AboutUs from "./components/3.About/AboutUs";
import AddProperty from "./Admin/Property/AddProperty";
import ForgotPassword from "./components/5.Login/ForgotPassword";
import AdminProtected from "./components/AdminProtected";
import AccessDeniedPage from "./components/AccessDeniedPage";
import ForgotAndResetPassword from "./components/8.ForgotAndResetPassword/ForgotAndResetPassword";
import SinglePropertyDocumentsUpload from "./Admin/Property/SinglePropertyDocumentsUpload";
import ProtectedPages from "./components/ProtectedPages";
import ProtectSetPasswordPage from "./components/ProtectSetPasswordPage";
import ProtectForgotPasswordPage from "./components/ProtectForgotPasswordPage";
import { ToastContainer, toast } from "react-toastify";
import ManageUsers from "./Admin/User/ManageUsers";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const MINUTE_MS = 65000;

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = JSON.parse(localStorage.getItem("data"));
      console.log("api start");
      if (data) {
        try {
          let res = await axios.get(`/sam/v1/user-registration/logout`, {
            headers: { Authorization: data.logintoken },
          });

          if (res.data !== "Session expired or Invalid user") {
            let remainingTime = parseInt(res.data.split(" ")[4]);
            console.log(remainingTime);
            if (remainingTime === 5) {
              toast.warn("Your session will expire in 5 minute");
            }
          }
        } catch (error) {
          console.log("error");
        }
      }
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);
  return (
    <>
      <ToastContainer autoClose="3000" />
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/register/*"
            element={
              <ProtectedPages>
                <Registration />
              </ProtectedPages>
            }
          />
          <Route
            path="/register/verify"
            element={
              <ProtectedPages>
                <VerifyToken />
              </ProtectedPages>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedPages>
                <LoginMainPage />
              </ProtectedPages>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedForLoggedInUser>
                <ChangePassword />
              </ProtectedForLoggedInUser>
            }
          />
          <Route
            path="/register/set-password"
            element={
              <ProtectSetPasswordPage>
                <SetPassword />
              </ProtectSetPasswordPage>
            }
          />
          <Route
            path="/forgot-password/reset-password"
            element={
              <ProtectForgotPasswordPage>
                <ForgotAndResetPassword />
              </ProtectForgotPasswordPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedForLoggedInUser>
                <Profile />
              </ProtectedForLoggedInUser>
            }
          />
          <Route
            path="/edit-details"
            element={
              <ProtectedForLoggedInUser>
                <EditUserDetails />
              </ProtectedForLoggedInUser>
            }
          />
          <Route path="/forgot-password/*" element={<ForgotPassword />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminProtected>
                <AdminHomePage />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/property/properties/*"
            element={
              <AdminProtected>
                <ViewEditDeleteProperties />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/property/add-property"
            element={
              <AdminProtected>
                <AddProperty />
              </AdminProtected>
            }
          />

          <Route
            path="/admin/users/individual-users"
            element={
              <AdminProtected>
                <ManageUsers
                  key={"Individual User"}
                  userType="Individual User"
                />
              </AdminProtected>
            }
          />

          <Route
            path="/admin/users/organizational-users"
            element={
              <AdminProtected>
                <ManageUsers
                  key={"Organizational User"}
                  userType="Organizational User"
                />
              </AdminProtected>
            }
          />

          <Route
            path="/admin/property/single-property-documents-upload"
            element={
              <AdminProtected>
                <SinglePropertyDocumentsUpload />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/property/properties/view-property/:id"
            element={
              <AdminProtected>
                <ViewProperty />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/property/upload-properties"
            element={
              // <AdminProtected>
              <UploadProperties />
              // </AdminProtected>
            }
          />

          <Route path="*" element={<PageNotFound />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
        </Routes>
      </ScrollToTop>
      <ScrollButton />
    </>
  );
}

export default App;
