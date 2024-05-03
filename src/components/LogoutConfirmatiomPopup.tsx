import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import stop from '../assets/images/Cancel.svg';

const LogoutConfirmationpopup = React.forwardRef(({ confirmationDone ,clearForm}: any, ref) => {
  const [confirmationPopup, setConfirmationPopup] = React.useState(false);
  React.useImperativeHandle(ref, () => ({
    open(state: any) {
      setConfirmationPopup(state);
    },
  }));

  return (
    <Dialog
      style={{ zIndex: 1800 }}
      open={confirmationPopup}
      keepMounted
      // onClose={confirmationState}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation"
      fullWidth
      maxWidth="xs"
      className="popup-outer"
      disableScrollLock={ true }
    >
      <Box className="popup-section">
        <Box className="title-popup">
          <Typography>Confirmation</Typography>
          <CloseIcon onClick={() => confirmationDone(0)} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <img src={stop} alt="stop" className="stop-img" />
          <Typography className="sure-you">
            Are you sure you want to Logout?
          </Typography>
          <Box
            sx={{
              display: { xs: 'block', sm: 'flex' },
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Button
              onClick={() => confirmationDone(0)}
              variant="contained"
              className="cancel-btn"
            >
              No
            </Button>
            <Button
              type="submit"
              onClick={() => {confirmationDone(1)}}
              variant="contained"
              className="add-btn"
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
});

export default LogoutConfirmationpopup;