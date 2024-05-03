import React from 'react';
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import search from '../../../assets/images/search.svg';
import { withSettingsLayout } from '../../../components/settings';
import {
  fetchUpdateNotification,
  fetchUserNotificationData,
} from '../../../api/notification.API';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import SpinerLoader from '../../../components/SpinnerLoader';

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 43,
  height: 20,
  borderRadius: 99,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#FFC60B',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    borderRadius: 99,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#181818' : '#9f9f9f ',
    boxSizing: 'border-box',
  },
}));

const Notification = () => {
  const dispatch: any = useDispatch();
  const initialValues: any = [
    {
      createProcedure: [{ email: false, notification: false }],
      runAssiged: [{ email: false, notification: false }],
      runsCommend: [{ email: false, notification: false }],
    },
  ];
  const [isLoader, setIsLoader] = React.useState(true);

  const [notificationList, setNotificationList] =
    React.useState<any>(initialValues);

  const userSliceData = useSelector(
    (state: any) => state.userLogin?.data?.verifyToken,
  );

  React.useEffect(() => {
    fetchMessageApi();
  }, []);

  const fetchMessageApi = () => {
    let payload = {
      userId: userSliceData?._id,
    };
    dispatch(fetchUserNotificationData(payload))
      .then((res: any) => {
        setIsLoader(false);
        setNotificationList(res?.get_notification);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleChange = async (category: any, subCategory: any, val: any) => {
    if (!notificationList || !notificationList[0]) {
      return;
    }
    const updatedValues = JSON.parse(JSON.stringify(notificationList));

    // Toggle between true and false for email and notification
    updatedValues[0][category][0][subCategory] = val;

    setNotificationList(updatedValues);

    const createProcedureVal = updatedValues[0]?.createProcedure || [];
    const runsCommendVal = updatedValues[0]?.runsCommend || [];
    const runAssigedVal = updatedValues[0]?.runAssiged || [];

    const updatedData = createProcedureVal.map((item: any) => {
      const newItem = { ...item };
      if ('__typename' in newItem) {
        delete newItem.__typename;
      }
      return newItem;
    });
    const updatedData1 = runsCommendVal.map((item: any) => {
      const newItem = { ...item };
      if ('__typename' in newItem) {
        delete newItem.__typename;
      }
      return newItem;
    });
    const updatedData2 = runAssigedVal.map((item: any) => {
      const newItem = { ...item };
      if ('__typename' in newItem) {
        delete newItem.__typename;
      }
      return newItem;
    });

    let payload = {
      _id: notificationList !== undefined && notificationList[0]?._id,
      createProcedure: updatedData,
      runsCommend: updatedData1,
      runAssiged: updatedData2,
    };
    await dispatch(fetchUpdateNotification(payload));
    // await fetchMessageApi()
  };

  return (
    <>
      {!isLoader ? (
        <Box
          className="notification-page"
          style={{ padding: '24px', paddingTop: '15px' }}
        >
          <Box
            className="title-main"
            sx={{ borderBottom: '1px solid #F3F3F3', paddingBottom: '8px' }}
          >
            <Box>
              <Typography>Notification settings</Typography>
              <Typography className="sub-text">
                Select the kinds of notifications you get about your activities
                and recommendations.
              </Typography>
            </Box>
          </Box>
          <Box className="alerts-text">
            <Typography>Alerts</Typography>
            <Typography className="sub-text">
              Select the options you want to get alerted via email and
              notification.
            </Typography>
          </Box>
          <Box style={{marginTop:'10px'}}>
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                m: 0,
                borderBottom: '2px solid #F3F3F3',
                padding:'12px 0px 12px 12px'
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                className="p-top"
              >
                <Box className="notific-inner">
                  <Typography>New procedure created</Typography>
                  <Typography className="sub-text">
                    You will receive notifications whenever a new procedure is
                    created.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={4}
                xl={4}
                sx={{ pr: 2 }}
                className="p-top notification-email"
              >
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                    style={{ marginBottom: '0.8rem' }}
                  >
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#767676',
                      }}
                    >
                      Notification
                    </Typography>
                    <AntSwitch
                      checked={
                        notificationList !== undefined &&
                        notificationList[0]?.createProcedure[0]?.notification
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleChange(
                          'createProcedure',
                          'notification',
                          !notificationList[0]?.createProcedure[0]
                            ?.notification,
                        )
                      }
                      inputProps={{ 'aria-label': 'ant design' }}
                      name="notification"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#767676',
                      }}
                    >
                      Email
                    </Typography>
                    <AntSwitch
                      checked={
                        notificationList !== undefined &&
                        notificationList[0]?.createProcedure[0]?.email
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleChange(
                          'createProcedure',
                          'email',
                          !notificationList[0]?.createProcedure[0]?.email,
                        )
                      }
                      inputProps={{ 'aria-label': 'ant design' }}
                      name="email"
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                m: 0,
                borderBottom: '2px solid #F3F3F3',
                padding:'12px 0px 12px 12px'
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                className="p-top"
              >
                <Box className="notific-inner">
                  <Typography>Task submitted</Typography>
                  <Typography className="sub-text">
                    You will receive notifications whenever an assigned task is
                    submitted.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={4}
                xl={4}
                sx={{ pr: 2 }}
                className="p-top notification-email"
              >
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                    style={{ marginBottom: '0.8rem' }}
                  >
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#767676',
                      }}
                    >
                      Notification
                    </Typography>
                    <AntSwitch
                      checked={
                        notificationList !== undefined &&
                        notificationList[0]?.runAssiged[0]?.notification
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleChange(
                          'runAssiged',
                          'notification',
                          !notificationList[0]?.runAssiged[0]?.notification,
                        )
                      }
                      inputProps={{ 'aria-label': 'ant design' }}
                      name="notification"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#767676',
                      }}
                    >
                      Email
                    </Typography>
                    <AntSwitch
                      checked={
                        notificationList !== undefined &&
                        notificationList[0]?.runAssiged[0]?.email
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleChange(
                          'runAssiged',
                          'email',
                          !notificationList[0]?.runAssiged[0]?.email,
                        )
                      }
                      inputProps={{ 'aria-label': 'ant design' }}
                      name="email"
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                m: 0,
                borderBottom: '2px solid #F3F3F3',
                padding:'12px 0px 12px 12px'
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                className="p-top"
              >
                <Box className="notific-inner">
                  <Typography>Messages</Typography>
                  <Typography className="sub-text">
                    You will receive notifications whenever a new message or
                    comment is received on runs.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={4}
                xl={4}
                sx={{ pr: 2 }}
                className="p-top notification-email"
              >
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                    style={{ marginBottom: '0.8rem' }}
                  >
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#767676',
                      }}
                    >
                      Notification
                    </Typography>
                    <AntSwitch
                      checked={
                        notificationList !== undefined &&
                        notificationList[0]?.runsCommend[0]?.notification
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleChange(
                          'runsCommend',
                          'notification',
                          !notificationList[0]?.runsCommend[0]?.notification,
                        )
                      }
                      inputProps={{ 'aria-label': 'ant design' }}
                      name="notification"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#767676',
                      }}
                    >
                      Email
                    </Typography>
                    <AntSwitch
                      checked={
                        notificationList !== undefined &&
                        notificationList[0]?.runsCommend[0]?.email
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleChange(
                          'runsCommend',
                          'email',
                          !notificationList[0]?.runsCommend[0]?.email,
                        )
                      }
                      inputProps={{ 'aria-label': 'ant design' }}
                      name="email"
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : (
        <SpinerLoader isLoader={isLoader} />
      )}
    </>
  );
};

const NotificationPage = withSettingsLayout(Notification);

export default NotificationPage;
