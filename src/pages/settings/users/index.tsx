import React from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Table from '@mui/material/Table';
import TablePagination from '../../../components/table/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddIcon from '@mui/icons-material/Add';
import { withSettingsLayout } from '../../../components/settings';
import TableHeader from '../../../components/table/TableHeader';
import { StatusList, UserHeaders, UserRows } from '../../../utils/data';
import { UserRowData } from '../../../modals/user.modal';
import TableFilters from '../../../components/table/TableFilters';
import DeletePopup from '../../../components/DeletePopup';
import UserForm from './UserForm';
import {
  fetchUserData,
  deleteUserData,
  fetchUpdateUserData,
} from '../../../api/userAPI';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
} from '../../../utils/common-services';
import moment from 'moment';
import TableSkeleton from '../../../components/table/TableSkeleton';
// table start
import filterIcon from '../../../assets/images/filter-icon1.svg';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import userr from '../../../assets/images/profile/profile.svg';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Emptystate from '../../../assets/images/Emptystate.svg';
import { fetchOrganizationById } from '../../../api/organizationAPI';

const users: UserRowData[] = UserRows;
const userStatus = StatusList;

const Users = () => {
  const dispatch: any = useDispatch();
  const [headers, setHeaders] = React.useState(UserHeaders);
  const [Rows, setSelectedRows] = React.useState(users);
  const [isDeselectAllChecked, setIsDeselectAllChecked] = React.useState(false);
  const [isselectAllChecked, setIsselectAllChecked] = React.useState(false);
  const [isTableHeaderVisible, setTableHeaderVisible] = React.useState(false);
  const handleRequestSort = () => {};
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const filterSearchValueRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const deletePopupRef: any = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [userData, setUserData] = React.useState<any>([]);
  const [loader, setLoader] = React.useState(false);
  const [filterOptions, setFilterOptions] = React.useState<any>([]);
  const [filterStatus, setFilterStatus] = React.useState(null);
  const [filterSearchBy, setFilterSearchBy] = React.useState(null);
  const [filterSearchValue, setFilterSearchValue] = React.useState(null);
  const [filterFieldName, setFilterFieldName] = React.useState('');
  const [filterType, setFilterType] = React.useState(null);
  const [filterAvailability, setFilterAvailability] = React.useState(null);
  const [filterKey, setFilterKey] = React.useState<any>(null);
  const [filter, setFilter] = React.useState<any>(false);

  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const [columnAnchorEl, setColumnAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [filterPopoverEl, setFilterPopoverEl] =
    React.useState<null | HTMLElement>(null);
  const filterAnchorOpen = Boolean(filterPopoverEl);
  const [queryStrings, setQueryString] = React.useState({
    page: 1,
    perPage: 10,
    searchBy: null,
    search: null,
    sortBy: null,
    sortOrder: 'desc',
    organisationId:loginUserSliceData?.verifyToken?.organisationId,
    instituteId: loginUserSliceData?.verifyToken?.instituteId,
  });

  const [pageInfo, setPageInfo] = React.useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const userSliceData = useSelector((state: any) => state.userData.data);

  const Data = Rows.slice(startIndex, endIndex);
  const [rowId, setRowId] = React.useState<any>([]);

  const [visibleRow, setVisibleRow] = React.useState<any>(userData);

  const roleSliceData = useSelector(
    (state: any) => state.role.data?.find_roles,
  );
  const organizationSliceData = useSelector(
    (state: any) => state.organization.data?.get_all_organisations,
  );
  const [organizationData,setOrganizationData]=React.useState('')
  React.useEffect(() => {
  dispatch(
    fetchOrganizationById({ instituteId: loginUserSliceData?.instituteId }),
  );

}, [loginUserSliceData]);
  React.useEffect(() => {
    userData && setUserData(userData);
  }, [userData]);
  React.useEffect(() => {
    var organization = organizationSliceData?.filter(
      (organization: any) =>
        organization._id === loginUserSliceData?.verifyToken?.organisationId,
    );
    
    setOrganizationData(
      organization)
    
  }, [organizationSliceData]);
  
  React.useEffect(() => {
    return () => {
      const headersList: any = [...headers];
      headersList.map((item: any) => {
        return (item.sort = 'asc');
      });
      setHeaders(headersList);
    };
  }, []);

  React.useEffect(() => {
    if (filterSearchValueRef.current) {
      filterSearchValueRef.current.disabled = true;
    }
  }, [filterSearchValueRef.current]);

  const credencial = loginUserSliceData?.verifyToken?.role[0];

  React.useEffect(() => {
    setLoader(true);
    dispatch(fetchUserData(queryStrings));
    setTableHeaderVisible(false);
    setRowId([]);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, [queryStrings]);

  React.useEffect(() => {
    const page: any = { ...pageInfo };
    page['currentPage'] = userSliceData?.get_all_users?.pageInfo.currentPage;
    page['totalPages'] = userSliceData?.get_all_users?.pageInfo.totalPages;
    page['hasNextPage'] = userSliceData?.get_all_users?.pageInfo.hasNextPage;
    page['hasPreviousPage'] =
      userSliceData?.get_all_users?.pageInfo.hasPreviousPage;
    page['totalCount'] = userSliceData?.get_all_users?.pageInfo.totalCount;
    userSliceData?.get_all_users?.Identity &&
      setUserData(userSliceData?.get_all_users?.Identity);
    setPageInfo(page);
  }, [userSliceData]);

  const handlePageChange = (even: any, page_no: number) => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    payload['page'] = page_no;
    page['currentPage'] = page_no;
    setPageInfo(page);
    setQueryString(payload);
    setCurrentPage(page_no);
  };

  const handleChange = (event: any, id: any) => {
    handleCheckboxChange(
      userData,
      setUserData,
      setIsDeselectAllChecked,
      setIsselectAllChecked,
      setTableHeaderVisible,
      setVisibleRow,
    )(event, id);
  };

  const handleCheckboxValues = (id: any) => {
    if (rowId.includes(id)) {
      setRowId(rowId.filter((rowId: any) => rowId !== id));
    } else {
      setRowId([...rowId, id]);
    }
  };

  const handleDeChange = handleDeCheckboxChange(
    isDeselectAllChecked,
    userData,
    setUserData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setTableHeaderVisible,
    setVisibleRow,
  );
  const handledAllchange = handledAllSelected(
    isselectAllChecked,
    userData,
    setUserData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setVisibleRow,
    setRowId,
  );

  const handleTableSorting = (_event: any, _data: any, _index: any) => {
    const payload: any = { ...queryStrings };
    const headersList: any = [...headers];
    payload['sortBy'] = headersList[_index].id;
    payload['sortOrder'] = headersList[_index].sort === 'asc' ? 'desc' : 'asc';
    headersList[_index].sort =
      headersList[_index].sort === 'asc' ? 'desc' : 'asc';
    setHeaders(headersList);
    setQueryString(payload);
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

  const reload = () => {
    dispatch(fetchUserData(queryStrings));
  };

  const handleCloseTableHeader = (status: boolean) => {
    setTableHeaderVisible(status);
    const updatedRows = userData.map((row: any) => ({
      ...row,
      is_checked: false,
    }));
    setUserData(updatedRows);
    setIsDeselectAllChecked(true);
    setIsselectAllChecked(false);
  };
  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  const handleSubmitFormPopup = () => {
    formPopupRef.current.open(false);
    successPopupRef.current.open(true, 'User');
    setTimeout(() => {
      successPopupRef.current.open(false, 'User');
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
  const assetVal: any = { _id: rowId };

  const handleDeleteConfirmation = async (state: any) => {
    if (state === 1) {
      await dispatch(deleteUserData(assetVal));
      toast(`User has been deleted successfully!`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
      setRowId([]);
      await reload();
      setTableHeaderVisible(false);
    }
    deletePopupRef.current.open(false);
  };
  const handleOpenDeletePopup = () => {
    deletePopupRef.current.open(true, 'User');
  };

  const applyFilters = (field: any, value: any) => {
    const payload: any = { ...queryStrings };
    payload['searchBy'] = field;
    payload['page'] = 1;
    payload['search'] =
      typeof value === 'string' ? value : moment(value).format('MM/DD/YYYY');
    setQueryString(payload);
    setFilter(true);
  };
  const clickHandler = (e: MouseEvent) => {
    e.stopPropagation();
  };
  const handleOnChange = (e: any, row: any) => {
    var assetsChange: any = {
      _id: row._id,
    };
    assetsChange['status'] = e.target.value;

    dispatch(fetchUpdateUserData(assetsChange));
    toast(`User status has been updated successfully!`, {
      style: {
        background: '#00bf70',
        color: '#fff',
      },
    });
    reload();
  };
  const handleFilterPopoverClose = () => {
    setFilterPopoverEl(null);
  };

  const handleFilterPopoverClick = (
    event: React.MouseEvent<HTMLButtonElement>,
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
    applyFilters('search', '');
    handleFilterPopoverClose();
    setFilterKey(null);
    setFilter(false);
  };

  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };
  const inputValue = 'someValue';

  const dataArray = ['value1', 'value2', 'someValue', 'value3'];

  const filteredArray = dataArray.filter((value) => value !== inputValue);

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
    <Box
      className="user-setting-page"
      style={{ padding: '24px', paddingTop: '15px' }}
    >
      <Box
        className="title-main"
        sx={{ borderBottom: '1px solid #F3F3F3', paddingBottom: '8px' }}
      >
        <Box>
          <Typography>User settings</Typography>
          <Typography className="sub-text">
            Create, edit and delete users.
          </Typography>
        </Box>
        <div className="buttonFilter">
          <Button
            style={{ marginBottom: '8px', marginTop: '16px' }}
            type="submit"
            variant="contained"
            onClick={() => {
              formPopupRef.current.open(true, 'create', {});
            }}
            disabled={!credencial?.user_management?.create}
          >
            <AddIcon sx={{ mr: 1 }} />
            Create User
          </Button>
          <Box sx={{ position: 'relative' }}>
            <Button
              variant="contained"
              onClick={handleFilterPopoverClick}
              style={{
                boxShadow: 'none',
                backgroundColor: 'white',
                padding: '0px',
                justifyContent: 'center',
              }}
              className="filterButton"
            >
              <Badge
                color="secondary"
                variant={filter ? 'dot' : 'standard'}
                invisible={false}
                className="red-badge-filter"
              >
                <img
                  src={filterIcon}
                  alt="no_image"
                  style={{
                    width: '25px',
                    height: '25px',
                    opacity: 0.9,
                    cursor: 'pointer',
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #d0d0d0',
                    alignContent: 'center',
                    padding: '1rem',
                  }}
                >
                  <Typography fontWeight={600} variant="body1">
                    Filters
                  </Typography>
                  <CloseIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={handleFilterPopoverClose}
                  />
                </Box>
                <Box sx={{ padding: '0rem 1rem 1rem 1rem' }}>
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
                        if (event.target?.value === 'role') {
                          setFilterOptions(getFilterOptions(roleSliceData));
                        }
                        if (event.target?.value === 'organisationId') {
                          setFilterOptions(
                            getFilterOptions(organizationData),
                          );
                        }
                        if (event.target?.value === 'status') {
                          setFilterOptions(StatusList);
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
                        {filterType === 'text'
                          ? `Search ${filterFieldName}`
                          : filterType === 'date'
                          ? `Date ${filterFieldName}`
                          : `Select ${filterFieldName}`}
                      </Typography>
                    )}

                    {filterType === null ? null : filterType === 'text' ? (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="Search"
                        id="Search"
                        style={{ margin: '0px' }}
                        InputLabelProps={{ shrink: false }}
                        placeholder="Search"
                        size="small"
                        value={filterSearchValue}
                        autoComplete="off"
                        onChange={(event: any) =>
                          setFilterSearchValue(event.target.value)
                        }
                      />
                    ) : filterType === 'date' ? (
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
                        {filterOptions.map((element: any, index: number) => (
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
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #d0d0d0',
                    alignContent: 'center',
                    padding: '1rem',
                  }}
                >
                  <Button
                    style={{
                      border: '1px solid #d3d3d3',
                      color: '#181818',
                      textTransform: 'capitalize',
                    }}
                    onClick={handleClearFilter}
                  >
                    Clear
                  </Button>
                  <Button
                    style={{
                      border: '1px solid #d3d3d3',
                      background: '#FFC60B',
                      color: '#181818',
                      textTransform: 'capitalize',
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
        module="users"
        applyFilters={applyFilters}
        status={userStatus}
      />

      <Box className="table-outer" sx={{ width: '100%' }}>
        <TableContainer className="userTableHeight">
          <Table
            sx={{ minWidth: 750, position: 'relative' }}
            aria-labelledby="tableTitle"
            size="medium"
            stickyHeader
          >
            <TableHeader
              numSelected={0}
              onRequestSort={handleRequestSort}
              onSelectAllClick={function (
                event: React.ChangeEvent<HTMLInputElement>,
              ): void {
                throw new Error('Function not implemented.');
              }}
              order={'asc'}
              orderBy={''}
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
            ) : !userData || (userData?.length === 0 && loader == false) ? (
              <TableBody>
                <Box
                  sx={{
                    textAlign: 'center',
                    position: 'absolute',
                    left: '0rem',
                    right: '0rem',
                    padding: '10%',
                    width: '100%',
                  }}
                >
                  <img src={Emptystate} alt="" />
                  <Typography className="no-remainder">
                    Users not found.
                  </Typography>
                </Box>
                {/* </p> */}
              </TableBody>
            ) : (
              <TableBody>
                {userData?.map((row: any, index: number) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      sx={{ cursor: 'pointer' }}
                      onClick={(e: any) =>
                        formPopupRef.current.open(
                          credencial?.user_management?.edit,
                          'edit',
                          row,
                        )
                      }
                    >
                      {headers[0].is_show && (
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mt: 0, mr: 1 }}>
                              <Checkbox
                                color="primary"
                                checked={row.is_checked == true ? true : false}
                                onClick={(e: any) => clickHandler(e)}
                                onChange={(event) => {
                                  handleCheckboxValues(row._id),
                                    handleChange(event, row._id);
                                }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box>
                                <img
                                  src={
                                    row?.imageUrl !== null &&
                                    row.imageUrl !== ''
                                      ? row?.imageUrl
                                      : userr
                                  }
                                  alt="no_image"
                                  style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '28px',
                                  }}
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
                                <Box>{row?.fullName}</Box>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      {headers[1].is_show && (
                        <TableCell align="center">{row.email}</TableCell>
                      )}
                      {headers[2].is_show && (
                        <TableCell align="center">
                          {organizationSliceData?.find(
                            (obj: any) => obj._id == row.organisationId,
                          )?.name }
                        </TableCell>
                      )}
                      {headers[3].is_show && (
                        <TableCell align="center">{row.createdOn}</TableCell>
                      )}
                      {headers[4].is_show && (
                        <TableCell align="center">
                          {roleSliceData?.find(
                            (obj: any) => obj._id == row.role,
                          )?.name || 'Tester'}
                        </TableCell>
                      )}
                      {headers[5].is_show && (
                        <TableCell>
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            className={
                              row.status == 'Active'
                                ? 'active-select td-select'
                                : 'inactive-select td-select'
                            }
                            value={row.status == null ? 'Inactive' : row.status}
                            displayEmpty
                            onChange={(e) => handleOnChange(e, row)}
                            onClick={(e: any) => clickHandler(e)}
                            IconComponent={ExpandMoreOutlinedIcon}
                          >
                            <MenuItem value={'Active'} key={'Active'}>
                              Active
                            </MenuItem>
                            <MenuItem value={'Inactive'} key={'Inactive'}>
                              In-Active
                            </MenuItem>
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
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
          totalRecords={userData?.length}
          page={pageInfo}
        />
      </Box>
      <Box>
        <UserForm
          ref={formPopupRef}
          reload={reload}
          closeFormPopup={handleCloseFormPopup}
          submitFormPopup={handleSubmitFormPopup}
        />
      </Box>
      <Box>
        <DeletePopup
          rowId={rowId}
          ref={deletePopupRef}
          closeDeletePopup={() =>
            deletePopupRef.current.open(false, 'User', rowId)
          }
          deleteConfirmation={handleDeleteConfirmation}
        />
      </Box>
    </Box>
  );
};

const UsersPage = withSettingsLayout(Users);

export default UsersPage;
