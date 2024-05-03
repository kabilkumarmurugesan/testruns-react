/* eslint-disable react/display-name */
import React from 'react';
import { Box, Chip, Dialog, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TablePopup = React.forwardRef((props, ref) => {
  const [openPopup, setOpenPopup] = React.useState(false);
  const [listName, setListName] = React.useState('');
  const [listItems, setListItems] = React.useState<any>([]);

  React.useImperativeHandle(ref, () => ({
    open(state: any, name: string, items: any) {
      setOpenPopup(state);
      setListName(name);
      setListItems(items);
    },
  }));

  const handlePopupClose = () => {
    setOpenPopup(false);
    setListName('');
  };

  return (
    <Dialog
      open={openPopup}
      keepMounted
      onClose={handlePopupClose}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation"
      fullWidth
      maxWidth="sm"
      className="popup-outer"
      disableScrollLock={true}
    >
      <Box className="popup-section">
        <Box className="title-popup" sx={{ marginBottom: '1rem !important' }}>
          <Typography>
            {listName} ({listItems.length})
          </Typography>
          <CloseIcon onClick={handlePopupClose} />
        </Box>
        <Box>
          <Typography className="follow-people">
            You have selected following {listName}.
          </Typography>
          <Box
            style={{
              borderRadius: '10px',
              border: '1px solid #9F9F9F',
              padding: '20px 10px',
              margin: '15px 0px',
            }}
          >
            <Box>
              {listItems?.map((item: any, index: any) => (
                <Chip key={index} label={item.name} sx={{ m: 0.5 }} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
});

export default TablePopup;
