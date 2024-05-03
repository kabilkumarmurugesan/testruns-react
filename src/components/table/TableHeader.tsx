/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { Box } from '@mui/material';
import '../../assets/styles/App.scss';
import { ProceduresRowData } from '../../modals/Procedures.modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentData } from '../../api/departmentAPI';
import { fetchLabData } from '../../api/labAPI';

export default function TableHeader(props: any) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    columns,
    // filters,
    handleTableSorting,
  } = props;
  const createSortHandler =
    (property: keyof ProceduresRowData) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

//   const [departmentData, setDepartmentData] = React.useState([]);
//   const [labData, setLabData] = React.useState([]);

//   const dispatch: any = useDispatch();

//   const departmentSliceData = useSelector(
//     (state: any) => state.department.data?.get_all_departments,
//   );
//   const labSliceData = useSelector(
//     (state: any) => state.lab.data?.get_all_labs,
//   );

//   React.useEffect(() => {
//     dispatch(fetchDepartmentData());
//     dispatch(fetchLabData());
//   }, []);

//   React.useEffect(() => {
//     setDepartmentData(
//       departmentSliceData?.map((item: any) => ({
//         label: item.name,
//         value: item._id,
//       })),
//     );
//     setLabData(
//       labSliceData?.map((item: any) => ({
//         label: item.name,
//         value: item._id,
//       })),
//     );
//   }, [departmentSliceData, labSliceData]);
// console.log(columns)
  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell: any, index: number) => (
          <>
            {headCell.is_show && (
              <TableCell
                key={index}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                id="tableFilter"
                sortDirection={headCell.sort}
              >
                 {headCell.label}
                {(headCell.id !== 'departmentId' && 
                headCell.id !== 'laboratoryId' && headCell.id !== "perchasedDate" && headCell.id !== "lastUsedDate" && headCell.id !== "createdOn" && headCell.id !== "createdOn" && headCell.id !== "dueDate") && (
                //   <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
                // ) : (
                  
                  <TableSortLabel
                    direction={headCell.sort}
                    onClick={(event) =>
                      handleTableSorting(event, headCell, index)
                    }
                    className='sort-section-head'
                  >
                    {/* {headCell.label} */}
                  </TableSortLabel>
                
                )}
                {/* <TableRow sx={{ width: "100%", display: "block" }}>
                <TableCell
                  padding="none"
                  sx={{ border: "0px", width: "100%", display: "block" }}
                  colSpan={headCell.colSpan}
                >
                  <Box sx={{ width: "100%", }}>
                    {headCell.filters.map((filter: any, index: any) => {
                      if (filter.type === "select") {
                        return (
                          <FormControl key={index}>
                            <Select
                              style={{ width: "140px" }}
                              labelId="table-select-label"
                              id="table-select"
                              value={answer[filter.id] || ""}
                              displayEmpty
                              name={filter.id}
                              IconComponent={ExpandMoreOutlinedIcon}
                              onChange={(event) => {
                                setAnswer({
                                  ...answer,
                                  [event.target.name]: event.target.value,
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
                                filter.options.map(
                                  (option: any, index: any) => (
                                    <MenuItem
                                      key={index}
                                      value={option.value}
                                    >
                                      {option.value}
                                    </MenuItem>
                                  )
                                )}
                            </Select>
                          </FormControl>
                        );
                      } else if (filter.type === "textfield") {
                        return (
                          <FormControl key={index}>
                            <TextField                              
                              required
                              fullWidth
                              className="table-search"
                              name={filter.id}
                              value={answer[filter.id] || ""}
                              id="Search"
                              placeholder={filter.label}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <img src={search} />
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(event) => {filters(),
                                setAnswer({
                                  ...answer,
                                  [event.target.name]: event.target.value,
                                });
                                setFilterProps({
                                    ...answer,
                                    [filter.id]: event.target.value,
                                  });
                              }}
                            />
                          </FormControl>
                        );
                      } else if (filter.type === "autocomplete") {
                        return (
                           <Box key={index}>
                            <Autocomplete
                            multiple
                            limitTags={1}
                            id="Search"
                            className="multiselect-chip multi-selection"
                            classes={{
                              option: 'menuItem',
                              listbox: 'menuList',
                              noOptions: 'noOptions',
                              groupLabel: 'headerItem',
                            }}
                           options={filter.options}
                            disableCloseOnSelect
                            getOptionLabel={(option:any) => option.label}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  style={{ marginRight: 0 }}
                                  checked={selected}
                                />
                                {option.label}
                              </li>
                            )}
                            renderInput={(params) => <TextField {...params} />}
                            placeholder="Department"
                            size="small"
                            onChange={(e, f) => {
                              f.forEach((element) =>
                                departments.push(element.id),
                              );
                            }}
                            
                          />
                          </Box> 
                        );
                      } else if (filter.type === "date") {
                        return (
                          <FormControl key={index} className="calender-sec theadCalender">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                              <DatePicker format="DD/MM/YYYY" />
                            </LocalizationProvider>
                          </FormControl>
                        );
                      }
                      return null;
                    })}
                  </Box>
                </TableCell>
              </TableRow> */}
              </TableCell>
            )}{' '}
          </>
        ))}
      </TableRow>
    </TableHead>
  );
}
