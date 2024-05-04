import React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Typography } from "@mui/material";

const DeleteSuccessPopup = React.forwardRef(({ close }: any, ref) => {
  const [openPopup, setOpenPopup] = React.useState(false);
  React.useImperativeHandle(ref, () => ({
    open(state: any) {
      setOpenPopup(state);
    },
  }));
  return (
    <Dialog
      style={{ zIndex: 2000 }}
      open={openPopup}
      keepMounted
      onClose={close}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation"
      fullWidth
      maxWidth="xs"
      className="popup-outer"
      disableScrollLock={true}
    >
      <Box className="popup-section" sx={{ background: "#FFB9B9" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography className="cancel-unsave">
            Deleted Successfully.
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
});
export default DeleteSuccessPopup;
