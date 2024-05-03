import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Typography } from "@mui/material";

const FailurePopup = ({ open, close }: any) => {
  return (
    <Dialog
      style={{ zIndex: 2000 }}
      open={open}
      keepMounted
      onClose={close}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation"
      fullWidth
      maxWidth="xs"
      className="popup-outer"
      disableScrollLock={ true }
    >
      <Box className="popup-section" sx={{background:'#FFB9B9'}}>         
          <Box sx={{textAlign:'center'}}>
            <Typography className="cancel-unsave">Changes unsaved.</Typography>           
          </Box>
      </Box>
    </Dialog>
  );
};
export default FailurePopup;