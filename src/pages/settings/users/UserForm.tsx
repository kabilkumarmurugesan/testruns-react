/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from "react";
import Dialog from "@mui/material/Dialog";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchUpdateUserData, postUserData } from "../../../api/userAPI";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartmentById } from "../../../api/departmentAPI";
import { fetchSingleRoleData } from "../../../api/roleApi";
import { fetchLabById } from "../../../api/labAPI";
import SuccessPopup from "../../../components/SuccessPopup";
import Confirmationpopup from "../../../components/ConfirmationPopup";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../firebase.config";
import { toast } from "react-toastify";
import { fetchinstitutionData } from "../../../api/institutionAPI";
import moment from "moment";
import { fetchOrganizationById } from "../../../api/organizationAPI";
import SpinerLoader from "../../../components/SpinnerLoader";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .max(30, "Must be 20 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .max(20, "Must be 20 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email")
    .matches(emailRegex, "In-correct email"),
  phoneNumber: Yup.string().notRequired(),
  // .matches(phoneRegExp, 'Phone number is not valid')
  // .min(10, "Enter valid number")
  // .max(10, "too long").required("Mobile number is required"),
  organisationId: Yup.string().required("Organistation is required"),
  instituteId: Yup.string().required("Institution is required"),
  departmentId: Yup.array()
    .min(1, "Please select at least one Department")
    .required("Department is required"),
  laboratoryId: Yup.array()
    .min(1, "Please select at least one Laboratory")
    .required("Laboratory is required"),
  // user_id: Yup.string().required(),
  role: Yup.string().required("Role is required"),
  // status: Yup.string().required("Status is required"),
});

const UserForm = React.forwardRef(
  ({ closeFormPopup, openConfirmationPopup, reload, rowVal }: any, ref) => {
    const [departments, setDepartments] = React.useState<any>([]);
    //   rowVal?.departmentId?.map((item: any) => (departmentSliceData?.find(obj => (obj._id == item) ?{
    //     label: item?.name,
    //     value: item?.name,
    //     id: item?._id,
    //   }:"")),
    // ));
    const [laboratory, setLaboratory] = React.useState<any>([]);
    //   rowVal?.laboratoryId?.map((item: any) => ({
    //     label: item?.name,
    //     value: item?.name,
    //     id: item?._id,
    //   })),
    // );
    const [formPopup, setFormPopup] = React.useState(false);
    const [departmentData, setDepartmentData] = React.useState([]);
    const [roleData, setRoleData] = React.useState([]);
    const [labEdit, setLabEdit] = React.useState(false);
    const [labData, setLabData] = React.useState([]);
    const dispatch: any = useDispatch();
    const [type, setType] = React.useState(null);
    const successPopupRef: any = React.useRef();
    const confirmationPopupRef: any = React.useRef();
    const [organizationData, setOrganizationData] = React.useState([]);
    const [institutionData, setInstitutionData] = React.useState([]);
    const [sideBarLoader, setSideBarLoader] = React.useState(true);
    const [userData, setUserData] = React.useState<any>({});
    const Placeholder = ({ children }: any) => {
      return <div>{children}</div>;
    };
    const loginUserSliceData = useSelector(
      (state: any) => state.userLogin?.data?.verifyToken
    );
    const departmentSliceData = useSelector(
      (state: any) => state.department.data?.get_all_departments
    );
    const labSliceData = useSelector(
      (state: any) => state.lab.data?.get_all_labs
    );
    const roleSliceData = useSelector(
      (state: any) => state.role.data?.find_roles
    );
    const organizationSliceData = useSelector(
      (state: any) => state.organization.data?.get_all_organisations
    );
    const institutionSliceData = useSelector(
      (state: any) => state.institution.data?.get_all_institute
    );
    React.useImperativeHandle(ref, () => ({
      open(state: any, type: any, row: any) {
        formik.setFieldValue("instituteId", loginUserSliceData?.instituteId);
        setType(type);

        if (row?._id) {
          if (row) {
            setSideBarLoader(false);
            setUserData(row);

            formik.setFieldValue("firstName", row?.firstName || "");
            formik.setFieldValue("lastName", row?.lastName || "");
            formik.setFieldValue("email", row?.email || "");
            formik.setFieldValue("phoneNumber", row?.phoneNumber || "");
            formik.setFieldValue("organisationId", row?.organisationId || "");
            formik.setFieldValue("instituteId", row?.instituteId || "");
            formik.setFieldValue(
              "departmentId",
              row?.departmentId?.map((item: any) =>
                departmentData?.find((obj: any) => obj.id == item)
              ) || []
            );
            setDepartments(
              row?.departmentId?.map((item: any) =>
                departmentData?.find((obj: any) => obj?.id == item)
              )
            );
            // formik.setFieldValue('departmentId', departmentSliceData);
            formik.setFieldValue(
              "laboratoryId",
              row?.laboratoryId?.map((item: any) =>
                labData?.find((obj: any) => obj.id == item)
              ) || []
            );
            setLaboratory(
              row?.laboratoryId?.map((item: any) =>
                labData?.find((obj: any) => obj?.id == item)
              )
            );
            formik.setFieldValue("user_id", row?.user_id || "");
            formik.setFieldValue("role", row?.role || "");
            formik.setFieldValue("status", row?.status || "");
            // setRowValue(row?.get_uesr)
            setFormPopup(state);
          }
        } else {
          setSideBarLoader(false);
          setFormPopup(state);
          dispatch(
            fetchOrganizationById({
              instituteId: loginUserSliceData?.instituteId,
            })
          );
        }
      },
    }));

    React.useEffect(() => {
      if (type == "edit") {
        dispatch(fetchOrganizationById({ instituteId: userData?.instituteId }));
        formik.setFieldValue("firstName", userData?.firstName || "");
        formik.setFieldValue("lastName", userData?.lastName || "");
        formik.setFieldValue("email", userData?.email || "");
        formik.setFieldValue("phoneNumber", userData?.phoneNumber || "");
        formik.setFieldValue("organisationId", userData?.organisationId || "");
        formik.setFieldValue("instituteId", userData?.instituteId || "");
        formik.setFieldValue(
          "departmentId",
          userData?.departmentId?.map((item: any) =>
            departmentData?.find((obj: any) => obj.id == item)
          ) || []
        );
        formik.setFieldValue(
          "laboratoryId",
          userData?.laboratoryId?.map((item: any) =>
            labData?.find((obj: any) => obj.id == item)
          ) || []
        );
        formik.setFieldValue("user_id", userData?.user_id || "");
        formik.setFieldValue("role", userData?.role || "");
        formik.setFieldValue("status", userData?.status || "");
        setTimeout(() => {
          setSideBarLoader(false);
        }, 2000);
      }
    }, [institutionData, userData]);

    const checkCredentials = (first_name: any) => {
      return true;
    };

    React.useEffect(() => {
      if (labSliceData) {
        const transformedLabs = labSliceData?.map((obj: any) => ({
          label: obj.name,
          value: obj.name,
          id: obj._id,
        }));

        const matchedData = laboratory?.filter((lab: any) =>
          transformedLabs?.some((transLab: any) => transLab?.id === lab?.id)
        );

        if (labEdit) {
          formik.setValues({
            ...formik.values,
            laboratoryId: matchedData,
          });
          setLaboratory(matchedData);
        }
      }
    }, [labSliceData]);
    const onSubmit = async (values: any) => {
      const isMatch = checkCredentials(values.firstName);
      setSideBarLoader(true);
      if (isMatch) {
        var deptArray: any = [];
        departments?.map((item: any) => deptArray.push(item?.id));
        var labArray: any = [];
        laboratory?.map((item: any) => labArray.push(item?.id));
        let userValues: any = {
          // uid:"",
          fullName: `${values.firstName} ${values.lastName}`,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email?.toLowerCase(),
          phoneNumber: values.phoneNumber.toString(),
          organisationId: values.organisationId,
          instituteId: values.instituteId,
          departmentId: deptArray,
          laboratoryId: labArray,
          role: values.role,
          createdOn: moment(new Date()).format("MM/DD/YYYY"),
          createdBy: "Admin",
        };

        if (type == "edit") {
          userValues["_id"] = userData?._id;
          await dispatch(fetchUpdateUserData(userValues));
          const auths: any = auth;
          await updateProfile(auths?.currentUser, {
            displayName: values.firstName,
          })
            .then((res) => {
              toast(
                `${
                  type == "edit"
                    ? "User details have been updated successfully"
                    : "User has been created successfully. Welcome aboard!"
                }  !`,
                {
                  style: {
                    background: "#00bf70",
                    color: "#fff",
                  },
                }
              );
            })
            .catch((error) => {
              console.error(error);
            });
          await submitFormPopup();
        } else {
          await dispatch(postUserData(userValues))
            .then((res: any) => {
              toast(
                res?.create_user !== undefined
                  ? res?.create_user?.message
                  : "user already exits",
                {
                  style: {
                    background:
                      res?.create_user == undefined ? "red" : "#00bf70",
                    color: "#fff",
                    textTransform: "capitalize",
                  },
                }
              );
              submitFormPopup();
            })
            .catch((err: any) => {
              console.error(err);
            });
        }
      } else {
        formik.setFieldError("first_name", "Invalid first name");
      }
    };

    const clearForm = () => {
      formik.resetForm();
      setLaboratory([]);
      setDepartments([]);
      formik.setFieldValue("departmentId", []);
      formik.setFieldValue("laboratoryId", []);
    };
    const submitFormPopup = () => {
      setFormPopup(false);
      reload();
      clearForm();
    };

    const handleConfirmationState = (state: any) => {
      if (state === 0) {
        confirmationPopupRef.current.open(false);
      } else {
        confirmationPopupRef.current.open(false);
        setFormPopup(false);
        setSideBarLoader(true);
        clearForm();
      }
    };

    const formik: any = useFormik({
      initialValues: {
        firstName: rowVal?.firstName ? rowVal?.firstName : "",
        lastName: rowVal?.lastName ? rowVal?.lastName : "",
        email: rowVal?.email ? rowVal?.email : "",
        phoneNumber: rowVal?.phoneNumber ? rowVal?.phoneNumber : "",
        organisationId: rowVal?.organisationId ? rowVal?.organisationId : "",
        instituteId: rowVal?.instituteId ? rowVal?.instituteId : "",
        departmentId: rowVal?.departmentId ? rowVal?.departmentId : [],
        laboratoryId: rowVal?.laboratoryId ? rowVal?.laboratoryId : [],
        user_id: "USER_12345678",
        role: rowVal?.role ? rowVal?.role : "",
        status: rowVal?.status ? rowVal?.status : "",
      },
      validationSchema: validationSchema,
      onSubmit: onSubmit,
    });

    React.useEffect(() => {
      let payload: any = {};
      if (formik.values.organisationId !== "") {
        payload["organisationId"] = formik.values.organisationId;
      } else {
        payload["organisationId"] = loginUserSliceData.organisationId;
      }
      dispatch(fetchDepartmentById(payload));
    }, [formik.values.organisationId]);

    React.useEffect(() => {
      var dept: any = [];
      if (formik.values.departmentId.length > 0) {
        formik.values.departmentId?.map((item: any) => dept.push(item?.id));
      } else {
        dept = loginUserSliceData.departmentId;
      }
      dispatch(fetchLabById({ departmentId: dept }));
    }, [formik.values.departmentId]);

    React.useEffect(() => {
      setRoleData(
        roleSliceData?.map((item: any) => ({
          label: item.name,
          value: item._id,
        }))
      );
    }, [
      departmentSliceData,
      roleSliceData,
      organizationSliceData,
      institutionSliceData,
    ]);

    React.useEffect(() => {
      const mappedDepartments = (userData?.departmentId || []).map(
        (id: string) => {
          var department = departmentSliceData?.find(
            (obj: any) => obj._id == id
          );
          // var dept1=department?.filter((department) => department !== null && department!==undefined)
          if (department !== undefined) {
            return {
              label: department.name,
              value: department.name,
              id: department._id,
            };
          } else {
            // Handle the case where the laboratory with the specified ID is not found
            departmentSliceData.map((item: any) => {
              return {
                label: item.name,
                value: item.name,
                id: item._id,
              };
            });
          }

          // Handle the case where the department with the specified ID is not found
        }
      );

      if (type == "edit") {
        formik.setFieldValue(
          "departmentId",
          mappedDepartments[0] !== undefined && mappedDepartments[0] !== null
            ? mappedDepartments
            : []
        );
      }
      setDepartmentData(
        type == "edit"
          ? mappedDepartments?.length !== 0 &&
            mappedDepartments[0] !== undefined
            ? mappedDepartments
            : departmentSliceData?.map((item: any) => ({
                label: item.name,
                value: item.name,
                id: item._id,
              }))
          : departmentSliceData?.map((item: any) => ({
              label: item.name,
              value: item.name,
              id: item._id,
            }))
      );
    }, [departmentSliceData]);

    React.useEffect(() => {
      const mappedDLabs = userData?.laboratoryId
        ?.map((id: string) => {
          var lab = labSliceData?.find((obj: any) => obj._id === id);

          if (lab !== undefined) {
            return {
              label: lab.name,
              value: lab.name,
              id: lab._id,
            };
          } else {
            // Handle the case where the laboratory with the specified ID is not found
            labSliceData?.map((item: any) => {
              return {
                label: item.name,
                value: item.name,
                id: item._id,
              };
            });
          }
        })
        .filter((lab: any) => lab !== null);

      formik.setFieldValue(
        "laboratoryId",
        mappedDLabs !== undefined &&
          mappedDLabs[0] !== undefined &&
          mappedDLabs[0] !== null
          ? mappedDLabs
          : []
      );

      setLabData(
        labSliceData?.map((item: any) => ({
          label: item.name,
          value: item.name,
          id: item._id,
        }))
      );
    }, [labSliceData]);

    React.useEffect(() => {
      dispatch(fetchinstitutionData());
    }, []);

    React.useEffect(() => {
      let payload2 = {
        instituteId: loginUserSliceData?.instituteId,
      };
      dispatch(fetchSingleRoleData(payload2));
      formik.setFieldValue("instituteId", loginUserSliceData?.instituteId);
      var organization = organizationSliceData?.filter(
        (organization: any) =>
          organization._id === loginUserSliceData?.organisationId
      );
      setOrganizationData(
        organization?.map((item: any) => ({
          label: item.name,
          value: item.name,
          id: item._id,
        }))
      );
    }, [loginUserSliceData, organizationSliceData]);

    return (
      <div>
        <Dialog
          open={formPopup}
          keepMounted
          // onClose={() => {
          //   closeFormPopup(false);
          //   clearForm();
          // }}
          aria-labelledby="add-new-asset-title"
          aria-describedby="add-new-asset"
          fullWidth
          maxWidth="md"
          className="popup-outer"
          disableScrollLock={true}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box className="popup-section">
              <Box className="title-popup">
                <Typography>{type} user</Typography>
                <CloseIcon
                  onClick={() => {
                    closeFormPopup(false);
                    setSideBarLoader(true);
                    clearForm();
                  }}
                />
              </Box>
              {sideBarLoader ? (
                <SpinerLoader isLoader={sideBarLoader} type={"small"} />
              ) : (
                <>
                  <Box>
                    <Grid container spacing={2} className="asset-popup">
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{ paddingRight: { sm: "1rem !important" } }}
                      >
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            First name
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <TextField
                            margin="none"
                            fullWidth
                            id="firstName"
                            name="firstName"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="First name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstName}
                            size="small"
                            error={
                              formik.touched.firstName &&
                              Boolean(formik.errors.firstName)
                            }
                          />
                          {formik.touched.firstName &&
                            formik.errors.firstName && (
                              <Typography className="error-field">
                                {formik.errors.firstName}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{
                          paddingLeft: { sm: "1rem !important" },
                          paddingTop: {
                            xs: "0rem !important",
                            sm: "1rem !important",
                          },
                        }}
                      >
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Last name<span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <TextField
                            margin="normal"
                            fullWidth
                            id="lastName"
                            name="lastName"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="Last name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastName}
                            size="small"
                            error={
                              formik.touched.lastName &&
                              Boolean(formik.errors.lastName)
                            }
                          />
                          {formik.touched.lastName &&
                            formik.errors.lastName && (
                              <Typography className="error-field">
                                {formik.errors.lastName}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} className="asset-popup">
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{ paddingRight: { sm: "1rem !important" } }}
                      >
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Email ID<span style={{ color: "#E2445C" }}>*</span>
                          </label>

                          <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="Email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            size="small"
                            className={type == "edit" ? "bg-gray-input" : ""}
                            disabled={type == "edit" ? true : false}
                            error={
                              formik.touched.email &&
                              Boolean(formik.errors.email)
                            }
                          />
                          {formik.touched.email && formik.errors.email && (
                            <Typography className="error-field">
                              {formik.errors.email}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{
                          paddingLeft: { sm: "1rem !important" },
                          paddingTop: {
                            xs: "0rem !important",
                            sm: "1rem !important",
                          },
                        }}
                      >
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Mobile number
                          </label>
                          <TextField
                            margin="none"
                            fullWidth
                            id="phoneNumber"
                            type="number"
                            name="phoneNumber"
                            autoComplete="off"
                            onInput={(e: any) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 10);
                            }}
                            InputLabelProps={{ shrink: false }}
                            placeholder="Mobile number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phoneNumber}
                            size="small"
                            error={
                              formik.touched.phoneNumber &&
                              Boolean(formik.errors.phoneNumber)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment sx={{ mx: 2 }} position="start">
                                  +91{" "}
                                </InputAdornment>
                              ),
                            }}
                          />
                          {formik.touched.phoneNumber &&
                            formik.errors.phoneNumber && (
                              <Typography className="error-field">
                                {formik.errors.phoneNumber}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} className="asset-popup">
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{
                          paddingLeft: { sm: "1rem !important" },
                          paddingTop: {
                            xs: "1rem !important",
                            sm: "1rem !important",
                          },
                          paddingRight: { sm: "1rem !important" },
                        }}
                      >
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Select role
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            className="placeholder-color"
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            renderValue={
                              formik.values.role !== ""
                                ? undefined
                                : () => <Placeholder>Select Role</Placeholder>
                            }
                            margin="none"
                            fullWidth
                            id="role"
                            name="role"
                            autoComplete="off"
                            placeholder="Role"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.role}
                            size="small"
                            error={
                              formik.touched.role && Boolean(formik.errors.role)
                            }
                          >
                            {roleData &&
                              roleData.map((item: any) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                          </Select>

                          {formik.touched.role && formik.errors.role && (
                            <Typography className="error-field">
                              {formik.errors.role}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{
                          paddingLeft: { sm: "1rem !important" },
                          paddingTop: {
                            xs: "0rem !important",
                            sm: "1rem !important",
                          },
                        }}
                      >
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Institution
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>

                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            className="placeholder-color"
                            displayEmpty
                            disabled={true}
                            IconComponent={ExpandMoreOutlinedIcon}
                            renderValue={
                              formik.values.instituteId !== ""
                                ? undefined
                                : () => (
                                    <Placeholder>
                                      Select Institution
                                    </Placeholder>
                                  )
                            }
                            margin="none"
                            fullWidth
                            id="instituteId"
                            name="instituteId"
                            autoComplete="off"
                            placeholder="Institution"
                            onChange={formik.handleChange}
                            onBlur={() => {
                              formik.handleBlur();
                              dispatch(
                                fetchOrganizationById({
                                  instituteId: formik.values.instituteId,
                                })
                              );
                            }}
                            value={formik.values.instituteId}
                            size="small"
                            error={
                              formik.touched.instituteId &&
                              Boolean(formik.errors.instituteId)
                            }
                          >
                            {institutionSliceData?.map((item: any) => (
                              <MenuItem key={item._id} value={item._id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>

                          {formik.touched.instituteId &&
                            formik.errors.instituteId && (
                              <Typography className="error-field">
                                {formik.errors.instituteId}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      className="asset-popup multi-selection"
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{ paddingRight: { sm: "1rem !important" } }}
                      >
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Organisation
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>

                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            className="placeholder-color"
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            // disabled={
                            //   formik.values.instituteId !== '' ? false : true
                            // }
                            disabled={type === "edit"}
                            renderValue={
                              formik.values.organisationId !== ""
                                ? undefined
                                : () => (
                                    <Placeholder>
                                      Select Organization
                                    </Placeholder>
                                  )
                            }
                            margin="none"
                            fullWidth
                            id="organisationId"
                            name="organisationId"
                            autoComplete="off"
                            placeholder="Organization"
                            onChange={formik.handleChange}
                            onBlur={() => {
                              formik.handleBlur();
                              dispatch(
                                fetchDepartmentById({
                                  organisationId: formik.values.organisationId,
                                })
                              );
                            }}
                            value={formik.values.organisationId}
                            size="small"
                            error={
                              formik.touched.organisationId &&
                              Boolean(formik.errors.organisationId)
                            }
                          >
                            {organizationData?.map((item: any, index) => (
                              <MenuItem key={index} value={item.id}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>

                          {formik.touched.organisationId &&
                            formik.errors.organisationId && (
                              <Typography className="error-field">
                                {formik.errors.organisationId}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                      {formik.values.role !== "65741c069d53d19df8321e6c" && (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          sx={{
                            paddingLeft: { sm: "1rem !important" },
                            paddingTop: {
                              xs: "0rem !important",
                              sm: "1rem !important",
                            },
                          }}
                        >
                          <Box style={{ position: "relative" }}>
                            <label style={{ display: "block" }}>
                              Department/s
                              <span style={{ color: "#E2445C" }}>*</span>
                            </label>
                            <Autocomplete
                              multiple
                              id="departmentId"
                              disableCloseOnSelect
                              value={departments}
                              disabled={
                                formik.values.organisationId !== ""
                                  ? false
                                  : true
                              }
                              options={
                                departmentData !== undefined
                                  ? departmentData
                                  : []
                              }
                              getOptionLabel={(option: any) => option?.label}
                              isOptionEqualToValue={(option: any, value: any) =>
                                value?.id == option?.id
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={
                                    departments?.length == 0
                                      ? "Department/s"
                                      : ""
                                  }
                                />
                              )}
                              fullWidth
                              size="medium"
                              renderOption={(
                                props,
                                option: any,

                                { selected }
                              ) => (
                                <React.Fragment>
                                  <li {...props}>
                                    <Checkbox
                                      style={{ marginRight: 0 }}
                                      checked={selected}
                                    />
                                    {option?.value}
                                  </li>
                                </React.Fragment>
                              )}
                              onChange={(_, selectedOptions: any) => {
                                const prevLength = departments.length;
                                const currentLength = selectedOptions.length;
                                setDepartments(selectedOptions);
                                if (currentLength > prevLength) {
                                  setLabEdit(false);
                                } else if (currentLength < prevLength) {
                                  setLabEdit(true);
                                }
                                formik.setValues({
                                  ...formik.values,
                                  departmentId: selectedOptions,
                                });
                                const dept: any = [];
                                selectedOptions?.map((item: any) =>
                                  dept.push(item?.id)
                                );
                                dispatch(fetchLabById({ departmentId: dept }));
                              }}
                              onBlur={() => {
                                var dept: any = [];
                                departments?.map((item: any) =>
                                  dept.push(item?.id)
                                );
                                let payload: any = {
                                  departmentId: dept,
                                };
                                dispatch(fetchLabById(payload));
                              }}
                            />
                            {formik.touched.departmentId &&
                              formik.errors.departmentId && (
                                <Typography className="error-field">
                                  {formik.errors.departmentId}
                                </Typography>
                              )}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      className="asset-popup prod-input-auto prod-multi"
                    >
                      {formik.values.role !== "65741c069d53d19df8321e6c" && (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          sx={{
                            paddingLeft: { sm: "1rem !important" },
                            paddingTop: {
                              xs: "1rem !important",
                              sm: "1rem !important",
                            },
                            paddingRight: { sm: "1rem !important" },
                          }}
                        >
                          <Box style={{ position: "relative" }}>
                            <label style={{ display: "block" }}>
                              Laboratory/ies
                              <span style={{ color: "#E2445C" }}>*</span>
                            </label>

                            <Autocomplete
                              multiple
                              id="laboratoryId"
                              value={laboratory}
                              options={labData !== undefined ? labData : []}
                              disabled={
                                departments?.length !== 0 ? false : true
                              }
                              getOptionLabel={(option: any) => option?.label}
                              isOptionEqualToValue={(option: any, value: any) =>
                                value?.id == option?.id
                              }
                              disableCloseOnSelect
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={
                                    laboratory?.length == 0
                                      ? "Laboratory/ies"
                                      : ""
                                  }
                                />
                              )}
                              fullWidth
                              size="medium"
                              renderOption={(
                                props,
                                option: any,
                                { selected }
                              ) => (
                                <React.Fragment>
                                  <li {...props}>
                                    <Checkbox
                                      style={{ marginRight: 0 }}
                                      checked={selected}
                                    />
                                    {option?.value}
                                  </li>
                                </React.Fragment>
                              )}
                              onChange={(_, selectedOptions: any) => {
                                setLaboratory(selectedOptions);
                                formik.setValues({
                                  ...formik.values,
                                  laboratoryId: selectedOptions,
                                });
                              }}
                            />
                            {formik.touched.laboratoryId &&
                              formik.errors.laboratoryId && (
                                <Typography className="error-field">
                                  {formik.errors.laboratoryId}
                                </Typography>
                              )}
                          </Box>
                        </Grid>
                      )}
                      {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ paddingRight: { sm: '1rem !important' } }}
                  >
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>
                        User ID (autogenerated)
                      </label>
                      <TextField
                        margin="none"
                        fullWidth
                        id="user_id"
                        name="user_id"
                        autoComplete="user_id"
                        InputLabelProps={{ shrink: false }}
                        placeholder="User ID"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.user_id}
                        size="small"
                        error={
                          formik.touched.user_id &&
                          Boolean(formik.errors.user_id)
                        }
                        disabled
                      />
                      {formik.touched.user_id && formik.errors.user_id && (
                        <Typography className="error-field">
                          {formik.errors.user_id}
                        </Typography>
                      )}
                    </Box>
                  </Grid> */}
                    </Grid>
                    <Grid container spacing={2} className="asset-popup">
                      {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ paddingRight: { sm: '1rem !important' } }}
                  >
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>Current status</label>

                      <Select
                        className="placeholder-color"
                        displayEmpty
                        IconComponent={ExpandMoreOutlinedIcon}
                        renderValue={
                          formik.values.status !== ''
                            ? undefined
                            : () => <Placeholder>Select Status</Placeholder>
                        }
                        margin="none"
                        fullWidth
                        id="status"
                        name="status"
                        autoComplete="status"
                        placeholder="Laboratory"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.status}
                        size="small"
                        error={
                          formik.touched.status && Boolean(formik.errors.status)
                        }
                      >
                        {StatusList.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.status && formik.errors.status && (
                        <Typography className="error-field">
                          {formik.errors.status}
                        </Typography>
                      )}
                    </Box>
                  </Grid> */}
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      display: { xs: "block", sm: "flex" },
                      justifyContent: "flex-end",
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        confirmationPopupRef.current.open(true);
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        type == "edit"
                          ? !formik.dirty
                          : Object.keys(formik.errors).length == 0
                          ? false
                          : true
                      }
                      // onClick={submitFormPopup}
                      className="add-btn"
                    >
                      {type === "edit" ? "Update" : "Create"}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </form>
        </Dialog>

        <SuccessPopup ref={successPopupRef} type={type} />
        <Confirmationpopup
          ref={confirmationPopupRef}
          confirmationState={handleConfirmationState}
          type={type}
        />
      </div>
    );
  }
);

export default UserForm;
