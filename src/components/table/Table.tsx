import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import SuccessPopup from "../../components/SuccessPopup";
import Confirmationpopup from "../../components/ConfirmationPopup";
import ProcedureForm from "../../pages/procedures/ProcedureForm";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "../../assets/styles/css/procedure.css";
import { ProceduresRowData } from "../../modals/Procedures.modal";
import {
  handleCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
} from "../../utils/commonServices";
import { ProceduresHeaders } from "../../utils/data";
import { DepartmentList, LaboratoryList } from "../../utils/data";
import TableFilters from "../../components/table/TableFilters";
import TablePagination from "../../components/table/TablePagination";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import "../../assets/styles/css/App.css";
import "../../../src/assets/styles/css/App.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import search from "../../assets/images/search.svg";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router";

function createData(
  is_checked: boolean,
  _id: string,
  name: string,
  procedureNumber: string,
  procedureDetials: string,
  departmentId: any,
  laboratoryId: [string],
  assestId: string,
  userId: string,
  extraData: string,
  isActive: any,
  createdAt: string,
  updatedAt: string,
  deletedAt: string
): ProceduresRowData {
  return {
    is_checked,
    _id,
    name,
    procedureNumber,
    procedureDetials,
    departmentId,
    laboratoryId,
    assestId,
    userId,
    extraData,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
  };
}

const rows: any = [
  createData(
    false,
    "1",
    "MD5 Algorithm",
    "ID1001",
    "",
    ["DEPT-1001"],
    ["LAB-1001"],
    "",
    "",
    "",
    true,
    "Username",
    "02/10/2023",
    ""
  ),
  createData(
    false,
    "2",
    "MD5 Algorithm",
    "ID1002",
    "",
    ["DEPT-1002"],
    ["LAB-1001"],
    "",
    "",
    "",
    true,
    "Username",
    "02/10/2023",
    ""
  ),
  createData(
    false,
    "3",
    "SHA256 Algorithm",
    "ID1002",
    "",
    ["DEPT-1003"],
    ["LAB-1002"],
    "",
    "",
    "",
    true,
    "Username",
    "02/10/2023",
    ""
  ),
  createData(
    false,
    "4",
    "Crypto Algorithm",
    "ID1003",
    "",
    ["DEPT-1003"],
    ["LAB-1004"],
    "",
    "",
    "",
    true,
    "Username",
    "02/10/2023",
    ""
  ),
  createData(
    false,
    "5",
    "Data Mining",
    "ID1003",
    "",
    ["DEPT-1002"],
    ["LAB-1003"],
    "",
    "",
    "",
    true,
    "Username",
    "02/10/2023",
    ""
  ),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const getDepartment = (id: any) => {
  let data = DepartmentList.find((item) => item.id === id);
  return data?.name;
};

const getLaboratory = (id: any) => {
  let data = LaboratoryList.find((item) => item.id === id);
  return data?.name;
};
// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// const headCells =
//   ProceduresHeaders

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ProceduresRowData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: [];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;
  const createSortHandler =
    (property: keyof ProceduresRowData) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const [answer, setAnswer] = React.useState<any>({});

  const Placeholder = ({ children }: any) => {
    return <div style={{ fontSize: "12px" }}>{children}</div>;
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell: any) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
            <TableRow sx={{ width: "100%", display: "block" }}>
              <TableCell
                padding="none"
                sx={{ border: "0px", width: "100%", display: "block" }}
                colSpan={headCell.colSpan}
              >
                <Box sx={{ width: "100%", display: "flex" }}>
                  {headCell.filters.map((filter: any, index: any) => {
                    if (filter.type === "select") {
                      return (
                        <FormControl key={index}>
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            style={{ width: "140px" }}
                            labelId="table-select-label"
                            id="table-select"
                            value={answer[filter.id] || ""}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={(event) => {
                              setAnswer({
                                ...answer,
                                [filter.id]: event.target.value,
                              });
                            }}
                            renderValue={(selected) =>
                              selected ? (
                                selected
                              ) : (
                                <Placeholder>{filter.label}</Placeholder>
                              )
                            }
                          >
                            {filter.options &&
                              filter.options.map((option: any, index: any) => (
                                <MenuItem key={index} value={option.value}>
                                  {option.value}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      );
                    } else if (filter.type === "textfield") {
                      return (
                        <FormControl key={index}>
                          <TextField
                            required
                            fullWidth
                            name="Search"
                            id="Search"
                            placeholder={filter.label}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <img src={search} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </FormControl>
                      );
                    } else if (filter.type === "autocomplete") {
                      return (
                        <FormControl key={index}>
                          <Autocomplete
                            options={filter.options}
                            getOptionLabel={(option: any) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required
                                fullWidth
                                name="Search"
                                id="Search"
                                placeholder={filter.label}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <img src={search} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </FormControl>
                      );
                    } else if (filter.type === "date") {
                      return (
                        <FormControl key={index} className="calender-sec">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker format="DD/MM/YYYY" />
                          </LocalizationProvider>
                        </FormControl>
                      );
                    }
                    return null;
                  })}
                </Box>
              </TableCell>
            </TableRow>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const navigate = useNavigate();
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof ProceduresRowData>("name");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ProceduresRowData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n: any) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );
  const [Rows, setSelectedRows] = React.useState(rows);
  const [isDeselectAllChecked, setIsDeselectAllChecked] = React.useState(false);
  const [isselectAllChecked, setIsselectAllChecked] = React.useState(false);
  const [isTableHeaderVisible, setTableHeaderVisible] = React.useState(false);
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const handleDeChange = handleDeCheckboxChange(
    isDeselectAllChecked,
    Rows,
    setSelectedRows,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setTableHeaderVisible
  );
  const handledAllchange = handledAllSelected(
    isselectAllChecked,
    Rows,
    setSelectedRows,
    setIsDeselectAllChecked,
    setIsselectAllChecked
  );
  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  const handleSubmitFormPopup = () => {
    formPopupRef.current.open(false);
    successPopupRef.current.open(true, "Field");
    setTimeout(() => {
      successPopupRef.current.open(false, "Field");
    }, 3000);
  };

  const handleOpenConfirmationPopup = (state: any) => {
    confirmationPopupRef.current.open(state);
  };

  const handleConfirmationDone = (state: any) => {
    if (state === 1) {
      formPopupRef.current.open(false);
    }
    confirmationPopupRef.current.open(false);
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
  const handleChange = (event: any, id: any) => {
    handleCheckboxChange(
      Rows,
      setSelectedRows,
      setIsDeselectAllChecked,
      setIsselectAllChecked,
      setTableHeaderVisible
    )(event, id);
  };
  const handleMenuCheckboxChange = (e: any, index: any) => {
    setHeaders((prevColumns: any) => {
      return prevColumns.map((column: any, i: any) => {
        if (i === index) {
          return { ...column, is_show: !headCells[index].is_show };
        }
        return column;
      });
    });
  };
  const [headCells, setHeaders] = React.useState<any>(ProceduresHeaders);
  const [currentPage, setCurrentPage] = React.useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(Rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const Data = Rows.slice(startIndex, endIndex);
  const handlePageChange = (even: any, page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <Box className="main-padding">
        <Box className="title-main">
          <Typography>Procedures</Typography>
          <Button
            type="submit"
            variant="contained"
            onClick={() => formPopupRef.current.open(true)}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add
          </Button>
        </Box>
        <TableFilters
          columns={headCells}
          handleMenuCheckboxChange={handleMenuCheckboxChange}
          handleDeCheckboxChange={handleDeChange}
          handledAllSelected={handledAllchange}
          isDeselectAllChecked={isDeselectAllChecked}
          isselectAllChecked={isselectAllChecked}
          isTableHeaderVisible={isTableHeaderVisible}
          closeTableHeader={handleCloseTableHeader}
        />
        <Box className="table-outer" sx={{ width: "100%" }}>
          {/* <Paper sx={{ width: '100%', mb: 2 }}> */}
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={headCells}
              />
              <TableBody>
                {visibleRows.map((row: any, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      {headCells[0].is_show && (
                        <TableCell scope="row">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ mt: 0, mr: 1 }}>
                              <Checkbox
                                color="primary"
                                checked={row.is_checked}
                                // checked={row?.is_checked}
                                onChange={(event) =>
                                  handleChange(event, row.id)
                                }
                              />
                            </Box>
                            <Box
                              sx={{ display: "flex", alignItems: "center" }}
                              onClick={() =>
                                navigate(
                                  `/procedures/details/${row.procedureNumber}`
                                )
                              }
                            >
                              <Box sx={{ ml: 2 }}>
                                <Box>{row.procedureNumber}</Box>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      {headCells[1].is_show && (
                        <TableCell>
                          <Box>{row.name}</Box>
                        </TableCell>
                      )}
                      {headCells[2].is_show && (
                        <TableCell>{getDepartment(row.departmentId)}</TableCell>
                      )}
                      {headCells[3].is_show && (
                        <TableCell>{getLaboratory(row.laboratoryID)}</TableCell>
                      )}
                      {headCells[4].is_show && (
                        <TableCell>{row.updatedAt}</TableCell>
                      )}
                      {headCells[5].is_show && (
                        <TableCell>{row.createdAt}</TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* </P/aper> */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            currentPageData={Data}
            Rows={Rows}
          />
        </Box>
        <ProcedureForm
          ref={formPopupRef}
          closeFormPopup={handleCloseFormPopup}
          submitFormPopup={handleSubmitFormPopup}
          openConfirmationPopup={handleOpenConfirmationPopup}
        />
        <Confirmationpopup
          ref={confirmationPopupRef}
          confirmationDone={handleConfirmationDone}
        />
        <SuccessPopup ref={successPopupRef} />
      </Box>
    </>
  );
}
