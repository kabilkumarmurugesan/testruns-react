import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const storedData = localStorage.getItem("isLoggedIn");

  return !storedData ? (
    <Navigate to="/" replace state={{ from: location }} />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
