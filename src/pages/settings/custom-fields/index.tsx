import React from "react";
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TablePagination from "../../../components/table/TablePagination";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import AddIcon from "@mui/icons-material/Add";
import { withSettingsLayout } from "../../../components/settings";
import TableHeader from "../../../components/table/TableHeader";
import { CustomHeaders } from "../../../utils/data";
import TableFilters from "../../../components/table/TableFilters";
import DeletePopup from "../../../components/DeletePopup";
import CustomFieldsForm from "./CustomFieldsForm";
import {
  handleCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
} from "../../../utils/common-services";
import { CustomRowData } from "../../../modals";
import Confirmationpopup from "../../../components/ConfirmationPopup";
import SuccessPopup from "../../../components/SuccessPopup";

const fields: CustomRowData[] = [
  {
    is_checked: false,
    id: "CF1000",
    name: "Availability Option",
    type: "Select",
    group: "Availability",
    status: "1",
    added_on: "01/10/2023",
  },
  {
    is_checked: false,
    id: "CF1001",
    name: "Department Option",
    type: "Select",
    group: "Department",
    status: "1",
    added_on: "02/10/2023",
  },
  {
    is_checked: false,
    id: "CF1002",
    name: "Lab Option",
    type: "Select",
    group: "Lab",
    status: "1",
    added_on: "02/10/2023",
  },
  {
    is_checked: false,
    id: "CF1003",
    name: "Status Option",
    type: "Select",
    group: "Status",
    status: "1",
    added_on: "04/10/2023",
  },
  {
    is_checked: false,
    id: "CF1004",
    name: "Organization Option",
    type: "Select",
    group: "Organization",
    status: "2",
    added_on: "03/10/2023",
  },
];

// table end
const CustomFields = () => {
  // const [openDlg1Dialog, setDialog1Open] = React.useState(false);
  const [headers, setHeaders] = React.useState(CustomHeaders);
  // const [deletePopup, setDeletePopup] = React.useState(false);
  const [Rows, setSelectedRows] = React.useState(fields);
  const [isDeselectAllChecked, setIsDeselectAllChecked] = React.useState(false);
  const [isselectAllChecked, setIsselectAllChecked] = React.useState(false);
  const [isTableHeaderVisible, setTableHeaderVisible] = React.useState(false);
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const deletePopupRef: any = React.useRef(null);

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

  const handleRequestSort = () => { };

  const handleChange = (event: any, id: any) => {
    handleCheckboxChange(
      Rows,
      setSelectedRows,
      setIsDeselectAllChecked,
      setIsselectAllChecked,
      setTableHeaderVisible

    )(event, id);
  };

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
  const [currentPage, setCurrentPage] = React.useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(Rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const Data = Rows.slice(startIndex, endIndex);

  const handlePageChange = (even: any, page: number) => {
    setCurrentPage(page);
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

  const handleConfirmationDone = (state: any) => {
    if (state === 1) {
      formPopupRef.current.open(false);
    }
    confirmationPopupRef.current.open(false);
  };

  const handleOpenDeletePopup = () => {
    deletePopupRef.current.open(true, "field/s");
  };

  const handleDeleteConfirmation = (state: any) => {
    if (state === 1) {
      deletePopupRef.current.open(false);
    }
    deletePopupRef.current.open(false);
  };

  // table end
  return (
    <Box className="user-setting-page" style={{ padding: "24px" }}>
      <Box
        className="title-main"
        sx={{ borderBottom: "1px solid #F3F3F3", paddingBottom: "1rem" }}
      >
        <Box>
          <Typography>Custom fields</Typography>
          <Typography className="sub-text">
            Add edit and delete fields.
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          onClick={() => formPopupRef.current.open(true)}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add new
        </Button>
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
        module="custom-fields"
      />

      <Box className="table-outer" sx={{ width: "100%" }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHeader
              numSelected={0}
              onRequestSort={handleRequestSort}
              onSelectAllClick={function (
                // event: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
              order={"asc"}
              orderBy={""}
              rowCount={0}
              columns={headers}
            />
            <TableBody>
              {Data.map((row, index) => {
                return (
                  <TableRow
                    hover
                    // onClick={(event) => handleClick(event, row.name)}
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={index}
                    // selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    {headers[0].is_show && (
                      <TableCell scope="row">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ mt: 0, mr: 1 }}>
                            <Checkbox
                              // checked={row.is_checked}
                              color="info"
                              disableRipple
                              checked={row.is_checked}
                              onChange={(event) => handleChange(event, row.id)}
                            />
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ ml: 2 }}>
                              <Box>{row.id}</Box>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                    )}
                    {headers[1].is_show && (
                      <TableCell align="center">{row.name}</TableCell>
                    )}
                    {headers[2].is_show && (
                      <TableCell align="center">{row.type}</TableCell>
                    )}
                    {headers[3].is_show && (
                      <TableCell align="center">{row.group}</TableCell>
                    )}
                    {headers[4].is_show && (
                      <TableCell>
                        <Select
                        MenuProps={{                   
                          disableScrollLock: true,                   
                          marginThreshold: null
                        }}
                          className={
                            row.status === "1"
                              ? "active-select td-select"
                              : "inactive-select td-select"
                          }
                          value={row.status}
                          displayEmpty
                          IconComponent={ExpandMoreOutlinedIcon}
                        >
                          <MenuItem value={1}>Active</MenuItem>
                          <MenuItem value={2}>In-Active</MenuItem>
                        </Select>
                      </TableCell>
                    )}
                    {headers[5].is_show && (
                      <TableCell align="center">{row.added_on}</TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          currentPageData={Data}
          Rows={Rows}
        />
      </Box>
      <CustomFieldsForm
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
      <DeletePopup
        ref={deletePopupRef}
        closeDeletePopup={() => deletePopupRef.current.open(false, "field/s")}
        deleteConfirmation={handleDeleteConfirmation}
      />
    </Box>
  );
};

const UsersPage = withSettingsLayout(CustomFields);

export default UsersPage;
