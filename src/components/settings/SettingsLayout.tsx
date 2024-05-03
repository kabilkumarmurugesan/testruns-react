import React from "react";
import PrivateRoute from "../../components/PrivateRoute";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Notification from "../../assets/images/notifi.svg";
import NotificationActive from "../../assets/images/notification active.svg";
import Profile from "../../assets/images/profile.svg";
import ProfileActive from "../../assets/images/profile-active.svg";
import User from "../../assets/images/multiuser.svg";
import UserActive from "../../assets/images/multiuser-active.svg";
import Role from "../../assets/images/role.svg";
import RoleActive from "../../assets/images/role-active.svg";
import "../../assets/styles/setting.scss";
import "../../assets/styles/App.scss";
import { useSelector } from "react-redux";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import procedures from "../../assets/images/procedures.svg";
import proceduresActive from "../../assets/images/procedures-active.svg";
import { useNavigate } from "react-router";

export const SettingsLayout = ({ children }: any, props: any) => {
  const navigate = useNavigate();
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const credencial = loginUserSliceData?.verifyToken?.role[0];

  const menuOption = [
    {
      id: 1,
      name: "Notification settings",
      icon: Notification,
      activeIcon: NotificationActive,
      path: "/settings/notifications",
      isActive: true,
    },
    {
      id: 2,
      name: "Profile settings",
      icon: Profile,
      activeIcon: ProfileActive,
      path: "/settings/profile",
      isActive: true,
    },
    {
      id: 3,
      name: "User management",
      icon: User,
      activeIcon: UserActive,
      path: "/settings/users",
      isActive: credencial?.user_management?.view,
    },
    {
      id: 4,
      name: "Role management",
      icon: Role,
      activeIcon: RoleActive,
      path: "/settings/roles",
      isActive: credencial?.role_management?.edit,
    },
    // {
    //   id: 5,
    //   name: "Custom fields",
    //   icon: procedures,
    //   activeIcon: proceduresActive,
    //   path: "/settings/custom-fields",
    // },
  ];

  const [selectedItem, setSelectedItem] = React.useState(menuOption[0].id);

  const redirectTo = (path: any) => {
    navigate(path);
  };

  const [show, setShow] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" && window.innerWidth < 900
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener(
        "resize",
        () => {
          const ismobile = window.innerWidth < 900;
          if (ismobile !== isMobile) setIsMobile(ismobile);
        },
        false
      );
    }
  }, [isMobile]);

  const selectPath = (item: any) => {
    if (typeof window !== "undefined") {
      return window.location.pathname.split("/")[2] == item.split("/")[2];
    } else {
      return;
    }
  };

  return (
    <PrivateRoute>
      <Box sx={{ background: "#fff", padding: "0px" }}>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              // flexGrow: 1,
              background: "#fff",
              boxShadow: "3px 4px 4px 0px rgba(0, 0, 0, 0.10)",
            }}
            className={`${
              show ? "side-show show-common" : "side-hide show-common"
            }`}
            style={{ width: "240px" }}
          >
            <Box className="setting-sidebar">
              <Box className="close-mobile" onClick={() => setShow(!show)}>
                <CloseIcon style={{ cursor: "pointer" }} />
              </Box>
              <Typography className="setting-title">Settings</Typography>
              <List style={{ padding: "0px" }}>
                {menuOption
                  .filter((element) => element.isActive)
                  .map((item, index) => (
                    <ListItem
                      disablePadding
                      key={index}
                      className={
                        selectPath(item.path)
                          ? "app-drawer-list-item-active"
                          : "app-drawer-list-item"
                      }
                      onClick={() => setSelectedItem(item.id)}
                    >
                      <ListItemButton onClick={() => redirectTo(item.path)}>
                        <ListItemIcon
                          style={{
                            justifyContent: "flex-start",
                            padding: "10px 0px",
                            minWidth: "35px",
                          }}
                        >
                          <img
                            src={
                              selectPath(item.path)
                                ? item.activeIcon
                                : item.icon
                            }
                            alt="no_image"
                            style={{ width: "23px", height: "23px" }}
                          />
                        </ListItemIcon>

                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Box>
          <Box
            className={`${show ? "side-hide-left show-right" : "show-right"}`}
            sx={{ flexGrow: 20 }}
          >
            <ArrowBackIosNewOutlinedIcon
              onClick={() => setShow(!show)}
              className="mobile-arrow"
              // onClick={() => setIsMobile(!isMobile)}
              style={{ cursor: "pointer" }}
            />
            {/* <Userpage></Userpage> */}
            {children}
          </Box>
        </Box>
      </Box>
    </PrivateRoute>
  );
};
