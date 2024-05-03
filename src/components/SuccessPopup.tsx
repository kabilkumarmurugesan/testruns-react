import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Typography } from "@mui/material";

const SuccessPopup = React.forwardRef(({ close, type }: any, ref) => {
  const [successPopup, setSuccessPopup] = React.useState(false);
  const [popupText, setPopupText] = React.useState("");

  React.useImperativeHandle(ref, () => ({
    open(state: any, text: any) {
      setSuccessPopup(state);
      setPopupText(text);
    },
  }));

  return (
    <Dialog
      style={{ zIndex: 2000 }}
      open={successPopup}
      keepMounted
      onClose={close}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation"
      fullWidth
      maxWidth="xs"
      className="popup-outer"
      disableScrollLock={ true }
    >
      <Box className="popup-section" sx={{ background: "#C6FFD9" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography className="added-success">
            {popupText} {type === "edit" ? "updated" : "created"} successfully.
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
});

export default SuccessPopup;
