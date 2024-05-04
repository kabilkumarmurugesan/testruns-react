import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import OTP from "../pages/otp";
import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/create-password";
import MyPage from "../pages/mypage";
import Runs from "../pages/runs";
import RunsDetails from "../pages/runs/details";
import Procedures from "../pages/procedures";
import Projects from "../pages/projects";
import Assets from "../pages/assets";
import AssetDetails from "../pages/assets/details/details";
import ProcedureDetails from "../pages/procedures/details";
import NotificationPage from "../pages/settings/notifications";
import ProfilePage from "../pages/settings/profile";
import UsersPage from "../pages/settings/users";
import RolesPage from "../pages/settings/roles";
import Billings from "../pages/billings";
import ProtectedRoute from "./ProtectedRoute";
import PrivateRoute from "../components/PrivateRoute";

function AppRoute() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/create-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/procedures" element={<Procedures />} />
            <Route path="/runs/details/:id" element={<RunsDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/details/:id" element={<AssetDetails />} />
            <Route
              path="/procedures/details/:id"
              element={<ProcedureDetails />}
            />
            <Route
              path="/settings/notifications"
              element={<NotificationPage />}
            />
            <Route path="/settings/profile" element={<ProfilePage />} />
            <Route path="/settings/users" element={<UsersPage />} />
            <Route path="/settings/roles" element={<RolesPage />} />
            <Route path="/billings" element={<Billings />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default AppRoute;
