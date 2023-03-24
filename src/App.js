import { Routes, Route } from "react-router-dom";
import Home from "./components/2.HomePage/Home";
import ViewPropertyDetails from "./components/2.HomePage/ViewPropertyDetails";
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
import ViewAllProperties from "./Admin/Property/ViewAllProperties";
import ViewProperty from "./Admin/Property/ViewProperty";
import UploadProperties from "./Admin/Property/UploadProperties";
import ViewAllUsers from "./Admin/User/ViewAllUsers";
import ViewCurrentUser from "./Admin/User/ViewCurrentUser";
import ChangePassword from "./components/5.Login/ChangePassword";
import AboutUs from "./components/3.About/AboutUs";
import AddProperty from "./Admin/Property/AddProperty";
import ForgotPassword from "./components/5.Login/ForgotPassword";
import AdminProtected from "./components/AdminProtected";
import AccessDeniedPage from "./components/AccessDeniedPage";
import ForgotAndResetPassword from "./components/8.ForgotAndResetPassword/ForgotAndResetPassword";
import SinglePropertyDocumentsUpload from "./Admin/Property/SinglePropertyDocumentsUpload";
import ProtectedPages from "./components/ProtectedPages";

function App() {
  return (
    <>
      {/* <ToastContainer autoClose="1800" /> */}
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/property" element={<ViewPropertyDetails />} />
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
              // <ProtectedPages>
                <SetPassword />
              // </ProtectedPages>
            }
          />
          <Route
            path="/forgot-password/reset-password"
            element={<ForgotAndResetPassword />}
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
                <ViewAllProperties />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/property/add-property"
            element={
              // <AdminProtected>
              <AddProperty />
              // </AdminProtected>
            }
          />

          <Route
            path="/admin/property/properties/single-property-documents-upload/:id"
            element={
              // <AdminProtected>
              <SinglePropertyDocumentsUpload />
              // </AdminProtected>
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
          <Route
            path="/admin/users/*"
            element={
              <AdminProtected>
                <ViewAllUsers />
              </AdminProtected>
            }
          />

          <Route
            path="/admin/users/view-user/:id"
            element={
              <AdminProtected>
                <ViewCurrentUser />
              </AdminProtected>
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
