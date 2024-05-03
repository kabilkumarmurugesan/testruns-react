/* eslint-disable react/display-name */
import React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import stop from '../assets/images/Cancel.svg';

const Confirmationpopup = React.forwardRef(({ confirmationState ,clearForm}: any, ref) => {
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
          <CloseIcon onClick={() => confirmationState(0)} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <img src={stop} alt="stop" className="stop-img" />
          <Typography className="sure-you">
            Are you sure you want to close?
          </Typography>
          <Box
            sx={{
              display: { xs: 'block', sm: 'flex' },
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Button
              onClick={() => confirmationState(0)}
              variant="contained"
              className="cancel-btn"
            >
              No
            </Button>
            <Button
              type="submit"
              onClick={() => {confirmationState(1),clearForm}}
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

export default Confirmationpopup;
