import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  Autocomplete,
  FormControl,
  Pagination,
  InputAdornment,
  Select,
  TextField,
  MenuItem,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { ProceduresRowData } from '../../modals/Procedures.modal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ProceduresHeaders } from '../../utils/data';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import search from '../../assets/images/search.svg';

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  ...draggableStyle,
});

const getListStyle = (isDraggingOver: any) => ({
  // background: isDraggingOver ? 'lightblue' : 'lightgrey',
  // display: 'flex',
  // padding: grid,
  overflow: 'auto',
});
function createData(
  is_checked: boolean,
  id: string,
  name: string,
  procedureNumber: string,
  procedureDetials: string,
  departmentId: string,
  laboratoryID: string,
  assestId: string,
  userID: string,
  extraData: string,
  isActive: number,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
): ProceduresRowData {
  return {
    is_checked,
    id,
    name,
    procedureNumber,
    procedureDetials,
    departmentId,
    laboratoryID,
    assestId,
    userID,
    extraData,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
  };
}

const rows = [
  createData(
    false,
    '1',
    'MD5 Algorithm',
    'ID1001',
    '',
    'DEPT-1001',
    'LAB-1001',
    '',
    '',
    '',
    1,
    'Username',
    '02/10/2023',
    '',
  ),
  createData(
    false,
    '2',
    'MD5 Algorithm',
    'ID1002',
    '',
    'DEPT-1002',
    'LAB-1001',
    '',
    '',
    '',
    1,
    'Username',
    '02/10/2023',
    '',
  ),
  createData(
    false,
    '3',
    'SHA256 Algorithm',
    'ID1002',
    '',
    'DEPT-1003',
    'LAB-1002',
    '',
    '',
    '',
    1,
    'Username',
    '02/10/2023',
    '',
  ),
  createData(
    false,
    '4',
    'Crypto Algorithm',
    'ID1003',
    '',
    'DEPT-1003',
    'LAB-1004',
    '',
    '',
    '',
    2,
    'Username',
    '02/10/2023',
    '',
  ),
  createData(
    true,
    '5',
    'Data Mining',
    'ID1003',
    '',
    'DEPT-1002',
    'LAB-1003',
    '',
    '',
    '',
    2,
    'Username',
    '02/10/2023',
    '',
  ),
];
function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: any, orderBy: any) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any, comparator: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
}

function EnhancedTableHead(props: any) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    columns,
    setColumns,
  }: any = props;
  const [answer, setAnswer] = React.useState<any>({});

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      columns,
      result.source.index,
      result.destination.index,
    );

    setColumns([...items]);
  };
  const Placeholder = ({ children }: any) => {
    return <div style={{ fontSize: '12px' }}>{children}</div>;
  };
  return (
    <TableHead>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided: any, snapshot: any) => (
            <TableRow
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
              {columns?.map((headCell: any, index: any) => (
                <Draggable
                  key={headCell.id}
                  draggableId={headCell.id}
                  index={index}
                >
                  {(provided: any, snapshot: any) =>
                    headCell.is_show && (
                      <TableCell
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                        key={headCell.id}
                        align={'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                        >
                          {headCell.label}
                          {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc'
                                ? 'sorted descending'
                                : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                        <TableRow sx={{ width: '100%', display: 'block' }}>
                          <TableCell
                            padding="none"
                            sx={{
                              border: '0px',
                              width: '100%',
                              display: 'block',
                            }}
                            colSpan={headCell.colSpan}
                          >
                            <Box sx={{ width: '100%', display: 'flex' }}>
                              {headCell.filters.map(
                                (filter: any, index: any) => {
                                  if (filter.type === 'select') {
                                    return (
                                      <FormControl key={index}>
                                        <Select
                                          MenuProps={{
                                            disableScrollLock: true,
                                            marginThreshold: null,
                                          }}
                                          style={{ width: '140px' }}
                                          labelId="table-select-label"
                                          id="table-select"
                                          value={answer[filter.id] || ''}
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
                                              <Placeholder>
                                                {filter.label}
                                              </Placeholder>
                                            )
                                          }
                                        >
                                          {filter.options &&
                                            filter.options.map(
                                              (option: any, index: any) => (
                                                <MenuItem
                                                  key={index}
                                                  value={option.value}
                                                >
                                                  {option.value}
                                                </MenuItem>
                                              ),
                                            )}
                                        </Select>
                                      </FormControl>
                                    );
                                  } else if (filter.type === 'textfield') {
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
                                  } else if (filter.type === 'autocomplete') {
                                    return (
                                      <FormControl key={index}>
                                        <Autocomplete
                                          options={filter.options}
                                          getOptionLabel={(option: any) =>
                                            option.label
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              required
                                              fullWidth
                                              name="Search"
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
                                  } else if (filter.type === 'date') {
                                    return (
                                      <FormControl
                                        key={index}
                                        className="calender-sec"
                                      >
                                        <LocalizationProvider
                                          dateAdapter={AdapterDayjs}
                                        >
                                          <DatePicker
                                            format="MM/DD/YYYY"
                                            disablePast
                                          />
                                        </LocalizationProvider>
                                      </FormControl>
                                    );
                                  }
                                  return null;
                                },
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableCell>
                    )
                  }
                </Draggable>
              ))}
            </TableRow>
          )}
        </Droppable>
      </DragDropContext>
    </TableHead>
  );
}

// EnhancedTableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
//   columns:PropTypes.any
// };

function EnhancedTableToolbar(props: any) {
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
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
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

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props: any) {
  // const {column}=props
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [columns, setColumns] = useState<any>(props.columns);

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: any) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: any) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              columns={columns}
              setColumns={setColumns}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: any) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {columns?.map((item: any) => (
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row[item.id]}
                        </TableCell>
                      ))}
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
        <Box className="show-page">
          <Typography>Showing 09 out of 100</Typography>
          <Pagination
            count={9}
            siblingCount={0}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Paper>
    </Box>
  );
}
