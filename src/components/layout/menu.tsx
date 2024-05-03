import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import mypage from "../../assets/images/mypage.svg";
import runs from "../../assets/images/runs.svg";
import procedures from "../../assets/images/procedures.svg";
import projects from "../../assets/images/projects.svg";
import assets from "../../assets/images/assets.svg";
import settings from "../../assets/images/settings.svg";
import mypageActive from "../../assets/images/mypage-active.svg";
import runsActive from "../../assets/images/runs-active.svg";
import proceduresActive from "../../assets/images/procedures-active.svg";
import projectsActive from "../../assets/images/projects-active.svg";
import assetsActive from "../../assets/images/assets-active.svg";
import settingsActive from "../../assets/images/settings-active.svg";
import "../../assets/styles/css/App.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function AppMenu(props: any) {
  const navigate = useNavigate();

  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const credencial = loginUserSliceData?.verifyToken?.role[0];

  const menuOption = [
    {
      id: 1,
      name: "My page",
      icon: mypage,
      activeIcon: mypageActive,
      path: "/mypage",
      isActive: credencial === undefined ? false : true,
    },
    {
      id: 2,
      name: "Runs",
      icon: runs,
      activeIcon: runsActive,
      path: "/runs",
      isActive: credencial?.runs_management?.view,
    },
    {
      id: 3,
      name: "Procedures",
      icon: procedures,
      activeIcon: proceduresActive,
      path: "/procedures",
      isActive: credencial?.procedure_management?.view,
    },
    {
      id: 4,
      name: "Adopt gpt",
      icon: projects,
      activeIcon: projectsActive,
      path: "/projects",
      isActive: false,
    },
    {
      id: 5,
      name: "Assets",
      icon: assets,
      activeIcon: assetsActive,
      path: "/assets",
      isActive: credencial?.asset_management?.view,
    },
    {
      id: 6,
      name: "Settings",
      icon: settings,
      activeIcon: settingsActive,
      path: "/settings/notifications",
      isActive: credencial === undefined ? false : true,
    },
    // {
    //   id: 7,
    //   name: "Billing and subscriptions",
    //   icon: billing,
    //   activeIcon: billingActive,
    //   path: "/billings",
    // },
  ];

  // const [selectedItem, setSelectedItem] = React.useState<any>(menuOption[0].id);
  const redirectTo = (item: any) => {
    // setSelectedItem(item.id);
    navigate(item.path);
  };
  const selectPath = (item: any) => {
    if (typeof window !== "undefined") {
      return window.location.pathname.split("/")[1] === item.split("/")[1];
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: props.width,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: props.width,
            boxSizing: "border-box",
          },
          boxShadow: "3px 4px 4px 0px rgba(0, 0, 0, 0.10)",
        }}
        className={`${props.classn} app-drawer`}
      >
        <Box>
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
                >
                  <ListItemButton onClick={() => redirectTo(item)}>
                    <ListItemIcon
                      style={{ justifyContent: "center", padding: "10px" }}
                    >
                      <img
                        src={
                          selectPath(item.path) ? item.activeIcon : item.icon
                        }
                        alt="no_image"
                        style={{ width: "23px", height: "23px" }}
                      />
                    </ListItemIcon>

                    {props.width === 290 && (
                      <ListItemText primary={item.name} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
