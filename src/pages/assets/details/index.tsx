import React from "react";
import PrivateRoute from '../../../components/PrivateRoute'
import Successpopup from "../../../components/SuccessPopup"
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import test from '../../../assets/images/test.svg'


import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { Pagination } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import search from "../../assets/images/search.svg"
import Runs from "../../runs";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// table start 
interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Data {
  return {
    name,
    calories,
    fat,
    carbs,
    protein
  };
}
const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0)
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

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}
const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Runs details"
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Last used"
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "User ID"
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Username"
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Status"
  }
];
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  const Placeholder = ({ children }: any) => {

    return <div>{children}</div>;
  };

  const [answer, setAnswer] = React.useState("");

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <>
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "center" : "left"}
              padding={headCell.disablePadding ? "normal" : "normal"}
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
              <TableRow sx={{ width: '100%', display: 'block' }}>
                <TableCell padding="none" sx={{ border: '0px', width: '100%', display: 'block' }}>
                  <Box sx={{ width: '100%' }}>
                    <FormControl>
                      <Select
                      MenuProps={{                   
                        disableScrollLock: true,                   
                        marginThreshold: null
                      }}
                        labelId="table-select-label"
                        id="table-select"
                        value={answer}
                        displayEmpty
                        IconComponent={ExpandMoreOutlinedIcon}
                        onChange={event => setAnswer(event.target.value)}
                        renderValue={
                          answer !== "" ? undefined : () => <Placeholder>Asset ID</Placeholder>
                        }
                      >
                        <MenuItem value={"1"}>1</MenuItem>
                        <MenuItem value={"2"}>2</MenuItem>
                        <MenuItem value={"3"}>3</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
              </TableRow>
            </TableCell>

          </>
        ))}
      </TableRow>
    </TableHead>
  );
}
// table end


export default function AssetDetails() {
  const [value, setValue] = React.useState(0);
  const [answers, setAnswers] = React.useState("");
  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [openSuccess, setSuccessOpen] = React.useState(false);

  // table start 
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("calories");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const [openDlg1Dialog, setDialog1Open] = React.useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  // table end 

  return (
    <PrivateRoute>
      <Box className="main-padding">
        <Successpopup open={openSuccess} close={() => setSuccessOpen(false)} />
        <Box className="title-main" sx={{ borderBottom: '3px solid #F3F3F3', paddingBottom: '1rem' }}>
          <Box>
            <Typography>Asset details</Typography>
            <Typography className="sub-text">Edit your assets and can view its usage history.</Typography>
          </Box>
        </Box>
        <Box sx={{ width: '100%', marginTop: '1rem' }}>
          <Box sx={{ borderBottom: 0 }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile aria-label="tabs-common" className='tabs-common' >
              <Tab label="Edit details" {...a11yProps(0)} />
              <Tab label="History" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
              <Grid item xs={12} sm={12} md={4} lg={3} xl={3} sx={{ padding: '0px !important', paddingRight: { xs: '0px !important', md: '30px !important' } }}>
                <Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <img src={test} alt="test" className="dynamic-img" />
                  </Box>
                  <Box className='edit-profile-btn' sx={{ mt: 3, mb: 3, pb: '0px !important' }}>
                    <Button>Upload photo</Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={6} xl={5} sx={{ padding: '0px !important', paddingTop: { xs: '30px !important', md: '0px !important' } }}>
                <Box>
                  <Grid container spacing={2} className='asset-popup'>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box>
                        <label>Name</label>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="name"
                          name="name"
                          autoComplete="off"
                          autoFocus
                          InputLabelProps={{ shrink: false }}
                          placeholder="Assets name"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className='asset-popup'>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box className='asset-id'>
                        <label>Asset Id (autogenerated)</label>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="Email"
                          name="Email"
                          autoComplete="off"
                          inputProps={{ maxLength: 50 }}
                          autoFocus
                          InputLabelProps={{ shrink: false }}
                          placeholder="Asset Id"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className='asset-popup calender-sec'>
                    <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingRight: { sm: '1rem !important' } }}>
                      <Box>
                        <label>Purchase date</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker disablePast format='MM/DD/YYYY' />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingLeft: { sm: '1rem !important' }, paddingTop: { xs: '0rem !important', sm: '1rem !important' } }}>
                      <Box>
                        <label>Guaranty/warranty/expiry date</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker disablePast format='MM/DD/YYYY'/>
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className='asset-popup'>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box>
                        <label style={{ display: 'block' }}>Organisation</label>
                        <FormControl sx={{ width: '100%' }}>
                          <Select
                          MenuProps={{                   
                            disableScrollLock: true,                   
                            marginThreshold: null
                          }}
                            className="placeholder-color"
                            labelId="tselect-popup-label"
                            id="select-popup"
                            value={answers}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={event => setAnswers(event.target.value)}
                            renderValue={
                              answers !== "" ? undefined : () => <Placeholder>Organisation</Placeholder>
                            }
                          >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"2"}>2</MenuItem>
                            <MenuItem value={"3"}>3</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className='asset-popup'>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box>
                        <label style={{ display: 'block' }}>Department/s</label>
                        <FormControl sx={{ width: '100%' }}>
                          <Select
                          MenuProps={{                   
                            disableScrollLock: true,                   
                            marginThreshold: null
                          }}
                            labelId="tselect-popup-label"
                            id="select-popup"
                            value={answers}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={event => setAnswers(event.target.value)}
                            renderValue={
                              answers !== "" ? undefined : () => <Placeholder>Select department</Placeholder>
                            }
                          >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"2"}>2</MenuItem>
                            <MenuItem value={"3"}>3</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className='asset-popup'>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box>
                        <label style={{ display: 'block' }}>Laboratory/ies</label>
                        <FormControl sx={{ width: '100%' }}>
                          <Select
                          MenuProps={{                   
                            disableScrollLock: true,                   
                            marginThreshold: null
                          }}
                            labelId="tselect-popup-label"
                            id="select-popup"
                            value={answers}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={event => setAnswers(event.target.value)}
                            renderValue={
                              answers !== "" ? undefined : () => <Placeholder>Select lab</Placeholder>
                            }
                          >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"2"}>2</MenuItem>
                            <MenuItem value={"3"}>3</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className='asset-popup'>
                    <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingRight: { sm: '1rem !important' } }}>
                      <Box>
                        <label style={{ display: 'block' }}>Status</label>
                        <FormControl sx={{ width: '100%' }}>
                          <Select
                          MenuProps={{                   
                            disableScrollLock: true,                   
                            marginThreshold: null
                          }}
                            className="placeholder-color"
                            labelId="tselect-popup-label"
                            id="select-popup"
                            value={answers}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={event => setAnswers(event.target.value)}
                            renderValue={
                              answers !== "" ? undefined : () => <Placeholder>Select status</Placeholder>
                            }
                          >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"2"}>2</MenuItem>
                            <MenuItem value={"3"}>3</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingLeft: { sm: '1rem !important' }, paddingTop: { xs: '0rem !important', sm: '1rem !important' } }}>
                      <Box>
                        <label style={{ display: 'block' }}>Availability</label>
                        <FormControl sx={{ width: '100%' }}>
                          <Select
                          MenuProps={{                   
                            disableScrollLock: true,                   
                            marginThreshold: null
                          }}
                            className="placeholder-color"
                            labelId="tselect-popup-label"
                            id="select-popup"
                            value={answers}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={event => setAnswers(event.target.value)}
                            renderValue={
                              answers !== "" ? undefined : () => <Placeholder>Select availability</Placeholder>
                            }
                          >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"2"}>2</MenuItem>
                            <MenuItem value={"3"}>3</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <Box className="edit-details">
              <Button type="submit" variant="contained" className="cancel-btn">Back</Button>
              <Button type="submit" variant="contained" className="add-btn">Save</Button>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box className="asset-id-name">
              <img src={test} alt="test" className="dynamic-img" />
              <Box className='asset-name'>
                <Typography>Asset ID</Typography>
                <Typography>Asset name</Typography>
              </Box>
            </Box>
            <Box className="table-outer" sx={{ width: "100%" }}>
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    numSelected={selected?.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows?.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.name)}
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.name}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell align="center">{row.calories}</TableCell>
                          <TableCell align="center">{row.fat}</TableCell>
                          <TableCell align="center">{row.carbs}</TableCell>
                          <TableCell align="center">{row.protein}</TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (dense ? 33 : 53) * emptyRows
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box className="show-page">
                <Typography>Showing 09 out of 100</Typography>
                <Pagination count={9} siblingCount={0} boundaryCount={1} variant="outlined" shape="rounded" />
              </Box>
            </Box>
          </CustomTabPanel>
        </Box>
      </Box>
    </PrivateRoute>
  );
}