import React from 'react'
import Dialog from "@mui/material/Dialog";
import { Box, Typography, Grid, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Avatars from "../assets/images/Avatars.svg";
import AddIcon from '@mui/icons-material/Add';
import AddPeoplePopup from "./AddPeoplePopup";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function createData(
    name: string,
    calories: number,
) {
    return { name, calories };
}

const rows = [
    createData('Frozen yoghurt', 159),
    createData('Ice cream sandwich', 237),
    createData('Eclair', 262,),
    createData('Cupcake', 305),
    createData('Gingerbread', 356,),
];


export default function Assign({ open, close }: any) {
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
                <Box className="popup-section">
                    <Box className="title-popup">
                        <Typography>Assign runs</Typography>
                        <CloseIcon />
                    </Box>
                    <Box>
                        <Typography className="follow-people">You have selected following runs to assign.</Typography>
                        <Box className="table-outer" sx={{ width: "100%" }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Runs details</TableCell>
                                            <TableCell align="right">Created by</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.calories}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Grid container spacing={2} className='asset-popup' sx={{mt:2}}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    <label style={{ display: 'block', marginBottom: '0.8rem' }}>Assign to</label>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={Avatars} alt='Avatars' style={{marginRight:'0.5rem'}} />
                                        <img src={Avatars} alt='Avatars' style={{marginRight:'0.5rem'}} />
                                        <img src={Avatars} alt='Avatars' style={{marginRight:'0.5rem'}} />
                                        <img src={Avatars} alt='Avatars' style={{marginRight:'0.5rem'}} />
                                        <Button  type="submit" variant="contained" className="add-more">
                                            <AddIcon style={{fontSize:'16px'}}/>
                                            2more
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className="avatar-add"
                                            onClick={() => {
                                                setRunsOpen(true);
                                            }}
                                        >
                                            <AddIcon sx={{ mr: 1 }}/>
                                            Add
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: 'flex' }, justifyContent: 'flex-end', mt: 3 }}>
                        <Button type="submit" variant="contained" className="cancel-btn">Cancel</Button>
                        <Button type="submit" variant="contained" className="add-btn">Assign</Button>
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