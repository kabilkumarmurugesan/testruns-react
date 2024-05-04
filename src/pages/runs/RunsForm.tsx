/* eslint-disable react/display-name */
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Checkbox,
  CircularProgress,
  Autocomplete,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Avatars from "../../assets/images/Avatars.svg";
import AddIcon from "@mui/icons-material/Add";
import AddPeoplePopup from "../../components/AddPeoplePopup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchProcedureData } from "../../api/procedureAPI";
import {
  fetchSingleRunsData,
  fetchUpdateRunsData,
  postRunsData,
} from "../../api/RunsAPI";
import Confirmationpopup from "../../components/ConfirmationPopup";
import SuccessPopup from "../../components/SuccessPopup";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "react-toastify";
import { fetchbulkRunz } from "../../api/bulkRunz";

const validationSchema = Yup.object().shape({
  procedureId: Yup.object().required("Procedure name is required"),
  createdOn: Yup.string().required("Created date is required"),
  departmentId: Yup.array().notRequired(),
  laboratoryId: Yup.array().notRequired(),
  objective: Yup.string()
    .trim()
    .required("Test Objective is required")
    .max(35, "Label must be at most 35 characters"),
  // dueDate: Yup.date().required('Due Date is required'),
  // dueDate: Yup.string().required('Due Date is required').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, 'Invalid date'),
  assignedTo: Yup.string().notRequired(),
  organisationId: Yup.string().required("Procedure Name is required"),
  userId: Yup.string().notRequired(),
});

const RunsForm = React.forwardRef(
  (
    {
      openConfirmationPopup,
      type,
      formData,
      reload,
      handleReloadSingleData,
    }: any,
    ref
  ) => {
    const [assignUser, setAssignUser] = React.useState("");

    const [departmentData, setDepartmentData] = React.useState([]);

    let DepartmentData = formData?.departmentId?.map((item: any) => ({
      label: item.name,
      value: item.name,
      id: item._id,
    }));

    let LabData = formData?.laboratoryId?.map((item: any) => ({
      label: item.name,
      value: item.name,
      id: item._id,
    }));
    const loginUserSliceData = useSelector(
      (state: any) => state.userLogin.data
    );
    const [lab, setLab] = React.useState(LabData ? LabData : []);
    const [procedureName, setProcedureName] = React.useState();
    const [assignedToName, setAssignedToName] = React.useState();

    const [department, setDepartment] = React.useState(
      DepartmentData ? DepartmentData : []
    );

    const [departments, setDepartments] = React.useState(
      formData?.departmentId?.map((item: any) => ({
        label: item?.name,
        value: item?.name,
        id: item?._id,
      }))
    );
    const [laboratory, setLaboratory] = React.useState(
      formData?.laboratoryId?.map((item: any) => ({
        label: item?.name,
        value: item?.name,
        id: item?._id,
      }))
    );

    const [labData, setLabData] = React.useState([]);
    const dispatch: any = useDispatch();
    const confirmationPopupRef: any = React.useRef();
    const successPopupRef: any = React.useRef();
    const dueDateInputRef: any = React.useRef(null);

    const [runsOpen, setRunsOpen] = React.useState(false);
    const [runCreate, setRunsCreate] = React.useState(false);
    const runzSliceData = useSelector((state: any) => state.runs.data);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [inputValue, setInputValue] = useState(null);
    const [isAssigned, setIsAssigned] = React.useState(false);
    const [dueDate, setDueDate] = React.useState<any>(null);
    const [error, setError] = React.useState("");

    const handleInputChange = (event: any, newInputValue: any) => {
      // Fetch suggestions when the user types
      setInputValue(newInputValue !== "undefined" ? newInputValue : "");
    };
    React.useEffect(() => {
      if (dueDateInputRef.current) {
        dueDateInputRef.current.disabled = true;
      }
    }, [dueDateInputRef.current]);
    React.useEffect(() => {
      formik.setFieldValue("objective", runzSliceData?.get_run?.objective);
      formik.setFieldValue(
        "laboratoryId",
        runzSliceData?.get_run?.laboratoryId
      );
      formik.setFieldValue(
        "departmentId",
        runzSliceData?.get_run?.departmentId
      );
      formik.setFieldValue("procedureId", runzSliceData?.get_run?.procedureId);
      formik.setFieldValue(
        "dueDate",
        type === "edit" ? dayjs(runzSliceData?.get_run?.dueDate) : null
      );
      if (type === "edit") {
        setDueDate(dayjs(runzSliceData?.get_run?.dueDate, "MM/DD/YYYY"));
      }
    }, [runzSliceData]);

    React.useImperativeHandle(ref, () => ({
      open(state: any, row: any) {
        setRunsCreate(state);
        let payload: any = {
          page: 1,
          perPage: 10,
          searchBy: "name",
        };
        if (
          loginUserSliceData?.verifyToken?.role[0]?.name === "Tester" ||
          loginUserSliceData?.verifyToken?.role[0]?.name === "Requester"
        ) {
          payload["laboratoryId"] = singleUserData?.laboratoryId;
        }
        if (loginUserSliceData?.verifyToken?.role[0]?.name === "Admin") {
          payload["organisationId"] = singleUserData?.organisationId;
        }

        if (type === "edit") {
          if (row?._id) {
            let payload = {
              _id: row?._id,
            };
            dispatch(fetchSingleRunsData(payload));
            // formik.setFieldValue('procedureId',runzSliceData?.get_run?.procedureId?._id)
            formik.setFieldValue(
              "objective",
              runzSliceData?.get_run?.objective
            );
            formik.setFieldValue(
              "procedureId",
              runzSliceData?.get_run?.procedureId
            );
            formik.setFieldValue(
              "laboratoryId",
              runzSliceData?.get_run?.laboratoryId
            );
            formik.setFieldValue(
              "departmentId",
              runzSliceData?.get_run?.departmentId
            );

            formik.setFieldValue(
              "dueDate",
              dayjs(runzSliceData?.get_run?.dueDate)
            );
            setDepartment(
              runzSliceData?.get_run?.departmentId?.map((item: any) => ({
                label: item.name,
                value: item.name,
                id: item._id,
              }))
            );
            setLab(
              runzSliceData?.get_run?.laboratoryId?.map((item: any) => ({
                label: item.name,
                value: item.name,
                id: item._id,
              }))
            );
            setDueDate(dayjs(runzSliceData?.get_run?.dueDate, "MM/DD/YYYY"));
          }
        } else {
          dispatch(fetchProcedureData(payload));
          formik.setFieldValue("objective", "");
          formik.setFieldValue("procedureId", null);
        }
      },
    }));

    const checkCredentials = () => {
      if (type !== "edit") {
        if (isAssigned) {
          return true;
        } else {
          setIsAssigned(false);
        }
      } else {
        setIsAssigned(true);
        return true;
      }
    };
    const singleUserData = useSelector(
      (state: any) => state.user?.data?.get_user
    );
    var deptArray: any = [];
    var labArray: any = [];
    const onSubmit = async (values: any) => {
      setBtnLoading(true);
      const isMatch = checkCredentials();
      if (isMatch) {
        department?.map((item: any) => deptArray.push(item?.id));

        lab?.map((item: any) => labArray.push(item?.id));

        let runsValues: any = {
          objective: values.objective,
          procedureId: values.procedureId?._id,
          departmentId: deptArray,
          laboratoryId: labArray,
          assignedTo: values.assignedTo,
          assignedBy: values.assignedBy,
          dueDate: moment(values.dueDate).format("MM/DD/YYYY"),
          createdOn: moment(values.createdOn.$d).format("MM/DD/YYYY"),
          procedureName: procedureName,
          assignedToName: assignedToName,
          assignedByName: values.assignedByName,
          // status: values.status,
          organisationId: values.organisationId,
          userId: singleUserData?._id,
          // procedureDetials:values.procedureDetials
        };

        if (type === "edit") {
          runsValues["_id"] = formData._id;
          await dispatch(fetchUpdateRunsData(runsValues));
          await submitFormPopup();
          await handleReloadSingleData();
          setBtnLoading(false);
          await reload();
        } else {
          if (
            assignUser !== undefined &&
            assignUser !== "" &&
            assignUser !== null
          ) {
            runsValues["shared"] = false;
            runsValues["status"] = values.status;
            runsValues["assignedTo"] = assignUser;
            runsValues["createdOn"] = moment(new Date()).format("MM/DD/YYYY");
            runsValues["userId"] = assignUser;

            await dispatch(fetchbulkRunz({ runs: [runsValues] }));
            await reload();
            setBtnLoading(false);
          } else {
            await dispatch(postRunsData(runsValues));
            setBtnLoading(false);
            await reload();
          }
        }
        submitFormPopup();
        clearForm();
      }
    };
    const createdDate =
      type === "edit"
        ? dayjs(moment(formData?.createdOn).format("MM/DD/YYYY"))
        : dayjs(moment(new Date()).format("MM/DD/YYYY"));

    const formik: any = useFormik({
      initialValues: {
        departmentId: "",
        laboratoryId: "",
        organisationId: singleUserData?.organisationId,
        procedureId: "",
        objective: "",
        dueDate: dueDate,
        createdOn:
          type === "edit"
            ? createdDate
            : dayjs(moment(new Date()).format("MM/DD/YYYY")),
        assignedBy: loginUserSliceData?.verifyToken?._id,
        assignedByName: loginUserSliceData?.verifyToken?.fullName,
        assignedTo: formData?.assignedTo?._id,
        status: "Created",
        procedureNumber: "",
        userId: "",
        // procedureDetials:""
      },
      validationSchema: validationSchema,
      onSubmit: onSubmit,
    });

    const departmentSliceData = useSelector(
      (state: any) => state.department.data?.get_all_departments
    );
    const labSliceData = useSelector(
      (state: any) => state.lab.data?.get_all_labs
    );
    React.useEffect(() => {
      setDepartmentData(
        departmentSliceData?.map((item: any) => ({
          label: item.name,
          value: item.name,
          id: item._id,
        }))
      );
      setLabData(
        labSliceData?.map((item: any) => ({
          label: item.name,
          value: item.name,
          id: item._id,
        }))
      );
    }, [departmentSliceData, labSliceData]);

    const handleDateChanges = (selectedDate: any, name: any) => {
      const formattedDate = moment(selectedDate?.$d).format("MM/DD/YYYY");
      formik.handleChange(name)(formattedDate);
      setDueDate(formattedDate);
      if (!moment(formattedDate).isValid()) {
        setError("Invaild Date");
      } else {
        setError("");
      }
    };
    const handleConfirmationState = (state: number) => {
      if (state === 0) {
        confirmationPopupRef.current.open(false);
      } else {
        confirmationPopupRef.current.open(false);
        // setRunsCreate(false);
        // clearForm()
        handleClose();
      }
    };

    const submitFormPopup = () => {
      setRunsCreate(false);
      toast(
        `${
          type === "edit"
            ? "Runs have been updated successfully!"
            : "New runs have been successfully created!"
        } !`,
        {
          style: {
            background: "#00bf70",
            color: "#fff",
          },
        }
      );
      // if(type=='edit'){

      // }
      // clearForm()
      handleClose();
      // successPopupRef.current.open(true, 'Run');
      // setTimeout(() => {
      //   successPopupRef.current.open(false, 'Run');
      // }, 3000);
    };
    const clearForm = () => {
      formik.resetForm();
      setDepartment([]);
      setLab([]);
      setAssignUser("");
      formik.dirty = false;
      // setOrganization([]);
    };
    const procedureSliceData = useSelector(
      (state: any) => state.procedure.data?.get_all_procedures
    );

    React.useEffect(() => {
      setLoading(true);
      let payload: any = {
        page: 1,
        perPage: 10,
        searchBy: "name",
        search: inputValue !== "undefined" && inputValue ? inputValue : "",
      };
      if (
        loginUserSliceData?.verifyToken?.role[0]?.name === "Tester" ||
        loginUserSliceData?.verifyToken?.role[0]?.name === "Requester"
      ) {
        payload["laboratoryId"] = singleUserData?.laboratoryId;
      }
      if (loginUserSliceData?.verifyToken?.role[0]?.name === "Admin") {
        payload["organisationId"] = singleUserData?.organisationId;
      }
      const getData = setTimeout(() => {
        dispatch(fetchProcedureData(payload))
          .then((res: any) => {
            if (res.get_all_procedures) {
              setLoading(false);
            }
          })
          .catch((err: any) => {
            console.error(err);
            setLoading(false);
          });
      }, 1000);
      return () => clearTimeout(getData);
    }, [inputValue]);

    const handleClose = () => {
      if (type !== "edit") {
        formik.resetForm();
        setDepartment([]);
        setLab([]);
        setDueDate("");
        setError("");
        setAssignUser("");
        formik.setFieldValue("procedureId", "");
      }
      setIsAssigned(false);
      setRunsCreate(false);
    };

    const handleAssign = (userList: any) => {
      setIsAssigned(true);
      setAssignUser(userList?.id);
      setAssignedToName(userList?.name);
    };

    const opt = procedureSliceData?.Procedures;

    return (
      <div>
        <Dialog
          open={runCreate}
          keepMounted
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
                <Typography>{type} Run</Typography>
                <CloseIcon
                  onClick={() => {
                    handleClose();
                  }}
                />
              </Box>
              <Box>
                <Grid container className="asset-popup" spacing={0}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box style={{ position: "relative" }}>
                      <label style={{ display: "block" }}>
                        Procedure name
                        <span style={{ color: "#E2445C" }}>*</span>
                      </label>
                      <Autocomplete
                        loading={loading}
                        value={formik.values.procedureId}
                        options={opt !== undefined ? opt : []}
                        disableClearable={true}
                        getOptionLabel={(option: any) => option.name}
                        isOptionEqualToValue={(option: any, value: any) =>
                          value === option?._id
                        }
                        onChange={(event, value) => {
                          setProcedureName(value?.name);
                          formik.setFieldValue("procedureId", value || "");
                          // Handle selection
                          let LabData = value?.laboratoryId?.map(
                            (item: any) => ({
                              label: item.name,
                              value: item.name,
                              id: item._id,
                            })
                          );

                          formik.setFieldValue("laboratoryId", LabData || "");
                          setLaboratory(LabData);

                          let DepartmentData = value?.departmentId?.map(
                            (item: any) => ({
                              label: item.name,
                              value: item.name,
                              id: item._id,
                            })
                          );
                          setDepartments(DepartmentData);

                          formik.setFieldValue(
                            "departmentId",
                            DepartmentData || ""
                          );
                          formik.setFieldValue(
                            "procedureNumber",
                            value?.procedureNumber || ""
                          );

                          setDepartment(DepartmentData);
                          setLab(LabData);
                        }}
                        onInputChange={handleInputChange}
                        renderInput={(procedureNames) => (
                          <TextField
                            {...procedureNames}
                            margin="none"
                            placeholder="Select procedure"
                          />
                        )}
                      />
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ paddingRight: { sm: "1rem !important" } }}
                  >
                    {type === "edit" ? (
                      <Box style={{ position: "relative" }}>
                        <label style={{ display: "block" }}>
                          Run Id(autogenerated)
                        </label>
                        <TextField
                          margin="none"
                          fullWidth
                          id="procedureId"
                          name="procedureId"
                          // autoComplete="procedureId"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Procedure Id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formData?.runNumber}
                          size="small"
                          error={
                            formik.touched.procedureId &&
                            Boolean(formik.errors.procedureId)
                          }
                          disabled
                        />
                      </Box>
                    ) : (
                      <Box style={{ position: "relative" }}>
                        <label style={{ display: "block" }}>
                          Procedure Id (autogenerated)
                        </label>
                        <TextField
                          margin="none"
                          fullWidth
                          id="procedureId"
                          name="procedureId"
                          // autoComplete="procedureId"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Procedure Id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.procedureNumber}
                          size="small"
                          error={
                            formik.touched.procedureId &&
                            Boolean(formik.errors.procedureId)
                          }
                          disabled
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    className="asset-popup calender-sec"
                  >
                    <Box style={{ position: "relative" }}>
                      <label>Created on</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="MM/DD/YYYY"
                          value={formik.values.createdOn}
                          disabled
                          disablePast
                        />
                      </LocalizationProvider>
                      {formik.touched.createdOn && formik.errors.createdOn && (
                        <Typography className="error-field">
                          Created Date is required
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
                    className="multi-selection"
                    sx={{ paddingRight: { sm: "1rem !important" } }}
                  >
                    <Box style={{ position: "relative" }}>
                      <label style={{ display: "block" }}>Department/s</label>
                      <Autocomplete
                        value={department}
                        options={
                          departmentData !== undefined ? departmentData : []
                        }
                        multiple
                        id="departmentId"
                        disableCloseOnSelect
                        getOptionLabel={(option: any) => option.label}
                        isOptionEqualToValue={(option: any, value: any) =>
                          value?.id === option?.id
                        }
                        renderOption={(props, option: any, { selected }) => (
                          <React.Fragment>
                            <li {...props}>
                              <Checkbox
                                style={{ marginRight: 0 }}
                                checked={selected}
                              />
                              {option.value}
                            </li>
                          </React.Fragment>
                        )}
                        onChange={(_, selectedOptions: any) =>
                          setDepartment(selectedOptions)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            value={params}
                            placeholder={
                              department?.length === 0 ? "Department/s" : ""
                            }
                          />
                        )}
                        fullWidth
                        size="medium"
                        disabled
                      />
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    className="multi-selection"
                  >
                    <Box style={{ position: "relative" }}>
                      <label style={{ display: "block" }}>Laboratory/ies</label>

                      <Autocomplete
                        value={lab}
                        options={
                          labData !== undefined && labData?.length !== 0
                            ? labData
                            : []
                        }
                        disableCloseOnSelect
                        multiple
                        id="laboratoryId"
                        getOptionLabel={(option: any) => option.label}
                        isOptionEqualToValue={(option: any, value: any) =>
                          value?.id === option?.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              lab?.length === 0 ? "Laboratory/ies" : ""
                            }
                          />
                        )}
                        fullWidth
                        size="medium"
                        renderOption={(props, option: any, { selected }) => (
                          <React.Fragment>
                            <li {...props}>
                              <Checkbox
                                style={{ marginRight: 0 }}
                                checked={selected}
                              />
                              {option.value}
                            </li>
                          </React.Fragment>
                        )}
                        onChange={(_, selectedOptions: any) => {
                          setLaboratory(selectedOptions);
                        }}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box style={{ position: "relative" }}>
                      <label style={{ display: "block", marginBottom: "8px" }}>
                        Test objective
                        <span style={{ color: "#E2445C" }}>*</span>
                      </label>
                      <TextField
                        margin="none"
                        fullWidth
                        id="objective"
                        name="objective"
                        autoComplete="off"
                        InputLabelProps={{ shrink: false }}
                        inputProps={{ maxLength: 36 }}
                        placeholder="Test objective"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.objective}
                        size="small"
                        error={
                          formik.touched.objective &&
                          Boolean(formik.errors.objective)
                        }
                      />
                      {formik.touched.objective && formik.errors.objective && (
                        <Typography className="error-field">
                          {formik.errors.objective}
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
                    sx={{ paddingRight: { sm: "1rem !important" } }}
                    className="asset-popup calender-sec"
                  >
                    <Box style={{ position: "relative" }}>
                      <label>
                        Due date<span style={{ color: "#E2445C" }}>*</span>
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disablePast
                          format="MM/DD/YYYY"
                          onChange={(selectedDate) =>
                            handleDateChanges(selectedDate, "dueDate")
                          }
                          value={dueDate}
                          inputRef={dueDateInputRef}
                        />
                      </LocalizationProvider>
                      <Typography className="error-field">{error}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={0} sm={6} md={6} lg={6} />
                  {type !== "edit" && (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      sx={{ paddingRight: { sm: "1rem !important" } }}
                    >
                      <Box style={{ position: "relative" }}>
                        <label
                          style={{ display: "block", marginBottom: "0.8rem" }}
                        >
                          Assign to<span style={{ color: "#E2445C" }}>*</span>
                        </label>
                        {formik.touched.userId && formik.errors.userId && (
                          <Typography className="error-field">
                            {formik.errors.userId}
                          </Typography>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img src={Avatars} alt="Avatars" />
                          <Button
                            disabled={
                              Object.keys(formik.errors).length === 0 &&
                              moment(dueDate).isValid()
                                ? false
                                : true
                            }
                            variant="contained"
                            className="avatar-add"
                            onClick={() => {
                              setRunsOpen(true);
                            }}
                          >
                            <AddIcon sx={{ mr: 1 }} />
                            Add
                          </Button>
                          {/* {isAssigned &&<img src={Avatars} alt="Avatars" style={{paddingLeft:"10px"}} />} */}
                        </Box>
                        {Object.keys(formik.errors).length === 0 &&
                          moment(dueDate).isValid() &&
                          !isAssigned && (
                            <Typography className="error-field">
                              Please assign at least one people
                            </Typography>
                          )}
                      </Box>
                    </Grid>
                  )}
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
                {!btnLoading ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      type === "edit"
                        ? !formik.dirty
                        : Object.keys(formik.errors).length === 0 &&
                          moment(dueDate).isValid() &&
                          isAssigned
                        ? false
                        : true
                    }
                    className="add-btn"
                  >
                    {type === "edit" ? "Update" : "Create"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="add-btn"
                    style={{ width: "115px" }}
                  >
                    <CircularProgress color="warning" size={20} />
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Dialog>
        {runsOpen && (
          <AddPeoplePopup
            open={runsOpen}
            close={() => setRunsOpen(false)}
            typePopup={"assign"}
            formValue={formik.values}
            handleAssign={handleAssign}
            assigned={
              Object.keys(formik.errors).length === 0 &&
              moment(dueDate).isValid() &&
              isAssigned
            }
            // runzId={runzId}
            //         runzRow={runzRow}
            //         typePopup={typePopup}
          />
        )}
        <Confirmationpopup
          ref={confirmationPopupRef}
          confirmationState={handleConfirmationState}
          type={type}
        />
        <SuccessPopup ref={successPopupRef} type={type} />
      </div>
    );
  }
);
export default RunsForm;
