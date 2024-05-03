import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAllUser, fetchSharedUser } from "../api/userAPI";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchShareRunz } from "../api/bulkRunz";
import { toast } from "react-toastify";

const AddPeople = ({
  open,
  close,
  runzId,
  runzRow,
  typePopup,
  formValue,
  handleAssign,
  assigned,
}: any) => {
  const dispatch: any = useDispatch();
  const [allUserData, setAlluserData] = React.useState<any>([]);
  const [userList, setuserList] = React.useState<any>([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [vissible, setvissible] = useState(false);

  const singleUserData = useSelector(
    (state: any) => state.user?.data?.get_user
  );

  const userSliceData = useSelector(
    (state: any) => state.userLogin?.data?.verifyToken
  );

  React.useEffect(() => {
    if (assigned) {
      setuserList([]);
      setSelectedUser(null);
    }
  }, []);

  React.useEffect(() => {
    setAlluserData(allUserData);
  }, [allUserData]);

  React.useEffect(() => {
    if (typePopup === "assign" || typePopup === "share") {
      if (typePopup === "share") {
        let payload1 = {
          runId: runzRow !== undefined && runzRow?.map((item: any) => item._id),
        };
        dispatch(fetchSharedUser(payload1)).then((res: any) => {
          let payload: any = {
            organisationId: singleUserData?.organisationId,
          };
          if (typePopup === "share") {
            console.log(res?.get_share_data, "res?.get_share_data");

            var ignoreUserList = res?.get_share_data?.map(
              (item: any) => item._id
            );
            ignoreUserList.push(userSliceData?._id);

            payload["ignoreUser"] = ignoreUserList;
          }
          dispatch(fetchAllUser(payload))
            .then((res: any) => {
              setAlluserData(
                res?.find_users.map((item: any) => ({
                  label: item.email,
                  value: item.email,
                  id: item._id,
                  name: item.firstName,
                }))
              );
            })
            .catch((err: any) => {
              console.error(err);
            });
        });
      } else {
        let payload: any = {
          organisationId: singleUserData?.organisationId,
        };
        dispatch(fetchAllUser(payload))
          .then((res: any) => {
            setAlluserData(
              res?.find_users.map((item: any) => ({
                label: item.email,
                value: item.email,
                id: item._id,
                name: item.firstName,
              }))
            );
          })
          .catch((err: any) => {
            console.error(err);
          });
      }
    }
  }, [typePopup]);

  const handleSave = async () => {
    const allIds = userList.map((item: any) => item.id);
    const newArray = runzRow?.map((item: any) => ({
      objective: item?.objective,
      shared: typePopup == "share" ? true : false,
      procedureId:
        item?.procedureId._id == undefined
          ? item?.procedureId[0]?._id
          : item?.procedureId._id,
      departmentId: item?.departmentId.map((item: any) => item?._id),
      laboratoryId: item?.laboratoryId.map((item: any) => item?._id),
      // assignedTo: item?.assignedTo ,
      assignedBy: userSliceData?._id,
      dueDate: item?.dueDate,
      status: item?.status,
    }));

    if (typePopup !== "share") {
      handleAssign(selectedUser);

      await close();
      setuserList([]);
    } else {
      setvissible(true);
      const allIds = userList[0]?.map((item: any) => item.id);
      const newArray = runzRow?.map((item: any) => item._id);
      if (allIds && allIds.length > 0) {
        let payload1 = {
          shareUserId: allIds,
          runId: newArray,
        };
        await dispatch(fetchShareRunz(payload1));
        await toast(
          `${
            typePopup === "assign"
              ? "Runs have been Assigned successfully."
              : "Runs have been shared successfully!"
          }`,
          {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          }
        );
        await close();
        setuserList([]);
        setvissible(false);
      } else {
        toast("Please fill out the required fields", {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={close}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation"
      fullWidth
      maxWidth="md"
      className="popup-outer"
      disableScrollLock={true}
    >
      <Box className="popup-section">
        <Box className="title-popup">
          <Typography>Add people</Typography>
          <CloseIcon onClick={close} />
        </Box>
        <Box>
          <Typography className="follow-people">
            You have selected following people.
          </Typography>
          <Box
            style={{
              borderRadius: "20px",
              border: "1px solid #9F9F9F",
              padding: "30px",
              margin: "15px 0px",
            }}
          >
            <Box>
              {typePopup == "assign" ? (
                <Autocomplete
                  value={assigned == true ? selectedUser : null} // Pass the selected user to the value prop
                  options={allUserData !== undefined ? allUserData : []}
                  getOptionLabel={(option: any) => option?.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Email" />
                    // <TextField {...params} placeholder={selectedUser?.length==0?"Select Email":""} />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      {typePopup == "share" && (
                        <Checkbox
                          style={{ marginRight: 0 }}
                          checked={selected}
                        />
                      )}
                      {option?.value}
                    </li>
                  )}
                  // disableClearable={true}
                  onChange={(event: any, newValue: any) => {
                    setSelectedUser(newValue); // Update the selected user when the value changes
                  }}
                />
              ) : (
                <Autocomplete
                  multiple
                  style={{ borderRadius: "15px !importnant" }}
                  limitTags={3}
                  value={userList[0]}
                  options={allUserData !== undefined ? allUserData : []}
                  getOptionLabel={(option: any) => option?.value}
                  disableCloseOnSelect={true}
                  // defaultValue={[
                  //   top100Films[13],
                  //   top100Films[12],
                  //   top100Films[11],
                  // ]}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Email" />
                    // <TextField {...params} placeholder={Object.keys(userList).length==0?"Select Email":""} />
                  )}
                  renderOption={(props, option: any, { selected }) => (
                    <React.Fragment>
                      <li {...props}>
                        {typePopup == "share" && (
                          <Checkbox
                            style={{ marginRight: 0 }}
                            checked={selected}
                          />
                        )}
                        {option.value}
                      </li>
                    </React.Fragment>
                  )}
                  disableClearable={true}
                  onChange={(_, selectedOptions: any) => {
                    setuserList([selectedOptions]);
                  }}
                />
              )}
            </Box>
          </Box>
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
            onClick={() => {
              close();
              setuserList([]);
            }}
            variant="contained"
            className="cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => !vissible && handleSave()}
            variant="contained"
            className="add-btn"
          >
            {vissible ? (
              <CircularProgress color="warning" size={20} />
            ) : typePopup == "share" ? (
              "Share"
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
export default AddPeople;
