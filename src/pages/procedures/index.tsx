/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
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
import TablePagination from "../../components/table/TablePagination";
import TableBody from "@mui/material/TableBody";
import DeletePopup from "../../components/DeletePopup";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import "../../assets/styles/css/procedure.css";
// import Deleteconfirmationpopup from "../../components/deleteconfirmationpopup";
import ProcedureForm from "./ProcedureForm";
import TableFilters from "../../components/table/TableFilters";
import {
  handleCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
} from "../../utils/common-services";
import { ProceduresHeaders } from "../../utils/data";
import { ProceduresRowData } from "../../modals/Procedures.modal";
import TableHeader from "../../components/table/TableHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProcedureData,
  deleteProcedureData,
} from "../../api/procedureAPI";
import DeleteSuccessPopup from "../../components/DeleteSuccessPopup";
import moment from "moment";
import TablePopup from "../../components/table/TablePopup";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import filterIcon from "../../assets/images/filter-icon1.svg";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Popover from "@mui/material/Popover";
import TableSkeleton from "../../components/table/TableSkeleton";
import Emptystate from "../../assets/images/Emptystate.svg";
import dayjs from "dayjs";
import { fetchOrganizationById } from "../../api/organizationAPI";
import { fetchDepartmentById } from "../../api/departmentAPI";
import { fetchLabById } from "../../api/labAPI";
import { useLocation, useNavigate } from "react-router";

const rows: ProceduresRowData[] = [];

export default function Procedures() {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const deletePopupRef: any = React.useRef(null);
  const tablePopupRef: any = React.useRef(null);
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
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [filter, setFilter] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(null);
  const [valuesName, setValuesName] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [headers, setHeaders] = React.useState<any>(ProceduresHeaders);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageInfo, setPageInfo] = React.useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [procedureData, setProcedureData] = React.useState<any>([]);
  const [rowId, setRowId] = React.useState<any>([]);
  const [queryStrings, setQueryString] = React.useState({
    page: 1,
    perPage: 10,
    searchBy: null,
    search: null,
    sortBy: null,
    sortOrder: "desc",
    // userId:loginUserSliceData?.verifyToken?._id
  });
  const [visibleRow, setVisibleRow] = React.useState<any>(procedureData);
  const [Rows, setSelectedRows] = React.useState(rows);
  const [isDeselectAllChecked, setIsDeselectAllChecked] = React.useState(false);
  const [isselectAllChecked, setIsselectAllChecked] = React.useState(false);
  const [isTableHeaderVisible, setTableHeaderVisible] = React.useState(false);
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const filterSearchValueRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const deleteSuccessPopupRef: any = React.useRef(null);

  const singleUserData = useSelector(
    (state: any) => state.user?.data?.get_user
  );

  const procedureSliceData = useSelector(
    (state: any) => state.procedure.data?.get_all_procedures
  );
  const departmentSliceData = useSelector(
    (state: any) => state.department.data?.get_all_departments
  );
  const labSliceData = useSelector(
    (state: any) => state.lab.data?.get_all_labs
  );
  const proceduresIdSliceData = useSelector(
    (state: any) => state.procedure.data?.get_all_procedures
  );

  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const credencial = loginUserSliceData?.verifyToken?.role[0];
  const location: any = useLocation();
  const payloads = location.state?.props1;
  const handleRequestSort = () => {
    // event: React.MouseEvent<unknown>,
    //   property: keyof ProceduresRowData,
    // ) => {
    //   const isAsc = orderBy === property && order === 'asc';
    //   setOrder(isAsc ? 'desc' : 'asc');
    //   setOrderBy(property);
  };

  React.useEffect(() => {
    if (filterSearchValueRef.current) {
      filterSearchValueRef.current.disabled = true;
    }
  }, [filterSearchValueRef.current]);

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
    setFilterSearchBy((prevState) => null);
    setFilterSearchValue((prevState) => null);
    setFilterOptions([]);
    setFilterType(null);
    // applyFilters(null, null);
    applyFilters("", "");
    handleFilterPopoverClose();
    setFilterKey(null);
    setFilter(false);
    setValuesName(null);
  };

  React.useEffect(() => {
    getAllProcedures();
    // setLoader(true);
    // dispatch(fetchProcedureData(queryStrings));
    setTableHeaderVisible(false);
    setRowId([]);
  }, [queryStrings]);

  React.useEffect(() => {
    // if(payloads!==undefined){
    //   setQueryString(payloads)
    // }
    return () => {
      const headersList: any = [...headers];
      headersList.map((item: any) => {
        return (item.sort = "asc");
      });
      setHeaders(headersList);
    };
  }, []);

  React.useEffect(() => {
    dispatch(
      fetchOrganizationById({ instituteId: singleUserData?.instituteId })
    );
    dispatch(
      fetchDepartmentById({ organisationId: singleUserData?.organisationId })
    );
    dispatch(fetchLabById({ departmentId: singleUserData?.departmentId }));
  }, []);

  const getAllProcedures = () => {
    setLoader(true);
    const payload: any = {
      page: queryStrings.page,
      perPage: queryStrings.perPage,
      searchBy: queryStrings.searchBy,
      search: queryStrings.search,
      sortBy: queryStrings.sortBy,
      sortOrder: queryStrings.sortOrder,
    };
    if (
      loginUserSliceData?.verifyToken?.role[0]?.name == "Tester" ||
      loginUserSliceData?.verifyToken?.role[0]?.name == "Requester"
    ) {
      payload["laboratoryId"] = singleUserData?.laboratoryId;
    }
    if (loginUserSliceData?.verifyToken?.role[0]?.name == "Admin") {
      payload["organisationId"] = singleUserData?.organisationId;
    }
    dispatch(fetchProcedureData(payload))
      .then((res: any) => {
        const page: any = { ...pageInfo };
        page["currentPage"] = res?.get_all_procedures?.pageInfo.currentPage;
        page["totalPages"] = res?.get_all_procedures?.pageInfo.totalPages;
        page["hasNextPage"] = res?.get_all_procedures?.pageInfo.hasNextPage;
        page["hasPreviousPage"] =
          res?.get_all_procedures?.pageInfo.hasPreviousPage;
        page["totalCount"] = res?.get_all_procedures?.pageInfo.totalCount;
        setProcedureData(res?.get_all_procedures?.Procedures);
        setPageInfo(page);
        setLoader(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
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
  React.useEffect(() => {
    let opt: any = [];
    if (filterFieldName === "Procedure ID") {
      proceduresIdSliceData?.Procedures?.map((element: any) => {
        opt.push({
          id: element.procedureNumber,
          name: element.procedureNumber,
          value: element.procedureNumber,
        });
      });
      setFilterOptions(opt);
    } else if (filterFieldName === "Procedure name") {
      procedureSliceData?.Procedures?.map((element: any) => {
        opt.push({
          label: element?.name,
          value: element?.name,
          id: element?.name,
        });
      });
      setFilterOptions(opt);
    }
  }, [proceduresIdSliceData, filterFieldName]);

  React.useEffect(() => {
    setLoading(true);
    let payload: any = {
      page: 1,
      perPage: 10,
      search: inputValue !== "undefined" ? inputValue : "",
    };
    if (filterFieldName === "Procedure name") {
      setLoading(true);
      payload["searchBy"] = "name";
    } else if (filterFieldName === "Procedure ID") {
      setLoading(true);
      payload["searchBy"] = "procedureNumber";
    }

    if (
      loginUserSliceData?.verifyToken?.role[0]?.name == "Tester" ||
      loginUserSliceData?.verifyToken?.role[0]?.name == "Requester"
    ) {
      payload["laboratoryId"] = singleUserData?.laboratoryId;
    }
    if (loginUserSliceData?.verifyToken?.role[0]?.name == "Admin") {
      payload["organisationId"] = singleUserData?.organisationId;
    }
    const getData = setTimeout(() => {
      dispatch(fetchProcedureData(payload))
        .then((res: any) => {
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
        });
    }, 1000);
    return () => clearTimeout(getData);
  }, [inputValue]);

  const handleInputChange = (event: any, newInputValue: any) => {
    // Fetch suggestions when the user types
    setInputValue(newInputValue !== "undefined" ? newInputValue : "");
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  // Avoid a layout jump when reaching the last page with empty rows.

  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  const handleSubmitFormPopup = () => {
    formPopupRef.current.open(false);
    successPopupRef.current.open(true, "Procedure");
    setTimeout(() => {
      successPopupRef.current.open(false, "Procedure");
    }, 3000);
  };

  const handleCloseTableHeader = (status: boolean) => {
    setTableHeaderVisible(status);
    const updatedRows = Rows.map((row: any) => ({
      ...row,
      is_checked: false,
    }));

    setSelectedRows(updatedRows);
    setIsDeselectAllChecked(true);
    setIsselectAllChecked(false);
  };

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

  const handleChange = (event: any, id: any) => {
    handleCheckboxChange(
      procedureData,
      setProcedureData,
      // setSelectedRows,
      setIsDeselectAllChecked,
      setIsselectAllChecked,
      setTableHeaderVisible,
      setVisibleRow
    )(event, id);
    // setVisibleRow(Data)
  };
  const handleDeChange = handleDeCheckboxChange(
    isDeselectAllChecked,
    procedureData,
    setProcedureData,
    // setSelectedRows,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setTableHeaderVisible,
    setRowId
    // setVisibleRow,
  );
  const handledAllchange = handledAllSelected(
    isselectAllChecked,
    procedureData,
    setProcedureData,
    // setSelectedRows,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setVisibleRow,
    setRowId
  );
  const handleCheckboxValues = (id: any) => {
    // Check if the ID is already in the selectedIds
    if (rowId.includes(id)) {
      // If it is, remove it
      setRowId(rowId.filter((rowId: any) => rowId !== id));
    } else {
      // If it's not, add it
      setRowId([...rowId, id]);
    }
  };
  const filters = (idVaule: any) => {
    if (Object.keys(idVaule).length !== 0) {
      const filteredRows = procedureData.filter(function (el: any) {
        if (el.procedureNumber == idVaule.assetNumber) {
          return true;
        }
        if (idVaule.search !== "") {
          if (el.name == idVaule.search) {
            return true;
          }
        } else {
          return true;
        }
      });
      setVisibleRow(filteredRows);
    } else {
      setVisibleRow(procedureData);
    }
  };

  const ProcedureVal: any = { _id: rowId };
  const handleDeleteConfirmation = async (state: any) => {
    if (state === 1) {
      await dispatch(deleteProcedureData(ProcedureVal));
      toast(`Procedure has been deleted successfully!`, {
        style: {
          background: "#00bf70",
          color: "#fff",
        },
      });
      // deleteSuccessPopupRef.current.open(true);
      // setTimeout(() => {
      // deleteSuccessPopupRef.current.open(false);
      // }, 3000);
      await reload();
      setTableHeaderVisible(false);
      // deletePopupRef.current.open(false);
    }
    deletePopupRef.current.open(false);
  };

  const handleOpenDeletePopup = () => {
    deletePopupRef.current.open(true, "procedures");
  };

  const clickHandler = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const createdAtTimestamp = "1699599706383";
  const localTime = moment(createdAtTimestamp).format("MM/DD/YYYY HH:mm:ss");

  const handleTableSorting = (_event: any, _data: any, _index: any) => {
    const payload: any = { ...queryStrings };
    const headersList: any = [...headers];
    payload["sortBy"] = headersList[_index].id;
    payload["sortOrder"] = headersList[_index].sort == "asc" ? "desc" : "asc";
    headersList[_index].sort =
      headersList[_index].sort === "asc" ? "desc" : "asc";
    setHeaders(headersList);
    setQueryString(payload);
  };

  const applyFilters = (key: any, value: any) => {
    const payload: any = { ...queryStrings };
    payload["searchBy"] = key;
    payload["page"] = 1;
    payload["search"] =
      typeof value === "string" ? value : moment(value).format("MM/DD/YYYY");
    setQueryString(payload);
    setFilter(true);
  };
  const reload = () => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    setPageInfo(page);
    setQueryString(payload);
    setRowId([]);
    getAllProcedures();
  };

  const getFilterOptions = (data: any, key: string) => {
    const result: any = [];
    data.forEach((element: any) => {
      result.push({
        id: element.name,
        name: element.name,
        value: element[key],
      });
    });
    return result;
  };
  const filteredData = headers.filter((item: any) => item.is_show !== false);

  return (
    <>
      <Box className="main-padding">
        <Box className="title-main">
          <Typography>Procedures</Typography>
          <div className="buttonFilter">
            {/* {rowId.length !== 0 ? (
              <Button
                variant="contained"
                onClick={() => {
                  let SelectedRow: any = [];
                  rowId.forEach((ri: any) => {
                    SelectedRow = procedureData.filter(
                      (item: any) => item._id === ri,
                    );
                  });
                  formPopupRef.current.open(true, SelectedRow[0], rowId[0]);
                }}
              >
                <AddIcon sx={{ mr: 1 }} />
                Duplicate 
              </Button>
            ) : ( */}
            <Button
              variant="contained"
              onClick={() => {
                formPopupRef.current.open(true);
              }}
              disabled={!credencial?.procedure_management?.create}
            >
              <AddIcon sx={{ mr: 1 }} />
              Create Procedure
            </Button>
            {/* )} */}
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
                          setFilterSearchValue(null);
                          setFilterSearchBy(event.target?.value);
                          setFilterFieldName(data.props.children);
                          setValuesName(null);
                          if (event.target?.value === "laboratoryId") {
                            setFilterOptions(
                              getFilterOptions(labSliceData, "_id")
                            );
                          }
                          if (event.target?.value === "departmentId") {
                            setFilterOptions(
                              getFilterOptions(departmentSliceData, "_id")
                            );
                          } else if (
                            event.target?.value === "procedureNumber"
                          ) {
                            const result: any = [];
                            proceduresIdSliceData.Procedures.forEach(
                              (element: any) => {
                                result.push({
                                  id: element.procedureNumber,
                                  label: element.procedureNumber,
                                  value: element.procedureNumber,
                                });
                              }
                            );
                            setFilterOptions(result);
                          } else if (event.target?.value === "name") {
                            setFilterOptions(
                              getFilterOptions(
                                proceduresIdSliceData.Procedures,
                                "name"
                              )
                            );
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
                              onSelectedSectionsChange={() => {
                                if (filterSearchValueRef.current) {
                                  filterSearchValueRef.current.disabled = true;
                                }
                              }}
                              inputRef={filterSearchValueRef}
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
                          {filterOptions.map((element: any, index) => (
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
          module="procedures"
          applyFilters={applyFilters}
        />
        <Box className="table-outer" sx={{ width: "100%" }}>
          {/* <Grid container mt={4}>
            <Grid item lg={6} xs={11} margin="auto">
              <EnhancedTable columns={headers} />
            </Grid>
          </Grid> */}
          <TableContainer className="tableHeight">
            <Table
              sx={{ minWidth: 750, position: "relative" }}
              aria-labelledby="tableTitle"
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
                // filters={filters}
                handleTableSorting={handleTableSorting}
              />
              {loader ? (
                <TableBody>
                  <TableSkeleton
                    columns={filteredData}
                    image={false}
                    rows={queryStrings.perPage}
                  />
                </TableBody>
              ) : !procedureData ||
                (procedureData?.length === 0 && loader == false) ? (
                <TableBody>
                  {/* <p style={{ textAlign: 'center', position: 'absolute', left: '0rem', right: '0rem' }}> */}
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
                      Procedures not found.
                    </Typography>
                  </Box>
                  {/* </p> */}
                </TableBody>
              ) : (
                <TableBody>
                  {procedureData?.map((row: any, index: number) => {
                    // const isItemSelected = isSelected(row.name);
                    // const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      row.isDeleted !== true && (
                        <TableRow
                          hover
                          // onClick={(event) => handleClick(event, row.name, index)}
                          // aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={index}
                          // selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                          onClick={(e: any) =>
                            credencial?.procedure_management?.view &&
                            navigate(`/procedures/details/${row._id}`, {
                              state: { props: row },
                              // state: { props: row, queries:queryStrings },
                            })
                          }
                        >
                          {headers[0].is_show && (
                            <TableCell scope="row">
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box sx={{ mt: 0, mr: 1 }}>
                                  <Checkbox
                                    color="primary"
                                    checked={
                                      row.is_checked == true ? true : false
                                    }
                                    onClick={(e: any) => clickHandler(e)}
                                    onChange={(event) => {
                                      // Procedure.push(row._id)
                                      handleCheckboxValues(row._id);
                                      handleChange(event, row._id);
                                    }}
                                  />
                                </Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box>
                                    <Box>{row.procedureNumber}</Box>
                                  </Box>
                                </Box>
                              </Box>
                            </TableCell>
                          )}

                          {headers[1].is_show && (
                            <TableCell>
                              <Box>{row.name}</Box>
                            </TableCell>
                          )}
                          {headers[2].is_show && (
                            <TableCell>
                              {row.departmentId.length !== 0 &&
                              row.departmentId[0] !== null ? (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                  onClick={(_event) => {
                                    _event.preventDefault();
                                    _event.stopPropagation();
                                    tablePopupRef.current?.open(
                                      true,
                                      "departments",
                                      row.departmentId
                                    );
                                  }}
                                >
                                  <>
                                    <Chip
                                      key={index}
                                      label={row.departmentId[0].name}
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
                              {row.laboratoryId.length !== 0 &&
                              row.laboratoryId[0] !== null ? (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                  onClick={(_event) => {
                                    _event.preventDefault();
                                    _event.stopPropagation();
                                    tablePopupRef.current?.open(
                                      true,
                                      "lab",
                                      row.laboratoryId
                                    );
                                  }}
                                >
                                  <>
                                    <Chip
                                      key={index}
                                      label={row.laboratoryId[0].name}
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
                              {/* {moment(parseInt(row.createdAt)).format(
                                'MM/DD/YYYY',
                              )} */}
                              {row.createdOn}
                            </TableCell>
                          )}
                          {headers[5].is_show && (
                            <TableCell> {row.createdByName}</TableCell>
                          )}
                        </TableRow>
                      )
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            currentPage={currentPage}
            perPage={queryStrings.perPage}
            handlePageChange={handlePageChange}
            currentPageNumber={queryStrings.page}
            totalRecords={procedureData?.length}
            page={pageInfo}
          />
        </Box>
        <ProcedureForm
          type="create"
          ref={formPopupRef}
          closeFormPopup={handleCloseFormPopup}
          submitFormPopup={handleSubmitFormPopup}
          reload={reload}
        />
        <Box>
          <DeletePopup
            rowId={rowId}
            ref={deletePopupRef}
            closeDeletePopup={() =>
              deletePopupRef.current.open(false, "procedures", rowId)
            }
            deleteConfirmation={handleDeleteConfirmation}
          />
        </Box>
        <TablePopup ref={tablePopupRef} />
        <DeleteSuccessPopup ref={deleteSuccessPopupRef} />
        <TablePopup ref={tablePopupRef} />
      </Box>
    </>
  );
}
