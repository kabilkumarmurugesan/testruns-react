import React from 'react'
import Dialog from "@mui/material/Dialog";
import { Box, Typography, Grid, TextField, FormControl, Select, MenuItem, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import Avatars from "../../../assets/images/Avatars.svg";
import AddIcon from '@mui/icons-material/Add';
import AddPeoplePopup from '../../../components/AddPeoplePopup';
import binred from "../../../assets/images/bin-red.svg";
import dayjs from 'dayjs';

export default function EditPopup({ open, close }: any) {
    const [answers, setAnswers] = React.useState("");
    const Placeholder = ({ children }: any) => {
        return <div>{children}</div>;
    };
    const [runsOpen, setRunsOpen] = React.useState(false);
    return (
        <div>
            <Dialog
                open={open}
                keepMounted
                onClose={close}
                aria-labelledby="add-new-asset-title"
                aria-describedby="add-new-asset"
                fullWidth
                maxWidth="md"
                className="popup-outer"
                disableScrollLock={ true }
            >
                <Box className="popup-section editrunz-popup">
                    <Box className="title-popup">
                        <Typography>Edit Runs</Typography>
                        <CloseIcon />
                    </Box>
                    <Box>
                        <Grid container spacing={2} className='asset-popup'>
                            <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingRight: { sm: '1rem !important' } }}>
                                <Box>
                                    <label style={{ display: 'block' }}>Department</label>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        InputLabelProps={{ shrink: false }}
                                        placeholder="Physics"
                                        className="bg-gray-input"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingLeft: { sm: '1rem !important' }, paddingTop: { xs: '0rem !important', sm: '1rem !important' } }}>
                                <Box>
                                    <label style={{ display: 'block' }}>Laboratory</label>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        InputLabelProps={{ shrink: false }}
                                        placeholder="Mechanical"
                                        className="bg-gray-input"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className='asset-popup'>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    <label style={{ display: 'block' }}>Procedure name<span style={{ color: '#E2445C' }}>*</span></label>
                                    <FormControl sx={{ width: "100%" }}>
                                        <Select
                                        MenuProps={{                   
                                            disableScrollLock: true,                   
                                            marginThreshold: null
                                          }}
                                            labelId="tselect-popup-label"
                                            id="select-popup"
                                            value={answers}
                                            displayEmpty
                                            IconComponent={ExpandMoreOutlinedIcon}
                                            onChange={(event) => setAnswers(event.target.value)}
                                            renderValue={
                                                answers !== ""
                                                    ? undefined
                                                    : () => <Placeholder>Organisation</Placeholder>
                                            }
                                        >
                                            <MenuItem value={"1"}>1</MenuItem>
                                            <MenuItem value={"2"}>2</MenuItem>
                                            <MenuItem value={"3"}>3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className='asset-popup calender-sec'>
                            <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingRight: { sm: '1rem !important' } }}>
                                <Box>
                                    <label style={{ display: 'block' }}>Runs ID (autogenerated)</label>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        InputLabelProps={{ shrink: false }}
                                        placeholder="ID023659ADN"
                                        className="bg-gray-input"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingLeft: { sm: '1rem !important' }, paddingTop: { xs: '0rem !important', sm: '1rem !important' } }}>
                                <Box className="bg-gray-input">
                                    <label style={{ display: 'block' }}>Created on</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker format='MM/DD/YYYY' disablePast />
                                    </LocalizationProvider>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className='asset-popup'>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    <label style={{ display: 'block' }}>Test objective</label>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        InputLabelProps={{ shrink: false }}
                                        placeholder="Test objective"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className='asset-popup calender-sec'>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <Box>
                                    <label style={{ display: 'block' }}>Set due date</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker format='MM/DD/YYYY' disablePast value={dayjs()} />
                                    </LocalizationProvider>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className='asset-popup'>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    <label style={{ display: 'block', marginBottom: '0.8rem' }}>Assign to</label>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={Avatars} alt='Avatars' />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className="avatar-add"
                                            onClick={() => {
                                                setRunsOpen(true);
                                            }}
                                        >
                                            <AddIcon sx={{ mr: 1 }} />
                                            Add
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: 'flex' }, justifyContent: 'space-between', mt: 3 }}>
                        <Box>
                            <Button type="submit" variant="contained" className="Delete-btn">
                                <img src={binred} alt='binred' style={{marginRight:'10px'}}/>Delete
                            </Button>
                        </Box>
                        <Box>
                            <Button type="submit" variant="contained" className="cancel-btn">Cancel</Button>
                            <Button type="submit" variant="contained" className="add-btn">Create</Button>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
            <Box>
                <AddPeoplePopup
                    open={runsOpen}
                    close={() => setRunsOpen(false)}
                />
            </Box>
        </div>
    )
}