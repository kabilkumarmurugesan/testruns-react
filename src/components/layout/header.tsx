import React from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Typography,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MoreVertOutlined } from "@mui/icons-material";
import help from "../../assets/images/help.svg";
import notification from "../../assets/images/notification.svg";
import account from "../../assets/images/account.svg";
import "../../assets/styles/App.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchNotificationMessageData } from "../../api/notificationMessageAPI";

const mobileMenuId = "primary-search-account-menu-mobile";

function AppHeader(props: any) {
  const dispatch: any = useDispatch();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [isAnyRead, setisAnyRead] = React.useState<boolean>(false);

  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const NotificationMessageSliceData = useSelector((state: any) => {
    return state.notificationMessage.data?.get_notification_message;
  });

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const openEditProfile = () => {
    props.toggleProfileDrawer();
  };

  const openNotificationList = () => {
    props.toggleNotificationDrawer();
  };

  React.useEffect(() => {
    let payload = {
      userId: loginUserSliceData?.verifyToken?._id,
    };

    dispatch(fetchNotificationMessageData(payload))
      .then((res: any) => {
        const notifications: any = NotificationMessageSliceData?.message;
        setisAnyRead(
          notifications?.some(
            (notification: any) => notification.isRead === false
          )
        );
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [NotificationMessageSliceData]);

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="help icon" color="inherit">
          <img src={help} alt="help_icon" className="app-bar-images" />
        </IconButton>
        <p>Help</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMobileMenuClose();
          openNotificationList();
        }}
      >
        <IconButton size="large" aria-label="notification icon" color="inherit">
          <Badge
            color="secondary"
            // variant={isAnyRead==true?"dot":"standard"}
            variant={isAnyRead ? "dot" : "standard"}
            // invisible={isAnyRead==true?false:true}
            className="red-badge"
          >
            <img
              src={notification}
              alt="notification_icon"
              className="app-bar-images"
            />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMobileMenuClose();
          openEditProfile();
        }}
      >
        <IconButton
          size="large"
          aria-label="account"
          aria-haspopup="true"
          color="inherit"
        >
          <img
            className="app-bar-images"
            src={
              loginUserSliceData?.verifyToken?.imageUrl !== "" &&
              loginUserSliceData?.verifyToken?.imageUrl !== null
                ? loginUserSliceData?.verifyToken?.imageUrl
                : account
            }
            alt="account_icon"
            style={{ width: "25px", height: "25px", borderRadius: "16px" }}
          />
        </IconButton>
        <Typography
          variant="inherit"
          className="app-bar-username"
          style={{ textTransform: "capitalize" }}
        >
          Hi {loginUserSliceData?.verifyToken?.firstName}
        </Typography>{" "}
      </MenuItem>
    </Menu>
  );
  return (
    <Box className="app-bar-block">
      <AppBar
        position="fixed"
        // open={true}
        className="app-bar"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              marginRight: 5,
            }}
            onClick={() => props.toggleDrawer()}
          >
            <MenuIcon className="app-bar-icons" />
          </IconButton>
          <Box>
            <Typography variant="h6" className="app-bar-title">
              Test <span className="app-bar-label">Runs</span>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            className="header-right-side"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <IconButton size="large" aria-label="help icon" color="inherit">
              <img src={help} alt="help_icon" className="app-bar-images" />
            </IconButton>
            <IconButton
              size="large"
              aria-label="notification icon"
              color="inherit"
              onClick={openNotificationList}
            >
              <Badge
                color="secondary"
                // variant={isAnyRead==true?"dot":"standard"}
                variant={isAnyRead ? "dot" : "standard"}
                // invisible={isAnyRead==true?false:true}
                className="red-badge"
              >
                <img
                  src={notification}
                  alt="help_icon"
                  className="app-bar-images"
                />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="account icon"
              color="inherit"
              onClick={openEditProfile}
            >
              <Typography
                variant="inherit"
                className="app-bar-username"
                style={{ textTransform: "capitalize" }}
              >
                Hi {loginUserSliceData?.verifyToken?.firstName}
              </Typography>
              <div>
                <img
                  style={{ cursor: "pointer", borderRadius: "13px" }}
                  src={
                    loginUserSliceData?.verifyToken?.imageUrl !== "" &&
                    loginUserSliceData?.verifyToken?.imageUrl !== null
                      ? loginUserSliceData?.verifyToken?.imageUrl
                      : account
                  }
                  className="app-bar-images"
                />
              </div>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreVertOutlined className="app-bar-icons" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}

export default React.memo(AppHeader);
