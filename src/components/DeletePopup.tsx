import React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import deletepopup from "../assets/images/delete.svg";

const DeletePopup = React.forwardRef(
  ({ closeDeletePopup, deleteConfirmation, module }: any, ref) => {
    const [deletePopup, setDeletePopup] = React.useState(false);
    const [text, setText] = React.useState("");

    React.useImperativeHandle(ref, () => ({
      open(state: any, text: any) {
        setDeletePopup(state);
        setText(text);
      },
    }));

    return (
      <>
        <Dialog
          style={{ zIndex: 1800 }}
          open={deletePopup}
          keepMounted
          onClose={closeDeletePopup}
          aria-labelledby="confirmation-title"
          aria-describedby="confirmation"
          fullWidth
          maxWidth="sm"
          className="popup-outer"
          disableScrollLock={true}
        >
          <Box className="popup-section">
            <Box className="title-popup">
              <Typography>Confirmation</Typography>
              <CloseIcon onClick={closeDeletePopup} />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <img src={deletepopup} alt="stop" className="stop-img" />
              <Typography className="sure-you">
                Are you sure you want to{" "}
                {module !== undefined && module == "asset"
                  ? "In-Active"
                  : "delete"}{" "}
                the {text}?
              </Typography>
              <Box
                sx={{
                  display: { xs: "block", sm: "flex" },
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Button
                  type="submit"
                  onClick={() => deleteConfirmation(0)}
                  variant="contained"
                  className="cancel-btn"
                >
                  No
                </Button>
                <Button
                  type="submit"
                  onClick={() => deleteConfirmation(1)}
                  variant="contained"
                  className="add-btn"
                >
                  Yes
                </Button>
                {/* <Button type="submit"  variant="contained" className="add-btn" onClick={() => { setDeletePopup(true); }}>Yes</Button> */}
              </Box>
            </Box>
          </Box>
        </Dialog>
      </>
    );
  }
);

export default DeletePopup;
