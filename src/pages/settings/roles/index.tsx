import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import search from "../../../assets/images/search.svg";
import { withSettingsLayout } from "../../../components/settings";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import { fetchSingleRoleData, fetchUpdateRoleData } from "../../../api/roleApi";
import { toast } from "react-toastify";

const Roles = () => {
  const [roleData, setRoleData] = React.useState({});
  const dispatch: any = useDispatch();

  const roleSliceData = useSelector(
    (state: any) => state.role.data?.find_roles
  );
  const loginUserSliceData = useSelector(
    (state: any) => state.userLogin?.data?.verifyToken
  );

  var initailState: any = {
    name: "Admin",
    type: "1",
    procedure_management: {
      assign: true,
      create: true,
      delete: true,
      edit: true,
      share: true,
      view: true,
    },
    asset_management: {
      assign: true,
      create: true,
      delete: true,
      edit: true,
      share: true,
      view: true,
    },
    profile_management: {
      changePassword: true,
      editContact: true,
      editDepartment: true,
      editLab: true,
      editOrganisation: true,
      editUserName: true,
      editRole: true,
    },
    role_management: {
      edit: true,
    },
    runs_management: {
      assign: true,
      create: true,
      delete: true,
      edit: true,
      share: true,
      view: true,
    },
    user_management: {
      create: true,
      delete: true,
      edit: true,
      view: true,
    },
  };
  var initailState1: any = {
    name: "Requester",
    type: "2",
    procedure_management: {
      assign: true,
      create: true,
      delete: false,
      edit: true,
      share: true,
      view: true,
    },
    asset_management: {
      assign: true,
      create: true,
      delete: true,
      edit: true,
      share: true,
      view: true,
    },
    profile_management: {
      changePassword: true,
      editContact: false,
      editDepartment: false,
      editLab: false,
      editOrganisation: false,
      editUserName: true,
      editRole: false,
    },
    role_management: {
      edit: false,
    },
    runs_management: {
      assign: true,
      create: true,
      delete: true,
      edit: true,
      share: true,
      view: true,
    },
    user_management: {
      create: false,
      delete: false,
      edit: false,
      view: false,
    },
  };
  var initailState2: any = {
    name: "Tester",
    type: "3",
    procedure_management: {
      assign: false,
      create: false,
      delete: false,
      edit: false,
      share: false,
      view: true,
    },
    asset_management: {
      assign: true,
      create: true,
      delete: true,
      edit: true,
      share: true,
      view: true,
    },
    profile_management: {
      changePassword: true,
      editContact: false,
      editDepartment: false,
      editLab: false,
      editOrganisation: false,
      editUserName: true,
      editRole: false,
    },
    role_management: {
      edit: false,
    },
    runs_management: {
      assign: true,
      create: true,
      delete: true,
      edit: true,
      share: true,
      view: true,
    },
    user_management: {
      create: false,
      delete: false,
      edit: false,
      view: false,
    },
  };

  const [formValues, setFormValues] = React.useState<any>(initailState);
  const [formValues1, setFormValues1] = React.useState(initailState1);
  const [formValues2, setFormValues2] = React.useState(initailState2);

  React.useEffect(() => {
    setFormValues(formValues);
    setFormValues1(formValues1);
    setFormValues2(formValues2);
  }, [formValues, formValues1, formValues2]);

  React.useEffect(() => {
    roleSliceData?.map((ListItem: any, index: any) => {
      if (ListItem.type == "1") {
        setFormValues(ListItem);
        initailState["_id"] = ListItem?._id;
        // initailState={...initailState,["id"]:roleSliceData[0]?._id}
      } else if (ListItem.type == "2") {
        setFormValues1(ListItem);
        initailState1["_id"] = ListItem?._id;
      } else if (ListItem.type == "3") {
        setFormValues2(ListItem);
        initailState2["_id"] = ListItem?._id;
      }
    });
  }, [roleSliceData]);

  React.useEffect(() => {
    let payload = {
      instituteId: loginUserSliceData?.instituteId,
    };
    dispatch(fetchSingleRoleData(payload));
  }, [loginUserSliceData]);

  const handleChange = (category: any, field: any, value: any) => {
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [category]: {
        ...prevValues[category],
        [field]: value,
      },
    }));
  };
  const handleChange1 = (category: any, field: any, value: any) => {
    setFormValues1((prevValues: any) => ({
      ...prevValues,
      [category]: {
        ...prevValues[category],
        [field]: value,
      },
    }));
  };
  const handleChange2 = (category: any, field: any, value: any) => {
    setFormValues2((prevValues: any) => ({
      ...prevValues,
      [category]: {
        ...prevValues[category],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    var { createdAt, isActive, updatedAt, isDeleted, __typename, ...rest } =
      formValues;
    var { createdAt, isActive, updatedAt, isDeleted, __typename, ...rest1 } =
      formValues1;
    var { createdAt, isActive, updatedAt, isDeleted, __typename, ...rest2 } =
      formValues2;

    var newarr = [];
    newarr.push(rest, rest1, rest2);
    const updatedData = newarr.map((item) => {
      // Create a copy of the item to avoid modifying the original object
      const newItem = { ...item };

      // Iterate over the keys of the item
      for (const key in newItem) {
        if (Object.prototype.hasOwnProperty.call(newItem, key)) {
          // Check if the key is an object and has the __typename property
          if (
            typeof newItem[key] === "object" &&
            newItem[key] !== null &&
            "__typename" in newItem[key]
          ) {
            // Create a copy of the nested object and delete __typename
            newItem[key] = { ...newItem[key] };
            delete newItem[key].__typename;
          }
        }
      }

      return newItem;
    });

    var payload = {
      roles: updatedData,
    };

    await dispatch(fetchUpdateRoleData(payload))
      .then((res: any) => {
        toast(`Role has been updated successfully!`, {
          style: {
            background: "#00bf70",
            color: "#fff",
          },
        });
      })
      .catch((err: any) => {
        console.error(err);
      });
    let payload1 = {
      instituteId: loginUserSliceData?.instituteId,
    };
    await dispatch(fetchSingleRoleData(payload1));
  };
  const handleReset = async () => {
    roleSliceData?.map((ListItem: any, index: any) => {
      if (ListItem.type == "1") {
        initailState["_id"] = ListItem?._id;
      } else if (ListItem.type == "2") {
        initailState1["_id"] = ListItem?._id;
      } else if (ListItem.type == "3") {
        initailState2["_id"] = ListItem?._id;
      }
    });
    var newarr = [];
    newarr.push(initailState, initailState1, initailState2);

    var payload = {
      roles: newarr,
    };
    await dispatch(fetchUpdateRoleData(payload))
      .then((res: any) => {
        toast(`Role Reset successfully !`, {
          style: {
            background: "#00bf70",
            color: "#fff",
          },
        });
      })
      .catch((err: any) => {
        console.error(err);
      });
    let payload1 = {
      instituteId: loginUserSliceData?.instituteId,
    };
    await dispatch(fetchSingleRoleData(payload1));

    setFormValues(initailState);
    setFormValues1(initailState1);
    setFormValues2(initailState2);
  };

  return (
    <Box className="role-setting-page">
      <Box
        className="title-main"
        sx={{
          borderBottom: "1px solid #F3F3F3",
          padding: "15px 0px",
          paddingBottom: "8px",
          margin: "0px 24px",
        }}
      >
        <Box>
          <Typography>Role management</Typography>
          <Typography className="sub-text">
            Control the access of actions an user can have.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          m: 0,
          padding: "24px",
        }}
      >
        <Typography className="Access-control">Access control</Typography>
        <Box>
          <Box className="role-table" sx={{ width: "100%" }}>
            <TableContainer sx={{ height: 639 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Actions</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Tester</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={12} className="procedure-profile">
                      <Typography>Procedure</Typography>
                      <Typography>
                        Control the actions of users under procedure section.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can create</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues?.procedure_management.create
                                ? true
                                : false
                            }
                            onChange={(e: any) =>
                              handleChange(
                                "procedure_management",
                                "create",
                                !formValues?.procedure_management.create
                              )
                            }
                            name="create"
                            // checked={true}
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues1?.procedure_management.create
                                ? true
                                : false
                            }
                            onChange={(e: any) =>
                              handleChange1(
                                "procedure_management",
                                "create",
                                !formValues1?.procedure_management.create
                              )
                            }
                            name="create"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues2?.procedure_management.create
                                ? true
                                : false
                            }
                            onChange={(e: any) =>
                              handleChange2(
                                "procedure_management",
                                "create",
                                !formValues2?.procedure_management.create
                              )
                            }
                            name="create"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can delete</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.procedure_management.delete}
                            onChange={(e: any) =>
                              handleChange(
                                "procedure_management",
                                "delete",
                                !formValues?.procedure_management.delete
                              )
                            }
                            name="delete"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.procedure_management.delete}
                            onChange={(e: any) =>
                              handleChange1(
                                "procedure_management",
                                "delete",
                                !formValues1?.procedure_management.delete
                              )
                            }
                            name="delete"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.procedure_management.delete}
                            onChange={(e: any) =>
                              handleChange2(
                                "procedure_management",
                                "delete",
                                !formValues2?.procedure_management.delete
                              )
                            }
                            name="delete"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can edit</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.procedure_management.edit}
                            onChange={(e: any) =>
                              handleChange(
                                "procedure_management",
                                "edit",
                                !formValues?.procedure_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.procedure_management.edit}
                            onChange={(e: any) =>
                              handleChange1(
                                "procedure_management",
                                "edit",
                                !formValues1?.procedure_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.procedure_management.edit}
                            onChange={(e: any) =>
                              handleChange2(
                                "procedure_management",
                                "edit",
                                !formValues2?.procedure_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can view</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.procedure_management.view}
                            onChange={(e: any) =>
                              handleChange(
                                "procedure_management",
                                "view",
                                !formValues?.procedure_management.view
                              )
                            }
                            name="view"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.procedure_management.view}
                            onChange={(e: any) =>
                              handleChange1(
                                "procedure_management",
                                "view",
                                !formValues1?.procedure_management.view
                              )
                            }
                            name="view"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.procedure_management.view}
                            onChange={(e: any) =>
                              handleChange2(
                                "procedure_management",
                                "view",
                                !formValues2?.procedure_management.view
                              )
                            }
                            name="view"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="procedure-profile"
                      style={{ paddingTop: "50px" }}
                    >
                      <Typography>Profile</Typography>
                      <Typography>
                        Control the actions of users under profile section.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can edit username</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues?.profile_management.editUserName
                            }
                            onChange={(e: any) =>
                              handleChange(
                                "profile_management",
                                "editUserName",
                                !formValues?.profile_management.editUserName
                              )
                            }
                            name="editUserName"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues1?.profile_management.editUserName
                            }
                            onChange={(e: any) =>
                              handleChange1(
                                "profile_management",
                                "editUserName",
                                !formValues1?.profile_management.editUserName
                              )
                            }
                            name="editUserName"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues2?.profile_management.editUserName
                            }
                            onChange={(e: any) =>
                              handleChange2(
                                "profile_management",
                                "editUserName",
                                !formValues2?.profile_management.editUserName
                              )
                            }
                            name="editUserName"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can change password</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues?.profile_management.changePassword
                            }
                            onChange={(e: any) =>
                              handleChange(
                                "profile_management",
                                "changePassword",
                                !formValues?.profile_management.changePassword
                              )
                            }
                            name="changePassword"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues1?.profile_management.changePassword
                            }
                            onChange={(e: any) =>
                              handleChange1(
                                "profile_management",
                                "changePassword",
                                !formValues1?.profile_management.changePassword
                              )
                            }
                            name="changePassword"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues2?.profile_management.changePassword
                            }
                            onChange={(e: any) =>
                              handleChange2(
                                "profile_management",
                                "changePassword",
                                !formValues2?.profile_management.changePassword
                              )
                            }
                            name="changePassword"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can edit organisation</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues?.profile_management.editOrganisation
                            }
                            onChange={(e: any) =>
                              handleChange(
                                "profile_management",
                                "editOrganisation",
                                !formValues?.profile_management.editOrganisation
                              )
                            }
                            name="editOrganisation"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues1?.profile_management.editOrganisation
                            }
                            onChange={(e: any) =>
                              handleChange1(
                                "profile_management",
                                "editOrganisation",
                                !formValues1?.profile_management
                                  .editOrganisation
                              )
                            }
                            name="editOrganisation"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues2?.profile_management.editOrganisation
                            }
                            onChange={(e: any) =>
                              handleChange2(
                                "profile_management",
                                "editOrganisation",
                                !formValues2?.profile_management
                                  .editOrganisation
                              )
                            }
                            name="editOrganisation"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can change department</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues?.profile_management.editDepartment
                            }
                            onChange={(e: any) =>
                              handleChange(
                                "profile_management",
                                "editDepartment",
                                !formValues?.profile_management.editDepartment
                              )
                            }
                            name="editDepartment"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues1?.profile_management.editDepartment
                            }
                            onChange={(e: any) =>
                              handleChange1(
                                "profile_management",
                                "editDepartment",
                                !formValues1?.profile_management.editDepartment
                              )
                            }
                            name="editDepartment"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues2?.profile_management.editDepartment
                            }
                            onChange={(e: any) =>
                              handleChange2(
                                "profile_management",
                                "editDepartment",
                                !formValues2?.profile_management.editDepartment
                              )
                            }
                            name="editDepartment"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can change laboratory</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.profile_management.editLab}
                            onChange={(e: any) =>
                              handleChange(
                                "profile_management",
                                "editLab",
                                !formValues?.profile_management.editLab
                              )
                            }
                            name="editLab"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.profile_management.editLab}
                            onChange={(e: any) =>
                              handleChange1(
                                "profile_management",
                                "editLab",
                                !formValues1?.profile_management.editLab
                              )
                            }
                            name="editLab"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.profile_management.editLab}
                            onChange={(e: any) =>
                              handleChange2(
                                "profile_management",
                                "editLab",
                                !formValues2?.profile_management.editLab
                              )
                            }
                            name="editLab"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can change contact info</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.profile_management.editContact}
                            onChange={(e: any) =>
                              handleChange(
                                "profile_management",
                                "editContact",
                                !formValues?.profile_management.editContact
                              )
                            }
                            name="editContact"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues1?.profile_management.editContact
                            }
                            onChange={(e: any) =>
                              handleChange1(
                                "profile_management",
                                "editContact",
                                !formValues1?.profile_management.editContact
                              )
                            }
                            name="editContact"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={
                              formValues2?.profile_management.editContact
                            }
                            onChange={(e: any) =>
                              handleChange2(
                                "profile_management",
                                "editContact",
                                !formValues2?.profile_management.editContact
                              )
                            }
                            name="editContact"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can change designation </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={true}
                            onChange={(e: any) =>
                              handleChange(
                                "profile_management",
                                "editRole",
                                !formValues?.profile_management.editRole
                              )
                            }
                            name="editRole"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.profile_management.editRole}
                            onChange={(e: any) =>
                              handleChange1(
                                "profile_management",
                                "editRole",
                                !formValues1?.profile_management.editRole
                              )
                            }
                            name="editRole"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.profile_management.editRole}
                            onChange={(e: any) =>
                              handleChange2(
                                "profile_management",
                                "editRole",
                                !formValues2?.profile_management.editRole
                              )
                            }
                            name="editRole"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="procedure-profile"
                      style={{ paddingTop: "50px" }}
                    >
                      <Typography>Role Management</Typography>
                      <Typography>
                        Control the actions of users under role management
                        section.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can edit access control</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={true}
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.role_management.edit}
                            onChange={(e: any) =>
                              handleChange1(
                                "role_management",
                                "edit",
                                !formValues1?.role_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.role_management.edit}
                            onChange={(e: any) =>
                              handleChange2(
                                "role_management",
                                "edit",
                                !formValues2?.role_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="procedure-profile"
                      style={{ paddingTop: "50px" }}
                    >
                      <Typography>User Management</Typography>
                      <Typography>
                        Control the actions of users under user management
                        section.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can add user</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.user_management.create}
                            onChange={(e: any) =>
                              handleChange(
                                "user_management",
                                "create",
                                !formValues?.user_management.create
                              )
                            }
                            name="create"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.user_management.create}
                            onChange={(e: any) =>
                              handleChange1(
                                "user_management",
                                "create",
                                !formValues1?.user_management.create
                              )
                            }
                            name="create"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.user_management.create}
                            onChange={(e: any) =>
                              handleChange2(
                                "user_management",
                                "create",
                                !formValues2?.user_management.create
                              )
                            }
                            name="create"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can delete user </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.user_management.delete}
                            onChange={(e: any) =>
                              handleChange(
                                "user_management",
                                "delete",
                                !formValues?.user_management.delete
                              )
                            }
                            name="delete"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.user_management.delete}
                            onChange={(e: any) =>
                              handleChange1(
                                "user_management",
                                "delete",
                                !formValues1?.user_management.delete
                              )
                            }
                            name="delete"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.user_management.delete}
                            onChange={(e: any) =>
                              handleChange2(
                                "user_management",
                                "delete",
                                !formValues2?.user_management.delete
                              )
                            }
                            name="delete"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can edit user</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.user_management.edit}
                            onChange={(e: any) =>
                              handleChange(
                                "user_management",
                                "edit",
                                !formValues?.user_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.user_management.edit}
                            onChange={(e: any) =>
                              handleChange1(
                                "user_management",
                                "edit",
                                !formValues1?.user_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.user_management.edit}
                            onChange={(e: any) =>
                              handleChange2(
                                "user_management",
                                "edit",
                                !formValues2?.user_management.edit
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>Can View user</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues?.user_management.view}
                            onChange={(e: any) =>
                              handleChange(
                                "user_management",
                                "view",
                                !formValues?.user_management.view
                              )
                            }
                            name="edit"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues1?.user_management.view}
                            onChange={(e: any) =>
                              handleChange1(
                                "user_management",
                                "view",
                                !formValues1?.user_management.view
                              )
                            }
                            name="view"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            sx={{
                              color: "#9F9F9F",
                              "&.Mui-checked": {
                                color: "#FFC60B",
                              },
                              width: "30px",
                              height: "30px",
                            }}
                            checked={formValues2?.user_management.view}
                            onChange={(e: any) =>
                              handleChange2(
                                "user_management",
                                "view",
                                !formValues2?.user_management.view
                              )
                            }
                            name="view"
                            checkedIcon={<RadioButtonCheckedOutlinedIcon />}
                            icon={<RadioButtonUncheckedOutlinedIcon />}
                          />
                        }
                        label=""
                        className="common-radio"
                        style={{ margin: "0rem" }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <Box className="edit-details" sx={{ p: 2 }}>
        <Button
          variant="contained"
          className="cancel-btn"
          onClick={() => handleReset()}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          className="add-btn"
          onClick={() => handleSave()}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

const RolesPage = withSettingsLayout(Roles);

export default RolesPage;
