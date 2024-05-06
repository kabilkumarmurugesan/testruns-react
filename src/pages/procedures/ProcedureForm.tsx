/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchLabById } from "../../api/labAPI";
import {
  fetchProcedure,
  fetchUpdateProcedureData,
  postProcedureData,
} from "../../api/procedureAPI";
import { fetchSingleUserData } from "../../api/userAPI";
import Confirmationpopup from "../../components/ConfirmationPopup";
import SuccessPopup from "../../components/SuccessPopup";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "react-toastify";
import SpinerLoader from "../../components/SpinnerLoader";
import { useNavigate } from "react-router";

const validationSchema = Yup.object().shape({
  createdOn: Yup.string().required(),
  createdBy: Yup.string().notRequired(),
  createdByName: Yup.string().notRequired(),
  departmentId: Yup.array()
    .min(1, "Please select at least one Department")
    .required("Department is required"),
  laboratoryId: Yup.array()
    .min(1, "Please select at least one Laboratory")
    .required("Laboratory is required"),
  organisationId: Yup.string().notRequired(),
  // name: Yup.string().required("Procedure name is required"),
  name: Yup.string()
    .trim()
    .required("Procedure name is required")
    .max(50, "Must be 50 characters or less"),
  // .matches(
  //   /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/,
  //   'Label cannot have empty spaces',
  // ),
});

const ProcedureForm = React.forwardRef(
  (
    {
      open,
      close,
      closeFormPopup,
      type,
      formData,
      reload,
      reloadSingleData,
    }: any,
    ref
  ) => {
    const dispatch: any = useDispatch();
    const navigate = useNavigate();
    const [openForm, setFormOpen] = React.useState(false);
    const [departmentData, setDepartmentData] = React.useState([]);
    const [labData, setLabData] = React.useState([]);
    const [isLoader, setIsLoader] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [labEdit, setLabEdit] = React.useState(false);
    const [procedureNumber, setProcedureNumber] = useState<any>(
      formData?.procedureNumber
    );

    const confirmationPopupRef: any = React.useRef();
    const successPopupRef: any = React.useRef();

    const [departments, setDepartments] = React.useState(
      formData !== undefined
        ? formData?.departmentId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }))
        : []
    );
    const [laboratory, setLaboratory] = React.useState(
      formData !== undefined
        ? formData?.laboratoryId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }))
        : []
    );

    const loginUserSliceData = useSelector(
      (state: any) => state.userLogin?.data?.verifyToken
    );

    const departmentSliceData = useSelector(
      (state: any) => state.department.data?.get_all_departments
    );

    const labSliceData = useSelector(
      (state: any) => state.lab.data?.get_all_labs
    );

    const singleUserData = useSelector(
      (state: any) => state.user?.data?.get_user
    );

    const checkCredentials = (values: any) => {
      return true;
    };

    const onSubmit = async (values: any) => {
      setLoading(true);
      const isMatch = checkCredentials(values.name);
      var deptArray: any = [];
      departments.map((item: any) => deptArray.push(item?.id));
      var labArray: any = [];
      laboratory.map((item: any) => labArray.push(item?.id));

      const procedures: any = {
        name: values.name,
        // organisationId: values.organisationId,
        departmentId: deptArray,
        laboratoryId: labArray,
        createdBy: values.createdBy,
        createdByName: values.createdByName,
        procedureDetials: values.procedureDetials,
        instituteId: loginUserSliceData?.instituteId,
      };

      if (type === "create") {
        procedures["organisationId"] = values.organisationId;
        procedures["procedureDetials"] = values.procedureDetials;
        procedures["createdOn"] = values.createdOn;
      } else {
        procedures["_id"] = formData._id;
      }
      if (isMatch) {
        if (type === "edit") {
          dispatch(fetchUpdateProcedureData(procedures))
            .then(() => {
              reloadSingleData();
              submitFormPopup();
              clearForm();
            })
            .catch(() => {
              toast("Procedure is not updated !", {
                style: {
                  background: "#d92828",
                  color: "#fff",
                },
              });
            });
        } else {
          await dispatch(postProcedureData(procedures))
            .then((res: any) => {
              res?.create_procedure?._id && submitFormPopup();
              setTimeout(() => {
                res.create_procedure === undefined &&
                  toast("Procedure is not created !", {
                    style: {
                      background: "#d92828",
                      color: "#fff",
                    },
                  });
                res?.create_procedure?._id &&
                  navigate(`/procedures/details/${res?.create_procedure?._id}`);
              }, 1000);
            })
            .catch((err: any) => {
              console.error(err);
              toast("Procedure is not created !", {
                style: {
                  background: "#d92828",
                  color: "#fff",
                },
              });
            });

          clearForm();
          reload();
        }
      }
    };

    React.useImperativeHandle(ref, () => ({
      open(state: any, row: any, id: any) {
        dispatch(fetchSingleUserData({ _id: loginUserSliceData?._id }));
        if (row?._id && !id) {
          let payload = {
            _id: row?._id,
          };
          formik.setValues({ ...formik.values, name: row?.name });
          dispatch(fetchProcedure(payload))
            .then((isSucess: any) => {
              if (isSucess?.get_procedure) {
                formik.setValues({
                  ...formik.values,
                  name: isSucess?.get_procedure?.name || row?.name,
                });
                formik.setFieldValue(
                  "organisationId",
                  isSucess?.get_procedure?.organisationId || row?.organisationId
                );
                formik.setFieldValue(
                  "procedureDetials",
                  isSucess?.get_procedure?.procedureDetials ||
                    row?.procedureDetials
                );
                formik.setFieldValue(
                  "createdBy",
                  isSucess?.get_procedure?.createdBy || row?.createdBy
                );
                formik.setFieldValue(
                  "createdByName",
                  isSucess?.get_procedure?.createdByName || row?.createdByName
                );
                let department = row?.departmentId?.map((item: any) => ({
                  label: item?.name,
                  value: item?.name,
                  id: item?._id,
                }));
                let laboratory = row?.laboratoryId?.map((item: any) => ({
                  label: item?.name,
                  value: item?.name,
                  id: item?._id,
                }));
                formik.setFieldValue("departmentId", department);
                formik.setFieldValue("laboratoryId", laboratory);
                setProcedureNumber(isSucess?.get_procedure?.procedureNumber);
                setDepartments(department);
                setLaboratory(laboratory);
                setIsLoader(false);
              }
            })
            .catch((err: any) => {
              console.error(err);
            });
        } else if (row !== undefined) {
          let department = row?.departmentId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }));
          let laboratory = row?.laboratoryId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }));
          formik.setFieldValue("departmentId", department);
          formik.setFieldValue("laboratoryId", laboratory);
          formik.setFieldValue("procedureDetials", row.procedureDetials);
          formik.setFieldValue("createdBy", row.createdBy);
          formik.setFieldValue("createdByName", row.createdByName);
          // formik.setFieldValue('name', row.name);
          setDepartments(department);
          setLaboratory(laboratory);
        } else {
          setIsLoader(false);
        }
        setFormOpen(state);
      },
    }));

    const clearForm = () => {
      formik.resetForm();
      if (type === "create") {
        setDepartments([]);
        setLaboratory([]);
      }
      formik.dirty = false;
    };

    const formik: any = useFormik({
      initialValues: {
        name: "",
        createdOn: moment(new Date()).format("MM/DD/YYYY"),
        createdBy: loginUserSliceData?._id,
        createdByName: loginUserSliceData?.fullName,
        departmentId: formData ? formData.departmentId : [],
        laboratoryId: formData ? formData.laboratoryId : [],
        organisationId: formData
          ? formData.organisationId
          : loginUserSliceData?.organisationId,
        procedureDetials: "",
      },
      validationSchema: validationSchema,
      onSubmit: onSubmit,
    });

    useEffect(() => {
      if (labSliceData) {
        const transformedLabs = labSliceData.map((obj: any) => ({
          label: obj.name,
          value: obj.name,
          id: obj._id,
        }));

        const matchedData = laboratory?.filter((lab: any) =>
          transformedLabs?.some((transLab: any) => transLab?.id === lab?.id)
        );

        formik.setValues({
          ...formik.values,
          laboratoryId: matchedData,
        });
        if (labEdit) {
          setLaboratory(matchedData);
        }
      }
    }, [labSliceData]);

    useEffect(() => {
      const mappedDepartments = (singleUserData?.departmentId || [])
        .map((id: string) => {
          var department = departmentSliceData?.find(
            (obj: any) => obj._id === id
          );

          if (department) {
            return {
              label: department.name,
              value: department.name,
              id: department._id,
            };
          }

          return null; // Handle the case where the department with the specified ID is not found
        })
        .filter((department: any) => department !== null);

      const mappedDLabs = singleUserData?.laboratoryId
        ?.map((id: string) => {
          var lab = labSliceData?.find((obj: any) => obj._id === id);

          if (lab) {
            return {
              label: lab.name,
              value: lab.name,
              id: lab._id,
            };
          }

          return null; // Handle the case where the department with the specified ID is not found
        })
        .filter((lab: any) => lab !== null);

      setDepartmentData(mappedDepartments);
      setLabData(mappedDLabs);
    }, [departmentSliceData, labSliceData, loginUserSliceData, singleUserData]);

    const handleConfirmationState = (state: any) => {
      if (state === 0) {
        confirmationPopupRef.current.open(false);
      } else {
        confirmationPopupRef.current.open(false);
        setFormOpen(false);
        clearForm();
      }
    };

    const submitFormPopup = () => {
      setFormOpen(false);
      toast(
        `${
          type === "edit"
            ? "Procedure has been updated successfully!"
            : "Procedure has been successfully created!"
        } !`,
        {
          style: {
            background: "#00bf70",
            color: "#fff",
          },
        }
      );
      // successPopupRef.current.open(true, 'Procedure');
      // setTimeout(() => {
      //   successPopupRef.current.open(false, 'Procedure');
      // }, 3000);
    };

    const createdOn =
      type === "edit"
        ? dayjs(
            moment(parseInt(formData?.createdAt)).local().format("MM/DD/YYYY")
          )
        : dayjs(moment().format("MM/DD/YYYY"));

    return (
      <div>
        <Dialog
          open={openForm}
          keepMounted
          // onClose={() => closeFormPopup(false)}
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
                <Typography>{type} Procedure</Typography>
                <CloseIcon
                  onClick={() => {
                    closeFormPopup(false);
                    clearForm();
                  }}
                />
              </Box>
              {isLoader ? (
                <SpinerLoader isLoader={isLoader} type={"small"} />
              ) : (
                <>
                  <Box>
                    <Grid
                      container
                      spacing={2}
                      className="asset-popup calender-sec"
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
                            Procedure ID (autogenerated)
                          </label>
                          <TextField
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            // required
                            fullWidth
                            id="name"
                            name="organisationId"
                            // autoComplete="name"
                            autoFocus
                            InputLabelProps={{ shrink: false }}
                            placeholder="Procedure ID"
                            className="bg-gray-input"
                            value={procedureNumber}
                            disabled
                            size="small"
                            // error={
                            //   formik.touched.procedureNumber &&
                            //   Boolean(formik.errors.procedureNumber)
                            // }
                          />
                          {/* {formik.touched.procedureNumber &&
                        formik.errors.procedureNumber && (
                          <Typography className="error-field">
                            {formik.errors.procedureNumber}
                          </Typography>
                        )} */}
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
                        <Box
                          className="bg-gray-input"
                          style={{ position: "relative" }}
                        >
                          <label style={{ display: "block" }}>Created on</label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="MM/DD/YYYY"
                              value={createdOn}
                              disabled
                              disablePast
                            />
                          </LocalizationProvider>
                          {formik.touched.perchasedDate &&
                            formik.errors.perchasedDate && (
                              <Typography className="error-field">
                                Purchase date required
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
                            Department
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <Autocomplete
                            multiple
                            id="departmentId"
                            disableCloseOnSelect
                            value={departments}
                            options={
                              departmentData !== undefined ? departmentData : []
                            }
                            getOptionLabel={(option: any) => option.label}
                            isOptionEqualToValue={(option: any, value: any) =>
                              value.id === option.id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  departments?.length === 0
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
                                laboratoryId: [],
                              });
                              const dept: any = [];
                              selectedOptions?.map((item: any) =>
                                dept.push(item?.id)
                              );
                              dispatch(fetchLabById({ departmentId: dept }));
                            }}
                            onBlur={() => {
                              var dept: any = [];
                              formik.values.departmentId?.map((item: any) =>
                                dept.push(item?.id)
                              );
                              // setLabData([]);
                              dispatch(fetchLabById({ departmentId: dept }));
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
                            Laboratory
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <Autocomplete
                            multiple
                            id="laboratoryId"
                            loading={labData.length === 0}
                            value={laboratory}
                            options={labData !== undefined ? labData : []}
                            getOptionLabel={(option: any) => option?.label}
                            isOptionEqualToValue={(option: any, value: any) =>
                              value.id === option.id
                            }
                            disabled={departments?.length === 0}
                            disableCloseOnSelect
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  laboratory?.length === 0
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
                                  {option.value}
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
                    </Grid>
                    <Grid container spacing={2} className="asset-popup">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Procedure name
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <TextField
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            size="small"
                            // required
                            fullWidth
                            id="name"
                            name="name"
                            autoComplete="off"
                            // autoFocus
                            inputProps={{ maxLength: 51 }}
                            InputLabelProps={{ shrink: false }}
                            placeholder="Procedure Name"
                            value={formik.values.name}
                            error={
                              formik.touched.name && Boolean(formik.errors.name)
                            }
                          />
                          {formik.touched.name && formik.errors.name && (
                            <Typography className="error-field">
                              {formik.errors.name}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
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
                      className="cancel-btn"
                      onClick={() => {
                        confirmationPopupRef.current.open(true);
                      }}
                    >
                      Cancel
                    </Button>
                    {!loading ? (
                      <Button
                        type="submit"
                        variant="contained"
                        className="add-btn"
                        disabled={
                          type === "edit"
                            ? !formik.dirty
                            : Object.keys(formik.errors).length === 0 &&
                              formik.dirty
                            ? false
                            : true
                        }
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
export default ProcedureForm;
