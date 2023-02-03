import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/2.HomePage/Home";
import ViewPropertyDetails from "./components/2.HomePage/ViewPropertyDetails";
import LoginMainPage from "./components/6.Login/LoginMainPage";
import SetPassword from "./components/7.Registration/SetPassword";
import Registration from "./components/7.Registration/RegistrationMainPage";
import ScrollToTop from "./components/ScrollToTop";
import VerifyToken from "./components/7.Registration/VerifyToken";
import Profile from "./components/8.Profile/Profile";
import Protected from "../src/components/Protected";
import { ToastContainer } from "react-toastify";
import EditUserDetails from "./components/8.Profile/EditUserDetails";
import ProtectAfterLogin from "../src/components/ProtectAfterLogin";
import ScrollButton from "./components/ScrollButton";
import Contact from "./components/4.Contact/Contact";
import PageNotFound from "./components/PageNotFound";
import AdminHomePage from "./Admin/AdminHomePage";
import ViewAllProperties from "./Admin/ViewAllProperties";
import ViewEditProperty from "./Admin/ViewEditProperty";
import UploadProperties from "./Admin/UploadProperties";
import ViewAllUsers from "./Admin/ViewAllUsers";
import ViewCurrentUser from "./Admin/ViewCurrentUser";
import ResetPassword from "./components/6.Login/ResetPassword";
import AboutUs from "./components/3.About/AboutUs";
import AddProperty from "./Admin/AddProperty";

function App() {
  return (
    <>
      <ToastContainer autoClose="2000" />
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/property" element={<ViewPropertyDetails />} />
          <Route
            path="/register/*"
            element={
              <ProtectAfterLogin>
                <Registration />
              </ProtectAfterLogin>
            }
          />
          <Route
            path="/register/verify"
            element={
              <ProtectAfterLogin>
                <VerifyToken />
              </ProtectAfterLogin>
            }
          />
          <Route
            path="/login/*"
            element={
              <ProtectAfterLogin>
                <LoginMainPage />
              </ProtectAfterLogin>
            }
          />
          <Route
            path="/reset-password"
            element={
              // <Protected>
              <ResetPassword />
              // </Protected>
            }
          />
          <Route
            path="/register/set-password"
            element={
              // <ProtectAfterLogin>
              <SetPassword />
              // </ProtectAfterLogin>
            }
          />
          <Route
            path="/profile/*"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/profile/edit-details"
            element={
              <Protected>
                <EditUserDetails />
              </Protected>
            }
          />

          {/* Admin */}
          <Route path="/admin" element={<AdminHomePage />} />
          <Route
            path="/admin/property/properties/*"
            element={<ViewAllProperties />}
          />
          <Route
            path="/admin/property/add-property"
            element={<AddProperty />}
          />
          <Route
            path="/admin/property/properties/edit-property/:id"
            element={<ViewEditProperty />}
          />
          <Route
            path="/admin/property/upload-properties"
            element={<UploadProperties />}
          />
          <Route path="/admin/users/*" element={<ViewAllUsers />} />

          <Route
            path="/admin/users/view-user/:id"
            element={<ViewCurrentUser />}
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ScrollToTop>
      <ScrollButton />
    </>
  );
}

export default App;
