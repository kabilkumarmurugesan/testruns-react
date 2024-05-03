import { Box, Drawer, Typography } from "@mui/material";
import React from "react";
import "../../assets/styles/App.scss";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import data from "../../assets/images/profile/user2.svg";
import {
  fetchNotificationMessageData,
  fetchReadBulkMessageData,
  fetchReadSingleMessageData,
} from "../../api/notificationMessageAPI";
import { fetchSingleUserData } from "../../api/userAPI";
import Emptystate from "../../assets/images/Emptystate.svg";
import moment from "moment";
import SpinerLoader from "../SpinnerLoader";

export default function AppNotificationDrawer({
  openDrawer,
  toggleNotificationDrawer,
}: any) {
  const [show, setShow] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [notificationQueryStrings, setNotificationQueryString] = React.useState(
    {
      userId: "",
    }
  );

  const [notificationMesssage, setNotificationMesssage] = React.useState<any>(
    []
  );

  const NotificationMessageSliceData = useSelector((state: any) => {
    return state.notificationMessage.data?.get_notification_message;
  });
  const dispatch: any = useDispatch();
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);
  const [userData, setUserData] = React.useState<any>({});

  React.useEffect(() => {
    let temp = { _id: loginUserSliceData?.verifyToken?._id };
    dispatch(fetchSingleUserData(temp))
      .then((isSucess: any) => {
        setUserData(isSucess?.get_user);
        setNotificationQueryString(isSucess?.get_user?._id);
      })

      .catch((err: any) => {
        console.error(err);
      });
  }, [loginUserSliceData]);

  React.useEffect(() => {
    if (openDrawer) {
      notificationMessageList();
    }
  }, [openDrawer]);
  const notificationMessageList = () => {
    let payload = {
      userId: loginUserSliceData?.verifyToken?._id,
    };
    setLoader(true);
    dispatch(fetchNotificationMessageData(payload))
      .then((res: any) => {
        setNotificationMesssage(res?.data?.get_notification_message);
        setLoader(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
  const getTimeDifference = (notificationTime: any) => {
    const currentTime: any = moment();
    const timestamp = parseInt(notificationTime);

    const notificationTimeData = moment(timestamp);

    const timeDifferenceInMilliseconds = currentTime.diff(notificationTimeData);

    const minutesDifference = moment
      .duration(timeDifferenceInMilliseconds)
      .asMinutes();
    const hoursDifference = moment
      .duration(timeDifferenceInMilliseconds)
      .asHours();

    if (minutesDifference >= 60 && hoursDifference < 24) {
      return `${Math.floor(hoursDifference)}h ago`;
    }
    if (hoursDifference > 24) {
      const daysDifference: number = Math.floor(hoursDifference / 24);
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    }
    if (Math.floor(minutesDifference) == 0) {
      return `Just now`;
    }
    return `${Math.floor(minutesDifference)}min ago`;
  };

  const handleReadBulkNotification = async () => {
    let payload = {
      userId: userData?._id,
      isRead: true,
    };
    let payload2 = {
      userId: userData?._id,
    };

    if (NotificationMessageSliceData?.message?.length !== 0) {
      await dispatch(fetchReadBulkMessageData(payload));
      await dispatch(fetchNotificationMessageData(payload2))
        .then((res: any) => {
          setNotificationMesssage(res?.data?.get_notification_message);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  const handleReadNotification = async (id: any) => {
    let payload2 = {
      _id: id,
      isRead: true,
    };
    await dispatch(fetchReadSingleMessageData(payload2));
    await notificationMessageList();
  };
  return (
    <>
      <Drawer
        className="profile-head"
        variant="temporary"
        anchor="right"
        open={openDrawer}
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 600,
            boxSizing: "border-box",
          },
          boxShadow: "-12px 4px 19px 0px #0000001A",
        }}
        onClose={() => {
          toggleNotificationDrawer(), setShow(!show);
        }}
        disableScrollLock={true}
      >
        <Box className="notification-header">
          <Box className="notification-title">
            <Typography>Notifications</Typography>
            <Typography className="mark-read">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleReadBulkNotification()}
              >
                Mark all as read
              </span>{" "}
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  marginLeft: "2rem",
                  cursor: "pointer",
                }}
              >
                <CloseOutlinedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    toggleNotificationDrawer(), setShow(!show);
                  }}
                />
              </span>
            </Typography>
          </Box>
          <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto" }}>
            {loader ? (
              <SpinerLoader isLoader={loader} />
            ) : notificationMesssage?.message?.length !== 0 ? (
              notificationMesssage?.message?.map((row: any, index: any) => (
                <Box
                  className="notifications"
                  key={index}
                  style={{
                    backgroundColor: row?.isRead == false ? "#F3F3F3" : "white", // Apply different background for the first notification
                  }}
                  onClick={() => handleReadNotification(row?._id)}
                >
                  <Box className="image-container">
                    <Avatar
                      alt="User Avatar"
                      src={data}
                      sx={{ width: 56, height: 56, borderRadius: "50%" }}
                    />
                    <Box className="text-container">
                      <Box className="heading">{row.title}</Box>
                      <Box className="content">{row.message}</Box>
                    </Box>
                  </Box>
                  <Box className="time">{getTimeDifference(row.createdAt)}</Box>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: "center", padding: "25%" }}>
                <img src={Emptystate} alt="" />
                <Typography className="no-remainder">
                  No notifications yet!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
