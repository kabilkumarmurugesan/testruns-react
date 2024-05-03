import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
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

function AppRoute() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="runs" element={<Runs />} />
        </Routes>
      </Router>
    </>
  );
}

export default AppRoute;
