import React from "react";
import PrivateRoute from "../../components/PrivateRoute";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  Chip,
  Select,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import Calendar from "react-calendar";
import {
  fetchNotificationMessageData,
  fetchReadSingleMessageData,
} from "../../api/notificationMessageAPI";
import { fetchCalendarEventData } from "../../api/myPageAPI";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import data from '../../assets/images/profile/user2.svg'
import TablePagination from "../../components/table/TablePagination";
import { MypageRowData } from "../../modals/mypage.modal";
import TablePopup from "../../components/table/TablePopup";
import moment from "moment";
import TableSkeleton from "../../components/table/TableSkeleton";
import { fetchRunsData } from "../../api/RunsAPI";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router";

const rows: MypageRowData[] = [];

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function MyPage() {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [viewAllNotifications, setViewAllNotifications] = useState(false);
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const [queryStrings, setQueryString] = React.useState({
    page: 1,
    perPage: 10,
    searchBy: null,
    search: null,
    sortBy: null,
    sortOrder: "desc",
  });

  const [notificationMesssage, setNotificationMesssage] = React.useState([]);
   const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("MM/DD/YYYY")
  );
  const [value, onChange] = useState<any>(
    moment(new Date()).format("MM/DD/YYYY")
  );
  const [viewAll, setViewAll] = useState(false);
  const [viewAlls, setViewAlls] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(5);
  const [CalendarContent, setCalendarContent] = useState([]);
  const [calendarEventData, setCalendarEventData] = useState([]);
  const [CalendarMark, setCalendarMark] = useState<any>([]);
  const [runzData, setRunzData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState();
  const [currentYear, setCurrentYear] = useState();
  const [loader, setLoader] = React.useState(false);
  const [loader1, setLoader1] = React.useState(false);

  const tablePopupRef: any = React.useRef(null);

  const NotificationMessageSliceData = useSelector((state: any) => {
    return state.notificationMessage.data?.get_notification_message;
  });

  const calendar_eventData = useSelector(
    (state: any) => state.calendar_event.data
  );

  React.useEffect(() => {
    let pay = {
      month: `${new Date().getMonth() + 1}`,
      year: `${new Date().getFullYear()}`,
      assignedTo: loginUserSliceData?.verifyToken?._id,
    };

    dispatch(fetchCalendarEventData(pay));
  }, [loginUserSliceData]);

  const [pageInfo, setPageInfo] = React.useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const handlePageChange = (even: any, page_no: number) => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    payload["page"] = page_no;
    page["currentPage"] = page_no;
    setPageInfo(page);
    setQueryString(payload);
    setCurrentPage(page_no);
  };

  const notificationMessageList = () => {
    let payload = {
      userId: loginUserSliceData?.verifyToken?._id,
    };

    dispatch(fetchNotificationMessageData(payload))
      .then((res: any) => {
        setNotificationMesssage(res?.data?.get_notification_message);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    getAllAsset();
  }, [queryStrings]);

  const getAllAsset = () => {
    const payload: any = {
      page: queryStrings.page,
      perPage: queryStrings.perPage,
      searchBy: queryStrings.searchBy,
      search: queryStrings.search,
      sortBy: queryStrings.sortBy,
      sortOrder: queryStrings.sortOrder,
    };
    setLoader(true);

    //requester 65741c069d53d19df8321e6e
    if (loginUserSliceData?.verifyToken?.role[0]?.name == "Requester") {
      // setQueryString({...queryStrings,["assignedTo"]:loginUserSliceData?.verifyToken?._id,["assignedBy"]:loginUserSliceData?.verifyToken?._id})
      payload["assignedTo"] = loginUserSliceData?.verifyToken?._id;
      payload["assignedBy"] = loginUserSliceData?.verifyToken?._id;
      payload["userId"] = loginUserSliceData?.verifyToken?._id;
    }
    //tester 65741c069d53d19df8321e6c
    if (loginUserSliceData?.verifyToken?.role[0]?.name == "Tester") {
      payload["userId"] = loginUserSliceData?.verifyToken?._id;
      // setQueryString({...queryStrings,["userId"]:loginUserSliceData?.verifyToken?._id})
    }
    if (loginUserSliceData?.verifyToken?.role[0]?.name == "Admin") {
      payload["organisationId"] =
        loginUserSliceData?.verifyToken.organisationId;
    }

    dispatch(fetchRunsData(payload))
      .then((res: any) => {
        const page: any = { ...pageInfo };
        page["currentPage"] = res?.get_all_runs?.pageInfo.currentPage;
        page["totalPages"] = res?.get_all_runs?.pageInfo.totalPages;
        page["hasNextPage"] = res?.get_all_runs?.pageInfo.hasNextPage;
        page["hasPreviousPage"] = res?.get_all_runs?.pageInfo.hasPreviousPage;
        page["totalCount"] = res?.get_all_runs?.pageInfo.totalCount;
        setRunzData(res?.get_all_runs?.Runs);
        setPageInfo(page);
        setLoader(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    setLoader1(true);
    const calendarMarkSet = new Set();
    const calendar = calendar_eventData?.runs_calender_data.map((item: any) => {
      const date = new Date(selectedDate);

      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      // const temp = { ...item, "dueDate": formattedDate };
      calendarMarkSet.add(formattedDate);
      return item;
    });

    const calendarMark = Array.from(calendarMarkSet);
    setCalendarMark(calendarMark);
    setCalendarEventData(calendar);
    setLoader1(false);
  }, [calendar_eventData, selectedDate]);

  const getTimeDifference = (notificationTime: any) => {
    const currentTime: any = moment();
    const timestamp = parseInt(notificationTime);

    // Create a Moment object from the timestamp
    const notificationTimeData = moment(timestamp);

    // Calculate the difference in milliseconds
    const timeDifferenceInMilliseconds = currentTime.diff(notificationTimeData);

    // Convert the difference to minutes and hours
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

  React.useEffect(() => {
    if (
      moment(selectedDate).format("MM/DD/YYYY") ==
      moment(new Date()).format("MM/DD/YYYY")
    ) {
      let arr: any = [];

      calendarEventData?.map((item: any) => {
        if (
          moment(item?.dueDate).format("MM/DD/YYYY") ==
          moment(new Date()).format("MM/DD/YYYY")
        ) {
          arr.push(item);
          return item;
        }
      });

      setCalendarContent(arr);
    }
  }, [calendarEventData]);

  const handleDateClick = (date: any) => {
    // setLoader1(true)
    const filCalendarContent = calendarEventData?.filter(
      (item: any) =>
        moment(item?.dueDate).format("MM/DD/YYYY") ==
        moment(date).format("MM/DD/YYYY")
    );
    setCalendarContent(filCalendarContent);
    setSelectedDate(moment(date).format("MM/DD/YYYY"));
    // setLoader1(false)
  };

  const arr = [1, 2, 3, 4, 5, 6, 7];

  const handleReadNotification = async (id: any) => {
    let payload2 = {
      _id: id,
      isRead: true,
    };
    await dispatch(fetchReadSingleMessageData(payload2));
    await notificationMessageList();
  };
  const filteredData = arr.filter((item: any) => item.is_show !== false);

  return (
    <PrivateRoute>
      <Box className="main-padding mypage-page">
        <Box className="table-outer" sx={{ width: "100%" }}>
          <TableContainer className="tableHeight2">
            <Table
              sx={{ minWidth: 650, position: "relative" }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Current tasks</TableCell>
                  <TableCell align="right">Department</TableCell>

                  <TableCell align="right">Lab</TableCell>
                  <TableCell align="right">Assigned by</TableCell>
                  <TableCell align="right">Created on</TableCell>

                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              {loader ? (
                <TableBody>
                  <TableSkeleton
                    columns={filteredData}
                    image={true}
                    rows={queryStrings.perPage}
                  />
                </TableBody>
              ) : !runzData || (runzData?.length === 0 && loader == false) ? (
                <TableBody>
                  <Box
                    sx={{
                      textAlign: "center",
                      position: "absolute",
                      left: "0rem",
                      right: "0rem",
                      padding: "1%",
                      width: "100%",
                    }}
                  >
                    <img src={Emptystate} alt="" />
                    <Typography className="no-remainder">
                      Runs not found.
                    </Typography>
                  </Box>
                  {/* </p> */}
                </TableBody>
              ) : (
                <TableBody>
                  {runzData?.map((row: any, index: any) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={(e: any) => {
                        navigate(`/runs/details/${row._id}`, {
                          state: { props: row },
                        });
                      }}
                    >
                      <TableCell scope="row">
                        <Box>
                          <Box>{row.runNumber}</Box>
                        </Box>
                      </TableCell>
                      <TableCell>{row?.procedureId?.name}</TableCell>
                      <TableCell>
                        {row.departmentId[0] !== null ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <>
                              <Chip
                                key={index}
                                label={row.departmentId[0]?.name}
                                sx={{
                                  m: 0.5,
                                  padding: "0px 3px",
                                }}
                              />
                              {row.departmentId.length > 1 && (
                                <span
                                  style={{
                                    fontWeight: 500,
                                    color: "#9F9F9F",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  +{row.departmentId.length - 1} More
                                </span>
                              )}
                            </>
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell style={{ whiteSpace: "nowrap" }}>
                        {row.laboratoryId[0] !== null ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <>
                              <Chip
                                key={index}
                                label={row.laboratoryId[0]?.name}
                                sx={{
                                  m: 0.5,
                                  padding: "0px 3px",
                                }}
                              />
                              {row.laboratoryId.length > 1 && (
                                <span
                                  style={{
                                    fontWeight: 500,
                                    color: "#9F9F9F",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  +{row.laboratoryId.length - 1} More
                                </span>
                              )}
                            </>
                          </Box>
                        ) : (
                          <span style={{ textAlign: "center" }}>-</span>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row?.assignedByName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box>
                          {row.createdOn === null
                            ? "-"
                            : moment(row.createdOn).isValid()
                            ? moment(row.createdOn).local().format("MM/DD/YYYY")
                            : "-"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          className={
                            row.status === "Created"
                              ? "create-select td-select"
                              : row.status === "Started"
                              ? "start-select td-select"
                              : row.status === "Completed"
                              ? "active-select td-select"
                              : row.status === "Submitted"
                              ? "submit-select td-select"
                              : "inactive-select td-select"
                          }
                          style={{
                            background:
                              row.status === "Created"
                                ? "#8d8d8d"
                                : row.status === "Started"
                                ? "#faaa49"
                                : row.status === "Stopped"
                                ? "#e2445c"
                                : row?.status == "Submitted"
                                ? "#a01fb1"
                                : "#00bf70",
                            padding: "6px",
                            width: "140px",
                            borderRadius: "20px",
                            height: "26px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {row?.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            currentPage={currentPage}
            perPage={queryStrings.perPage}
            handlePageChange={handlePageChange}
            currentPageNumber={queryStrings.page}
            totalRecords={runzData?.Runs?.length}
            page={pageInfo}
          />
        </Box>
        <Grid
          container
          spacing={2}
          sx={{ width: "100%", marginLeft: "0rem", marginTop: "1rem" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={8}
            xl={8}
            sx={{
              paddingLeft: "0px !important",
              paddingRight: { xs: "0px", lg: "16px" },
              paddingBottom: { xs: "16px", lg: "0px" },
            }}
          >
            <Box className="notification-mypage">
              <Box className="notification-title">
                <Typography>Notifications</Typography>
              </Box>
              <Box
                sx={{
                  overflowY: "scroll",
                  paddingBottom: "0rem",
                  height: "580px",
                }}
              >
                {NotificationMessageSliceData?.message?.length !== 0 ? (
                  NotificationMessageSliceData?.message?.map(
                    (notification: any, index: any) => (
                      <Box
                        className="notifications"
                        key={index}
                        style={{
                          backgroundColor:
                            notification?.isRead == false ? "#F3F3F3" : "white", // Apply different background for the first notification
                        }}
                        onClick={() => {
                          handleReadNotification(notification._id);
                        }}
                      >
                        <Box className="image-container">
                          <Avatar
                            alt="User Avatar"
                            src={data} // Assuming `data` contains the image source
                            sx={{ width: 56, height: 56, borderRadius: "50%" }}
                          />
                          <Box className="text-container">
                            <Box className="heading">{notification.title}</Box>
                            <Box className="content">
                              {notification.message}
                            </Box>
                          </Box>
                        </Box>
                        <Box className="time">
                          {getTimeDifference(notification.createdAt)}
                        </Box>
                      </Box>
                    )
                  )
                ) : (
                  <Box sx={{ textAlign: "center", padding: "15%" }}>
                    <img src={Emptystate} alt="" />
                    <Typography className="no-remainder">
                      No notifications yet!
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={4}
            xl={4}
            sx={{
              paddingLeft: { xs: "0px !important", lg: "16px !important" },
            }}
          >
            <Box className="calender-rightside">
              <Calendar
                onChange={handleDateClick}
                value={value}
                tileClassName={({ date, view }) => {
                  if (
                    calendarEventData?.length !== 0 &&
                    calendarEventData?.find(
                      (item: any) =>
                        moment(item?.dueDate).format("MM/DD/YYYY") ==
                        moment(date).format("MM/DD/YYYY")
                    )
                  ) {
                    return "events";
                  }
                }}
                onActiveStartDateChange={({ activeStartDate, view }) => {
                  // activeStartDate is a Date object representing the start date of the current view
                  const month: any = activeStartDate?.getMonth();
                  const year: any = activeStartDate?.getFullYear();
                  setCurrentMonth(month + 1);
                  setCurrentYear(year);

                  const calPayload = {
                    month: `${month + 1}`,
                    year: `${year}`,
                    assignedTo: loginUserSliceData?.verifyToken?._id,
                  };
                  dispatch(fetchCalendarEventData(calPayload));
                }}
              />
              <Divider className="hr-calender" />
              <Box
                sx={{
                  overflowY: "scroll",
                  paddingBottom: "0rem",
                  height: "calc(100vh - 79vh)",
                }}
              >
                {CalendarMark?.includes(selectedDate) && (
                  <>
                    {CalendarContent?.length !== 0 ? (
                      CalendarContent?.map((item: any, index: number) => (
                        <>
                          <Box sx={{ textAlign: "left" }}>
                            <Box className="hover-calender">
                              <Typography
                                className="id-detail"
                                style={{ textDecoration: "underline" }}
                              >
                                {item.runNumber}/&nbsp;{item.dueDate}
                              </Typography>
                              <Typography
                                className="id-detail-title"
                                style={{
                                  display: "flex",
                                  alignItems: "baseline",
                                }}
                              >
                                <p>{item.objective} &nbsp;&nbsp;</p>
                                <Box
                                  className={
                                    item.status === "Created"
                                      ? "create-select td-select"
                                      : item.status === "Started"
                                      ? "start-select td-select"
                                      : item.status === "Completed"
                                      ? "active-select td-select"
                                      : item.status === "Submitted"
                                      ? "submit-select td-select"
                                      : "inactive-select td-select"
                                  }
                                  style={{
                                    background:
                                      item.status === "Created"
                                        ? "#8d8d8d"
                                        : item.status === "Started"
                                        ? "#faaa49"
                                        : item.status === "Stopped"
                                        ? "#e2445c"
                                        : item?.status == "Submitted"
                                        ? "#a01fb1"
                                        : "#00bf70",
                                    padding: "6px",
                                    width: "140px",
                                    borderRadius: "20px",
                                    height: "26px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "white",
                                  }}
                                >
                                  {item?.status}
                                </Box>
                              </Typography>
                            </Box>
                            {index < CalendarContent.length - 1 && (
                              <hr
                                style={{
                                  border: "1px solid #f5f5f5",
                                  margin: "0.5rem 0rem",
                                }}
                              />
                            )}
                          </Box>
                        </>
                      ))
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        <img src={Emptystate} alt="" />
                        <Typography className="no-remainder">
                          No reminders yet!
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <TablePopup ref={tablePopupRef} />
    </PrivateRoute>
  );
}
