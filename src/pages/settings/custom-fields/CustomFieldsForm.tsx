import React from "react";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

const CustomFieldsForm = React.forwardRef(
  ({ closeFormPopup, openConfirmationPopup, submitFormPopup }: any, ref) => {
    const [formPopup, setFormPopup] = React.useState(false);
    // const [alertBox, setAlertBox] = React.useState(false);
    const [fieldType, setFieldType] = React.useState<any>(null);
    const [fieldGroup, setFieldGroup] = React.useState<any>(null);
    const [fieldStatus, setFieldStatus] = React.useState<any>(null);

    React.useImperativeHandle(ref, () => ({
      open(state: any) {
        setFormPopup(state);
      },
    }));

    const Placeholder = ({ children }: any) => {
      return <div>{children}</div>;
    };

    // const handleAddButtonClick = () => {
    //   setAlertBox(true);
    //   closeFormPopup();
    //   setTimeout(() => {
    //     setAlertBox(false);
    //   }, 2000);
    // };
    // const handleConfirmationYes = () => {
    //   setFormPopup(false);
    //   closeFormPopup();
    // };
    return (
      <Dialog
        open={formPopup}
        keepMounted
        onClose={() => closeFormPopup(false)}
        aria-labelledby="add-new-asset-title"
        aria-describedby="add-new-asset"
        fullWidth
        maxWidth="md"
        className="popup-outer"
        disableScrollLock={ true }
      >
        <Box className="popup-section">
          <Box className="title-popup">
            <Typography>Create new field</Typography>
            <CloseIcon onClick={() => closeFormPopup(false)} />
          </Box>
          <Box>
            <Grid container spacing={2} className="asset-popup">
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                sx={{ paddingRight: { sm: "1rem !important" } }}
              >
                <Box>
                  <label style={{ display: "block" }}>Field Name</label>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="off"
                    autoFocus
                    InputLabelProps={{ shrink: false }}
                    placeholder="Field name"
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                sx={{ paddingRight: { sm: "1rem !important" } }}
              >
                <Box>
                  <label style={{ display: "block" }}>Field Type</label>
                  <FormControl sx={{ width: "100%" }}>
                    <Select
                    MenuProps={{                   
                      disableScrollLock: true,                   
                      marginThreshold: null
                    }}
                      labelId="tselect-popup-label"
                      id="select-popup"
                      value={fieldType}
                      displayEmpty
                      IconComponent={ExpandMoreOutlinedIcon}
                      onChange={(event) => setFieldType(event.target.value)}
                      renderValue={
                        fieldType !== ""
                          ? undefined
                          : () => <Placeholder>Select</Placeholder>
                      }
                    >
                      <MenuItem value={"1"}>Text</MenuItem>
                      <MenuItem value={"2"}>Numeric</MenuItem>
                      <MenuItem value={"3"}>Select</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} className="asset-popup">
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                sx={{ paddingRight: { sm: "1rem !important" } }}
              >
                <Box>
                  <label style={{ display: "block" }}>
                    Field {fieldType === "3" ? "Options" : "Value"}
                  </label>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="off"
                    autoFocus
                    InputLabelProps={{ shrink: false }}
                    placeholder={`Field ${fieldType === "3" ? "options" : "value"
                      }`}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      bottom: "20px",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {fieldType === "3" && (
                      <em>Note: To add multiple options use comma seperator</em>
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                sx={{ paddingRight: { sm: "1rem !important" } }}
              >
                <Box>
                  <label style={{ display: "block" }}>Field Group</label>
                  <FormControl sx={{ width: "100%" }}>
                    <Select
                    MenuProps={{                   
                      disableScrollLock: true,                   
                      marginThreshold: null
                    }}
                      labelId="tselect-popup-label"
                      id="select-popup"
                      value={fieldGroup}
                      displayEmpty
                      IconComponent={ExpandMoreOutlinedIcon}
                      onChange={(event) => setFieldGroup(event.target.value)}
                      renderValue={
                        fieldGroup !== ""
                          ? undefined
                          : () => <Placeholder>Select</Placeholder>
                      }
                    >
                      <MenuItem value={"1"}>Department</MenuItem>
                      <MenuItem value={"2"}>Lab</MenuItem>
                      <MenuItem value={"3"}>Status</MenuItem>
                      <MenuItem value={"4"}>Organisation</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} className="asset-popup">
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                sx={{ paddingRight: { sm: "1rem !important" } }}
              >
                <Box>
                  <label style={{ display: "block" }}>Status</label>
                  <FormControl sx={{ width: "100%" }}>
                    <Select
                    MenuProps={{                   
                      disableScrollLock: true,                   
                      marginThreshold: null
                    }}
                      labelId="tselect-popup-label"
                      id="select-popup"
                      value={fieldStatus}
                      displayEmpty
                      IconComponent={ExpandMoreOutlinedIcon}
                      onChange={(event) => setFieldStatus(event.target.value)}
                      renderValue={
                        fieldStatus !== ""
                          ? undefined
                          : () => <Placeholder>Select</Placeholder>
                      }
                    >
                      <MenuItem value={"1"}>Active</MenuItem>
                      <MenuItem value={"2"}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

            </Grid>
          </Box>
          <Box
            sx={{
              display: { xs: "block", sm: "flex" },
              justifyContent: "flex-end",
              mt: 3,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              onClick={() => openConfirmationPopup(true)}
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={submitFormPopup}
              className="add-btn"
            >
              Create
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }
);

export default CustomFieldsForm;
