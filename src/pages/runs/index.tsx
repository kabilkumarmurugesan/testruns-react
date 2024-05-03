/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import TableFilters from "../../components/table/TableFilters";
import TablePagination from "../../components/table/TablePagination";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  MenuItem,
  Select,
  Typography,
  Badge,
  TextField,
  Autocomplete,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import AddIcon from "@mui/icons-material/Add";
import { RunsHeaders, RunsRows, RunsStatusList } from "../../utils/data";
import TableHeader from "../../components/table/TableHeader";
import { RunsRowData } from "../../modals/runs.modal";
import {
  handleCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
} from "../../utils/common-services";
import DeletePopup from "../../components/DeletePopup";
import RunsForm from "./RunsForm";
import runCreated from "../../assets/images/run-created.svg";
import runStarted from "../../assets/images/run-started.svg";
import runStopped from "../../assets/images/run-stopped.svg";
import runSubmitted from "../../assets/images/run-submitted.svg";
import runCompleted from "../../assets/images/run-completed.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchRunsData, deleteRunsData } from "../../api/RunsAPI";
import moment from "moment";
import DeleteSuccessPopup from "../../components/DeleteSuccessPopup";
import TablePopup from "../../components/table/TablePopup";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import filterIcon from "../../assets/images/filter-icon1.svg";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Popover from "@mui/material/Popover";
import TableSkeleton from "../../components/table/TableSkeleton";
import Emptystate from "../../assets/images/Emptystate.svg";
import dayjs from "dayjs";
import { fetchUserData } from "../../api/userAPI";
import { fetchProcedureData } from "../../api/procedureAPI";
import { fetchOrganizationById } from "../../api/organizationAPI";
import { fetchDepartmentById } from "../../api/departmentAPI";
import { fetchLabById } from "../../api/labAPI";
import { useLocation, useNavigate } from "react-router";

// table start

const rows: RunsRowData[] = RunsRows;
const runsStatus: any = RunsStatusList;

export default function Runs() {
  const [headers, setHeaders] = React.useState<any>(RunsHeaders);
  const [Rows, setSelectedRows] = React.useState(rows);
  const [isDeselectAllChecked, setIsDeselectAllChecked] = React.useState(false);
  const [isselectAllChecked, setIsselectAllChecked] = React.useState(false);
  const [isTableHeaderVisible, setTableHeaderVisible] = React.useState(false);
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  // const [deletePopup, setDeletePopup] = React.useState(false);
  const deletePopupRef: any = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const tablePopupRef: any = React.useRef(null);
  const deleteSuccessPopupRef: any = React.useRef(null);
  const [filterKey, setFilterKey] = React.useState<any>(null);
  const [columnAnchorEl, setColumnAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [filterPopoverEl, setFilterPopoverEl] =
    React.useState<null | HTMLElement>(null);
  const columnAnchorOpen = Boolean(columnAnchorEl);
  const filterAnchorOpen = Boolean(filterPopoverEl);
  const [filterStatus, setFilterStatus] = React.useState(null);
  const [filterSearchBy, setFilterSearchBy] = React.useState(null);
  const [filterSearchValue, setFilterSearchValue] = React.useState(null);
  const [filterFieldName, setFilterFieldName] = React.useState("");
  const [filterType, setFilterType] = React.useState(null);
  const [filterAvailability, setFilterAvailability] = React.useState(null);
  const [filterOptions, setFilterOptions] = React.useState<any>([]);
  const [loader, setLoader] = React.useState(false);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(Rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [runsData, setRunsData] = React.useState<any>([]);
  const [rowId, setRowId] = React.useState<any>([]);
  const [runsRow, setRunsRow] = React.useState<any>([]);
  const dispatch: any = useDispatch();
  const [filter, setFilter] = React.useState<any>(false);
  const [valuesName, setValuesName] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(null);
  const [pageInfo, setPageInfo] = React.useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [getUser, setGetUser] = React.useState([]);

  const filterSearchValueRef: any = React.useRef(null);
  const location: any = useLocation();
  const navigate: any = useNavigate();
  const payloads = location.state?.props1;
  const singleUserData = useSelector(
    (state: any) => state.user?.data?.get_user
  );

  const runsSliceData = useSelector(
    (state: any) => state.runs.data?.get_all_runs
  );
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const departmentSliceData = useSelector(
    (state: any) => state.department.data?.get_all_departments
  );
  const labSliceData = useSelector(
    (state: any) => state.lab.data?.get_all_labs
  );

  const procedureSliceData = useSelector(
    (state: any) => state.procedure.data?.get_all_procedures
  );

  const userSliceData = useSelector((state: any) => state.userData.data);

  const credencial = loginUserSliceData?.verifyToken?.role[0]?.runs_management;

  useEffect(() => {
    let opt: any = [];
    if (filterFieldName === "Runs ID") {
      runsSliceData?.Runs.map((element: any) => {
        opt.push({
          id: element.runNumber,
          name: element.runNumber,
          value: element.runNumber,
        });
      });
      setFilterOptions(opt);
    }
  }, [runsSliceData]);

  const [queryStrings, setQueryString] = React.useState({
    page: 1,
    perPage: 10,
    searchBy: null,
    search: null,
    sortBy: null,
    sortOrder: "desc",
  });

  useEffect(() => {
    // setOptions(options)
    let opt: any = [];
    if (filterFieldName === "Procedure name") {
      procedureSliceData?.Procedures?.map((element: any) => {
        opt.push({
          label: element?.name,
          value: element?.name,
          id: element?.name,
        });
      });
      setFilterOptions(opt);
    }
  }, [procedureSliceData, filterFieldName]);

  const Data = Rows.slice(startIndex, endIndex);

  useEffect(() => {
    setGetUser(getUser);
    let opt: any = [];
    getUser &&
      getUser.length > 0 &&
      getUser?.map((element: any) => {
        opt.push({
          label: element?.fullName,
          value: element?.fullName,
          id: element?.fullName,
          email: element?.fullName,
        });
      });

    setFilterOptions(opt);
  }, [getUser]);

  useEffect(() => {
    setGetUser(userSliceData?.get_all_users?.Identity);
  }, [userSliceData]);

  useEffect(() => {
    if (filterFieldName === "Assigned by") {
      setLoading(true);
      const getData = setTimeout(() => {
        dispatch(
          fetchUserData({
            page: 1,
            perPage: 10,
            searchBy: "firstName",
            organisationId: loginUserSliceData?.verifyToken.organisationId,
            search: inputValue !== "undefined" ? inputValue : "",
            sortBy: queryStrings.sortBy,
            sortOrder: "desc",
          })
        )
          .then((res: any) => {
            setLoading(false);
          })
          .catch((err: any) => {
            setLoading(false);
          });
      }, 1000);
      return () => clearTimeout(getData);
    }
    if (filterFieldName === "Procedure name") {
      setLoading(true);
      const getData = setTimeout(() => {
        dispatch(
          fetchProcedureData({
            page: 1,
            perPage: 10,
            searchBy: "name",
            search: inputValue !== "undefined" ? inputValue : "",
            organisationId: loginUserSliceData?.verifyToken.organisationId,
            sortBy: queryStrings.sortBy,
            sortOrder: "desc",
          })
        )
          .then((res: any) => {
            setLoading(false);
          })
          .catch((err: any) => {
            setLoading(false);
          });
      }, 1000);
      return () => clearTimeout(getData);
    }
    if (filterFieldName === "Runs ID") {
      setLoading(true);
      dispatch(
        fetchRunsData({
          page: 1,
          perPage: 10,
          searchBy: "runNumber",
          search: inputValue !== "undefined" ? inputValue : "",
          sortBy: queryStrings.sortBy,
          sortOrder: "desc",
        })
      )
        .then((res: any) => {
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
        });
    }
  }, [inputValue, filterFieldName]);

  const handleFilterPopoverClose = () => {
    setFilterPopoverEl(null);
  };
  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };
  const handleFilterPopoverClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setFilterPopoverEl(event.currentTarget);
  };

  const handleClearFilter = () => {
    setFilterStatus(null);
    setFilterAvailability(null);
    setFilterSearchBy(null);
    setFilterSearchValue(null);
    setFilterOptions([]);
    setFilterType(null);
    applyFilters("search", "");
    handleFilterPopoverClose();
    setFilterKey(null);
    setFilter(false);
    setValuesName(null);
    setInputValue(null);
  };
  useEffect(() => {
    getAllAsset();
    setTableHeaderVisible(false);
    setRowId([]);
    setRunsRow([]);
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
    if (loginUserSliceData?.verifyToken?.role[0]?.name === "Requester") {
      // setQueryString({...queryStrings,["assignedTo"]:loginUserSliceData?.verifyToken?._id,["assignedBy"]:loginUserSliceData?.verifyToken?._id})
      payload["assignedTo"] = loginUserSliceData?.verifyToken?._id;
      payload["assignedBy"] = loginUserSliceData?.verifyToken?._id;
      payload["userId"] = loginUserSliceData?.verifyToken?._id;
    }
    //tester 65741c069d53d19df8321e6c
    if (loginUserSliceData?.verifyToken?.role[0]?.name === "Tester") {
      payload["userId"] = loginUserSliceData?.verifyToken?._id;
      // setQueryString({...queryStrings,["userId"]:loginUserSliceData?.verifyToken?._id})
    }
    if (loginUserSliceData?.verifyToken?.role[0]?.name === "Admin") {
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
        setRunsData(res?.get_all_runs?.Runs);
        setPageInfo(page);
        setLoader(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // if(payloads!==undefined){
    //   setQueryString(payloads)
    // }
    //admin 65741c069d53d19df8321e6d
    const payload: any = {
      page: 1,
      perPage: 10,
      sortOrder: "desc",
      organisationId: loginUserSliceData?.verifyToken.organisationId,
      sortBy: queryStrings.sortBy,
    };
    dispatch(fetchUserData(payload));
    return () => {
      const headersList: any = [...headers];
      headersList.map((item: any) => {
        return (item.sort = "asc");
      });
      setHeaders(headersList);
    };
  }, []);

  useEffect(() => {
    dispatch(
      fetchOrganizationById({
        instituteId: loginUserSliceData?.verifyToken.instituteId,
      })
    );
    dispatch(
      fetchDepartmentById({
        organisationId: loginUserSliceData?.verifyToken.organisationId,
      })
    );
    dispatch(
      fetchLabById({
        departmentId: loginUserSliceData?.verifyToken.departmentId,
      })
    );
  }, []);

  const handleInputChange = (event: any, newInputValue: any) => {
    // Fetch suggestions when the user types
    setInputValue(newInputValue !== "undefined" ? newInputValue : null);
  };

  const handlePageChange = (even: any, page_no: number) => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    payload["page"] = page_no;
    page["currentPage"] = page_no;
    setPageInfo(page);
    setQueryString(payload);
    setCurrentPage(page_no);
  };
  const [visibleRow, setVisibleRow] = React.useState<any>(Data);
  //command by govind

  const handleChange = (event: any, id: any) => {
    handleCheckboxChange(
      runsData,
      setRunsData,
      setIsDeselectAllChecked,
      setIsselectAllChecked,
      setTableHeaderVisible,
      setVisibleRow
    )(event, id);
  };
  const handleDeChange = handleDeCheckboxChange(
    isDeselectAllChecked,
    runsData,
    setRunsData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setTableHeaderVisible,
    setRowId
    // setVisibleRow,
  );
  const handledAllchange = handledAllSelected(
    isselectAllChecked,
    runsData,
    setRunsData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setVisibleRow,
    setRowId
  );

  const handleRequestSort = () => {};

  const handleMenuCheckboxChange = (e: any, index: any) => {
    setHeaders((prevColumns: any) => {
      return prevColumns.map((column: any, i: any) => {
        if (i === index) {
          return { ...column, is_show: !headers[index].is_show };
        }
        return column;
      });
    });
  };

  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  // const handleSubmitFormPopup = () => {
  //   formPopupRef.current.open(false);
  //   successPopupRef.current.open(true, 'Run');
  //   setTimeout(() => {
  //     successPopupRef.current.open(false, 'Run');
  //   }, 3000);
  // };

  const handleOpenConfirmationPopup = (state: any) => {
    confirmationPopupRef.current.open(state);
  };

  const handleCloseTableHeader = (status: boolean) => {
    setTableHeaderVisible(status);
    const updatedRows = runsData.map((row: any) => ({
      ...row,
      is_checked: false,
    }));
    setRunsData(updatedRows);
    setIsDeselectAllChecked(true);
    setIsselectAllChecked(false);
  };

  const handleOpenDeletePopup = () => {
    deletePopupRef.current.open(true, "Runs");
  };

  const clickHandler = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const reload = () => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    setPageInfo(page);
    setQueryString(payload);
  };
  const handleTableSorting = (_event: any, _data: any, _index: any) => {
    const payload: any = { ...queryStrings };
    const headersList: any = [...headers];
    payload["sortBy"] = headersList[_index].id;
    payload["sortOrder"] = headersList[_index].sort === "asc" ? "desc" : "asc";
    headersList[_index].sort =
      headersList[_index].sort === "asc" ? "desc" : "asc";
    setHeaders(headersList);
    setQueryString(payload);
  };

  const runVal: any = { _id: rowId };
  const handleDeleteConfirmation = async (state: any) => {
    if (state === 1) {
      dispatch(deleteRunsData(runVal))
        .then((res: any) => {
          toast(`Selected runs have been deleted successfully!`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
            closeButton: true,
          });
          reload();
          setTableHeaderVisible(false);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
    deletePopupRef.current.open(false);
  };

  const applyFilters = (field: any, value: any) => {
    const payload: any = { ...queryStrings };
    payload["searchBy"] = field;
    payload["page"] = 1;
    payload["search"] =
      typeof value === "string" ? value : moment(value).format("MM/DD/YYYY");
    setQueryString(payload);
    setFilter(true);
  };
  var arr: any = [];
  const array = [
    {
      id: "65670efa4e0aad001292d6ab",
      label: "users4@gmail.com",
      value: "adbul@testrunz.com",
    },
    {
      id: "6561ef0d2f447d0012e3d8cd",
      label: "users14@gmail.com",
      value: "users4@gmail.com",
    },
    {
      id: "6561ef0d2f447d0012e3d8cd",
      label: "users42@gmail.com",
      value: "users4@gmail.com",
    },
    // ... other objects
  ];

  const labelToFind = "users4@gmail.com";

  const newArray = array
    .filter((item) => item.label !== labelToFind)
    .map(({ id, label }) => ({ id, label }));

  const handleCheckboxValues = (id: any, row: any) => {
    // Check if the ID is already in the selectedIds

    if (rowId.includes(id)) {
      // If it is, remove it
      setRowId(rowId.filter((rowId: any) => rowId !== id));

      setRunsRow(
        runsRow.filter((item: any) => item._id !== id).map((val: any) => val)
      );
    } else {
      // If it's not, add it
      setRowId([...rowId, id]);

      arr.push(row);
      setRunsRow([...runsRow, row]);
    }
  };

  const emptyRows = 0 > 0 ? Math.max(0, (1 + 0) * 5 - 12) : 0;

  const getFilterOptions = (data: any) => {
    const result: any = [];
    data.forEach((element: any) => {
      result.push({
        id: element.name,
        name: element.name,
        value: element._id,
      });
    });
    return result;
  };
  const filteredData = headers.filter((item: any) => item.is_show !== false);

  return (
    <PrivateRoute>
      <Box className="main-padding runz-page">
        <Box className="title-main">
          <Typography>Runs</Typography>
          <div className="buttonFilter">
            <Button
              variant="contained"
              onClick={() => {
                formPopupRef.current.open(true);
              }}
              disabled={!credencial?.create}
            >
              <AddIcon sx={{ mr: 1 }} />
              Create Run
            </Button>
            <Box sx={{ position: "relative" }}>
              <Button
                // aria-describedby={id}
                variant="contained"
                onClick={handleFilterPopoverClick}
                style={{
                  boxShadow: "none",
                  backgroundColor: "white",
                  padding: "0px",
                  justifyContent: "center",
                }}
                className="filterButton"
              >
                {/* <FilterAltOutlinedIcon style={{ fontSize: '2rem' }} /> */}
                <Badge
                  color="secondary"
                  variant={filter ? "dot" : "standard"}
                  invisible={false}
                  className="red-badge-filter"
                >
                  <img
                    src={filterIcon}
                    alt="no_image"
                    style={{
                      width: "25px",
                      height: "25px",
                      opacity: 0.9,
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </Button>
              <Popover
                className="filter-dropdown"
                open={filterAnchorOpen}
                anchorEl={filterPopoverEl}
                onClose={handleFilterPopoverClose}
                disableScrollLock={true}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #d0d0d0",
                      alignContent: "center",
                      padding: "1rem",
                    }}
                  >
                    <Typography fontWeight={600} variant="body1">
                      Filters
                    </Typography>
                    <CloseIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handleFilterPopoverClose}
                    />
                  </Box>
                  <Box sx={{ padding: "0rem 1rem 1rem 1rem" }}>
                    <Box sx={{ my: 1 }}>
                      <Typography variant="body2" paddingY={1}>
                        Search by
                      </Typography>

                      <Select
                        MenuProps={{
                          disableScrollLock: true,
                          marginThreshold: null,
                        }}
                        labelId="table-select-label"
                        id="table-select"
                        value={filterSearchBy}
                        size="small"
                        fullWidth
                        displayEmpty
                        autoComplete="off"
                        IconComponent={ExpandMoreOutlinedIcon}
                        onChange={(event: any, data: any) => {
                          //   debugger;
                          setFilterSearchValue(null);
                          setFilterSearchBy(event.target?.value);
                          setFilterFieldName(data.props.children);
                          setValuesName(null);

                          if (event.target?.value === "laboratoryId") {
                            setFilterOptions(getFilterOptions(labSliceData));
                          }
                          if (event.target?.value === "departmentId") {
                            setFilterOptions(
                              getFilterOptions(departmentSliceData)
                            );
                          }
                          if (event.target?.value === "runNumber") {
                            const data: any = [];
                            runsSliceData.Runs.forEach((element: any) => {
                              data.push({
                                id: element.runNumber,
                                name: element.runNumber,
                                value: element.runNumber,
                              });
                            });
                            setFilterOptions(data);
                          }
                          if (event.target?.value === "procedureName") {
                            const data: any = [];

                            procedureSliceData?.Procedures?.map(
                              (element: any) => {
                                data.push({
                                  label: element?.name,
                                  value: element?.name,
                                  id: element?.name,
                                });
                              }
                            );

                            setFilterOptions(data);
                          }
                          if (event.target?.value === "status") {
                            setFilterOptions(RunsStatusList);
                          }
                          if (event.target?.value === "assignedBy") {
                            const data: any = [];
                            userSliceData?.map((element: any) => {
                              data.push({
                                label: element?.fullName,
                                value: element?.fullName,
                                id: element?.fullName,
                                email: element?.fullName,
                              });
                            });
                            setFilterOptions(data);
                          }
                        }}
                        renderValue={
                          filterSearchBy !== null
                            ? undefined
                            : () => <Placeholder>Search by</Placeholder>
                        }
                      >
                        {headers.map((element: any) => (
                          <MenuItem
                            value={element.id}
                            key={element.id}
                            onClick={() => {
                              setFilterType(element.type);
                              setFilterOptions(element.filters[0]?.options);
                              setFilterKey(element.id);
                            }}
                          >
                            {element.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <Box sx={{ my: 1 }}>
                      {filterType !== null && (
                        <Typography variant="body2" paddingY={1}>
                          {filterType === "text"
                            ? `Search ${filterFieldName}`
                            : filterType === "date"
                            ? `Date ${filterFieldName}`
                            : `Select ${filterFieldName}`}
                        </Typography>
                      )}

                      {filterType === null ? null : filterType === "text" ? (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="Search"
                          id="Search"
                          style={{ margin: "0px" }}
                          InputLabelProps={{ shrink: false }}
                          placeholder="Search"
                          size="small"
                          autoComplete="off"
                          value={filterSearchValue}
                          onChange={(event: any) =>
                            setFilterSearchValue(event.target.value)
                          }
                        />
                      ) : filterType === "date" ? (
                        <Box id="filterDatePicker">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="MM/DD/YYYY"
                              value={dayjs(filterSearchValue)}
                              onChange={(event: any) =>
                                setFilterSearchValue(event.$d)
                              }
                              inputRef={filterSearchValueRef}
                              onSelectedSectionsChange={() => {
                                if (filterSearchValueRef.current) {
                                  filterSearchValueRef.current.disabled = true;
                                }
                              }}
                            />
                          </LocalizationProvider>
                        </Box>
                      ) : filterType === "autocomplete" ? (
                        <Autocomplete
                          className="autocompleteFilter"
                          style={{
                            borderRadius: "15px !importnant",
                            paddingTop: "12px",
                          }}
                          limitTags={3}
                          loading={loading}
                          disableClearable={true}
                          options={
                            filterOptions !== undefined ? filterOptions : []
                          }
                          getOptionLabel={(option: any) => option?.value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search..."
                              style={{ marginTop: "-8px" }}
                              className="place-top"
                            />
                          )}
                          value={valuesName}
                          onChange={(_, selectedOptions: any) => {
                            setFilterSearchValue(selectedOptions?.id);
                            setValuesName(selectedOptions);
                          }}
                          onInputChange={handleInputChange}
                        />
                      ) : (
                        <Select
                          MenuProps={{
                            disableScrollLock: true,
                            marginThreshold: null,
                          }}
                          value={filterSearchValue}
                          labelId="table-select-label2"
                          id="table-select2"
                          size="small"
                          fullWidth
                          displayEmpty
                          IconComponent={ExpandMoreOutlinedIcon}
                          onChange={(event: any) =>
                            setFilterSearchValue(event.target?.value)
                          }
                          renderValue={
                            filterSearchValue !== null
                              ? undefined
                              : () => <Placeholder>Select</Placeholder>
                          }
                        >
                          {filterOptions.map((element: any, index: any) => (
                            <MenuItem key={index} value={element.value}>
                              {element.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #d0d0d0",
                      alignContent: "center",
                      padding: "1rem",
                    }}
                  >
                    <Button
                      style={{
                        border: "1px solid #d3d3d3",
                        color: "#181818",
                        textTransform: "capitalize",
                      }}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                    <Button
                      style={{
                        border: "1px solid #d3d3d3",
                        background: "#FFC60B",
                        color: "#181818",
                        textTransform: "capitalize",
                      }}
                      disabled={
                        filterKey !== null && filterSearchValue !== null
                          ? false
                          : true
                      }
                      onClick={() => {
                        handleFilterPopoverClose();
                        applyFilters(filterKey, filterSearchValue);
                      }}
                    >
                      Show results
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </Box>
          </div>
        </Box>
        <TableFilters
          columns={headers}
          handleMenuCheckboxChange={handleMenuCheckboxChange}
          handleDeCheckboxChange={handleDeChange}
          handledAllSelected={handledAllchange}
          isDeselectAllChecked={isDeselectAllChecked}
          isselectAllChecked={isselectAllChecked}
          isTableHeaderVisible={isTableHeaderVisible}
          closeTableHeader={handleCloseTableHeader}
          deleteRecord={handleOpenDeletePopup}
          module="runs"
          status={runsStatus}
          applyFilters={applyFilters}
          runzId={rowId}
          runzRow={runsRow}
          reload={() => {
            setRowId([]);
            setRunsRow([]);
          }}
        />

        <Box className="table-outer" sx={{ width: "100%" }}>
          <TableContainer className="tableHeight">
            <Table
              sx={{ minWidth: 750, position: "relative" }}
              aria-labelledby="tableTitle"
              size="medium"
              stickyHeader
            >
              <TableHeader
                numSelected={0}
                onRequestSort={handleRequestSort}
                onSelectAllClick={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                order={"asc"}
                orderBy={""}
                rowCount={0}
                columns={headers}
                handleTableSorting={handleTableSorting}
              />
              {loader ? (
                <TableBody>
                  <TableSkeleton
                    columns={filteredData}
                    image={true}
                    rows={queryStrings.perPage}
                  />
                </TableBody>
              ) : !runsData || (runsData?.length === 0 && !loader) ? (
                <TableBody>
                  <Box
                    sx={{
                      textAlign: "center",
                      position: "absolute",
                      left: "0rem",
                      right: "0rem",
                      padding: "10%",
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
                  {runsData?.map((row: any, index: number) => (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      sx={{ cursor: "pointer" }}
                      onClick={(e: any) => {
                        navigate(`/runs/details/${row._id}`, {
                          state: { props: row },
                          // state: { props: row ,queries:queryStrings },
                        });
                      }}
                    >
                      {headers[0].is_show && (
                        <TableCell scope="row">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ mt: 0, mr: 1 }}>
                              <Checkbox
                                color="primary"
                                checked={row.is_checked ? true : false}
                                onClick={(e: any) => clickHandler(e)}
                                onChange={(event) => {
                                  handleCheckboxValues(row._id, row);
                                  handleChange(event, row._id);
                                }}
                              />
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                style={{
                                  width: "45px",
                                  height: "41px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={
                                    row.status === "Created"
                                      ? runCreated
                                      : row.status === "Started"
                                      ? runStarted
                                      : row.status === "Completed"
                                      ? runCompleted
                                      : row.status === "Submitted"
                                      ? runSubmitted
                                      : runStopped
                                  }
                                  alt="no_image"
                                  style={{ width: "35px", height: "35px" }}
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
                                <Box>{row.runNumber}</Box>
                                {row.shared && (
                                  <span
                                    style={{
                                      color:
                                        row?.status === "Created"
                                          ? "#8d8d8d"
                                          : row?.status === "Started"
                                          ? "#faaa49"
                                          : row?.status == "Stopped"
                                          ? "red"
                                          : row?.status === "Completed"
                                          ? "#00bf70"
                                          : "#a01fb1",
                                    }}
                                  >
                                    shared
                                  </span>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                      )}

                      {headers[1].is_show && (
                        <TableCell>{row?.procedureName}</TableCell>
                      )}
                      {headers[2].is_show && (
                        <TableCell>
                          {row.departmentId[0] !== null ? (
                            <Box
                              onClick={(_event) => {
                                _event.preventDefault();
                                _event.stopPropagation();
                                tablePopupRef.current?.open(
                                  true,
                                  "departments",
                                  row.departmentId
                                );
                              }}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <>
                                <Chip
                                  key={index}
                                  label={row.departmentId[0]?.name}
                                  sx={{
                                    m: 0.5,
                                    padding: "0px 3px",
                                  }}
                                  onClick={(_event) => {
                                    _event.preventDefault();
                                    _event.stopPropagation();
                                    tablePopupRef.current.open(
                                      true,
                                      "departments",
                                      row.departmentId
                                    );
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
                      )}
                      {headers[3].is_show && (
                        <TableCell>
                          {row.laboratoryId[0] !== null ? (
                            <Box
                              onClick={(_event) => {
                                _event.preventDefault();
                                _event.stopPropagation();
                                tablePopupRef.current?.open(
                                  true,
                                  "lab",
                                  row.laboratoryId
                                );
                              }}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <>
                                <Chip
                                  key={index}
                                  label={row.laboratoryId[0]?.name}
                                  sx={{
                                    m: 0.5,
                                    padding: "0px 3px",
                                  }}
                                  onClick={(_event) => {
                                    _event.preventDefault();
                                    _event.stopPropagation();
                                    tablePopupRef.current.open(
                                      true,
                                      "lab",
                                      row.laboratoryId
                                    );
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
                      )}
                      {headers[4].is_show && (
                        <TableCell>
                          {row.createdOn === null
                            ? "-"
                            : moment(row.createdOn).isValid()
                            ? moment(row.createdOn).local().format("MM/DD/YYYY")
                            : "-"}
                        </TableCell>
                      )}
                      {headers[5].is_show && (
                        <TableCell>
                          {row.dueDate === null
                            ? "-"
                            : moment(row.dueDate).isValid()
                            ? moment(row.dueDate).local().format("MM/DD/YYYY")
                            : "-"}
                        </TableCell>
                      )}
                      {headers[6].is_show && (
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
                                  : row?.status === "Submitted"
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
                      )}
                      {headers[7].is_show && (
                        <TableCell align="center">
                          {row?.assignedByName}
                        </TableCell>
                      )}
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
            totalRecords={runsData?.length}
            page={pageInfo}
          />
        </Box>
        <Box>
          <DeletePopup
            rowId={rowId}
            ref={deletePopupRef}
            closeDeletePopup={() =>
              deletePopupRef.current.open(false, "Runs", rowId)
            }
            deleteConfirmation={handleDeleteConfirmation}
          />
        </Box>
        <Box>
          <RunsForm
            ref={formPopupRef}
            closeFormPopup={handleCloseFormPopup}
            openConfirmationPopup={handleOpenConfirmationPopup}
            type="create"
            reload={reload}
            handleReloadSingleData={""}
          />
        </Box>
        <DeleteSuccessPopup ref={deleteSuccessPopupRef} />
        <TablePopup ref={tablePopupRef} />
      </Box>
    </PrivateRoute>
  );
}
