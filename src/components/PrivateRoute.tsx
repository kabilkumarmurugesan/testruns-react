import { useState } from "react";
import { darkTheme, lightTheme } from "../utils/theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import AppHeader from "./layout/header";
import AppMenu from "./layout/menu";
import AppProfileDrawer from "./layout/profile-drawer";
import AppNotificationDrawer from "./layout/notification-drawer";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const PrivateRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const [width, setWidth] = useState(95);
  const [classn, setClassn] = useState<any>("closemenu");
  const [editProfile, setEditProfile] = useState(false);
  const [notificationList, setNotificationList] = useState(false);
  const [theme, setTheme] = useState(lightTheme);
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("isLoggedIn");
    if (!storedData) {
      navigate("/login");
      return null;
    }
  }

  const toggleDrawer = () => {
    setWidth(width === 290 ? 95 : 290);
    setClassn(width === 290 ? "closemenu" : "openmenu");
  };

  const toggleProfileDrawer = () => {
    setNotificationList(false);
    setEditProfile(!editProfile);
  };

  const toggleNotificationDrawer = () => {
    setEditProfile(false);
    setNotificationList(!notificationList);
  };

  const toggleTheme = () => {
    setTheme((prevTheme: any) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppHeader
          toggleDrawer={toggleDrawer}
          toggleProfileDrawer={toggleProfileDrawer}
          toggleNotificationDrawer={toggleNotificationDrawer}
          toggleTheme={toggleTheme}
        />
        <AppMenu width={width} classn={classn} />

        <AppProfileDrawer
          openDrawer={editProfile}
          toggleProfileDrawer={toggleProfileDrawer}
        />
        <AppNotificationDrawer
          openDrawer={notificationList}
          toggleNotificationDrawer={toggleNotificationDrawer}
        />

        <Box
          component="main"
          sx={{
            width: "100%",
            position: "relative",
            top: "80px",
          }}
          className={`${width === 290 ? "wide-class" : "narrow-class"}`}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PrivateRoute;
