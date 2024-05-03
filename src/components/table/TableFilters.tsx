import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import "../../assets/styles/procedure.scss";
import bin from "../../assets/images/bin.svg";
import share from "../../assets/images/Share.svg";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";
import { MoreVertOutlined } from "@mui/icons-material";
import AssignPopup from "../../components/AssignPopup";
import AddPeoplePopup from "../../components/AddPeoplePopup";

export default function TableFilters({
  columns,
  handleMenuCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
  isDeselectAllChecked,
  isselectAllChecked,
  isTableHeaderVisible,
  closeTableHeader,
  deleteRecord,
  module,
  applyFilters,
  status,
  availability,
  runzId,
  runzRow,
}: any) {
  const [columnAnchorEl, setColumnAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const columnAnchorOpen = Boolean(columnAnchorEl);
  const [openAssign, setAssignOpen] = React.useState(false);
  const [runsOpen, setRunsOpen] = React.useState(false);
  const [typePopup, settypePopup] = React.useState("");
  const handleColumnPopoverClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setColumnAnchorEl(event.currentTarget);
  };

  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const credencial = loginUserSliceData?.verifyToken?.role[0];

  const handleColumnPopoverClose = () => {
    setColumnAnchorEl(null);
  };

  const handleAssignClick = (val: string) => {
    setRunsOpen(true);
    settypePopup(val);
  };

  return (
    <>
      <AssignPopup open={openAssign} close={() => setAssignOpen(false)} />
      <Grid
        container
        sx={{ my: 2 }}
        alignItems="center"
        justifyContent={isTableHeaderVisible ? "space-between" : "flex-end"}
      >
        <Grid item xs={12} sm={12} md={12} lg={6} xl={9}>
          {isTableHeaderVisible && (
            <Box className="search-action">
              <Button
                type="submit"
                onClick={() => handleDeCheckboxChange(false)}
                variant="contained"
                className="close-actions"
              >
                <CloseIcon sx={{ fontSize: "20px", marginRight: "5px" }} />
                Close actions
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    sx={{
                      color: "#9F9F9F",
                      "&.Mui-checked": {
                        color: "#FFC60B",
                      },
                    }}
                    checked={isselectAllChecked}
                    checkedIcon={<CheckCircleOutlineOutlinedIcon />}
                    icon={<HighlightOffOutlinedIcon />}
                    onChange={(event) => {
                      handledAllSelected(isselectAllChecked);
                    }}
                  />
                }
                label="Select all"
                className="common-checkbox"
                style={{ marginBottom: "0rem" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    sx={{
                      color: "#9F9F9F",
                      "&.Mui-checked": {
                        color: "#FFC60B",
                      },
                      "& .MuiFormControlLabel-label": {
                        fontSize: "10px", // Adjust the font size as per your preference
                      },
                    }}
                    checkedIcon={<CheckCircleOutlineOutlinedIcon />}
                    icon={<HighlightOffOutlinedIcon />}
                    onChange={(event) => handleDeCheckboxChange(event, false)}
                    checked={isDeselectAllChecked}
                  />
                }
                label="Deselect all"
                className="common-checkbox"
                style={{ marginBottom: "0rem" }}
              />
              {module === "procedures" && (
                <Button
                  className="delete-actions"
                  onClick={deleteRecord}
                  disabled={!credencial?.procedure_management?.delete}
                >
                  <img src={bin} alt="Delete" className="Image-actions" />
                  Delete
                </Button>
              )}
              {module === "assets" && (
                <Button
                  className="delete-actions"
                  onClick={deleteRecord}
                  disabled={!credencial?.asset_management?.delete}
                >
                  <img src={bin} alt="Delete" className="Image-actions" />
                  Delete
                </Button>
              )}
              {module === "users" && (
                <Button
                  className="delete-actions"
                  onClick={deleteRecord}
                  disabled={!credencial?.user_management?.delete}
                >
                  <img src={bin} alt="Delete" className="Image-actions" />
                  Delete
                </Button>
              )}
              {module === "runs" && (
                <Button
                  className="delete-actions"
                  onClick={deleteRecord}
                  disabled={!credencial?.runs_management?.delete}
                >
                  <img src={bin} alt="Delete" className="Image-actions" />
                  Delete
                </Button>
              )}

              <AddPeoplePopup
                open={runsOpen}
                close={() => {
                  setRunsOpen(false);
                  handleDeCheckboxChange(false);
                }}
                runzId={runzId}
                runzRow={runzRow}
                typePopup={typePopup}
              />
              {module === "runs" && (
                <Button
                  className="delete-actions"
                  onClick={() => handleAssignClick("share")}
                  disabled={!credencial?.runs_management?.share}
                >
                  <img src={share} alt="Share" className="Image-actions" />
                  Share
                </Button>
              )}
              <IconButton onClick={handleColumnPopoverClick}>
                <MoreVertOutlined />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={columnAnchorEl}
                open={columnAnchorOpen}
                onClose={handleColumnPopoverClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {columns.map((item: any, index: number) => (
                  <MenuItem key={item.id} value={item.label}>
                    <Checkbox
                      checked={item.is_show ? true : false}
                      disabled={item.label.includes("ID") ? true : false}
                      onChange={(e) => handleMenuCheckboxChange(e, index)}
                    />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
}
