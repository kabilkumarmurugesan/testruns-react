/* eslint-disable no-var */
/* eslint-disable react/display-name */
import React from "react";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  Autocomplete,
  InputAdornment,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import CloseIcon from "@mui/icons-material/Close";
import "../../assets/styles/css/asset-popup.css";
import { Organization } from "../../modals";
import { OrganizationList } from "../../utils/data";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { postAssetsData } from "../../api/assetsAPI";
import { fetchLabById } from "../../api/labAPI";
import SuccessPopup from "../../components/SuccessPopup";
import Confirmationpopup from "../../components/ConfirmationPopup";
import moment from "moment";
import preview from "../../assets/images/profile/preview.png";
import { toast } from "react-toastify";
import AWS from "aws-sdk";

const validationSchema = Yup.object().shape({
  // name: Yup.string().required('Asset Name is required'),
  name: Yup.string()
    .trim()
    .required("Asset Name is required")
    .max(25, "Must be 25 characters"),
  perchasedDate: Yup.string().required("Purchase date is required"),
  expiryDate: Yup.string().required("Expiry date is required"),
  departmentId: Yup.array()
    .min(1, "Please select at least one Department")
    .required("Department is required"),
  laboratoryId: Yup.array()
    .min(1, "Please select at least one Laboratory")
    .required("Laboratory is required"),
  organisationId: Yup.string().required("Organisation is required"),
  status: Yup.string().required("Status is required"),
  // assets_image: Yup.string().required(),
  availability: Yup.string().required("Availability is required"),
  // assets_id: Yup.string().required(),
  // lastUsedDate: Yup.string().required(),
});

const Addnewpopup = React.forwardRef(
  (
    { closeFormPopup, reload, openConfirmationPopup, fetchData, type }: any,
    ref
  ) => {
    const [formPopup, setFormPopup] = React.useState(false);
    const [organizations] = React.useState<Organization[]>(OrganizationList);
    const [departmentData, setDepartmentData] = React.useState([]);
    const [labData, setLabData] = React.useState([]);
    const [labDatas, setLabDatas] = React.useState([]);
    const [labEdit, setLabEdit] = React.useState(false);
    const [organizationData, setOrganizationData] = React.useState([]);
    const successPopupRef: any = React.useRef(null);
    const purchasedDateInputRef: any = React.useRef(null);
    const expiryDateInputRef: any = React.useRef(null);
    const confirmationPopupRef: any = React.useRef(null);
    const dispatch: any = useDispatch();
    const [departments, setDepartments] = React.useState([]);
    const [organization, setOrganization] = React.useState([]);
    const [laboratory, setLaboratory] = React.useState([]);
    const fileUploadField = React.useRef<any>(null);
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const [loader, setLoader] = React.useState(false);
    const singleUserData = useSelector(
      (state: any) => state.user?.data?.get_user
    );

    const departmentSliceData = useSelector(
      (state: any) => state.department.data?.get_all_departments
    );
    const labSliceData = useSelector(
      (state: any) => state.lab.data?.get_all_labs
    );
    const organizationSliceData = useSelector(
      (state: any) => state.organization.data?.get_all_organisations
    );

    React.useImperativeHandle(ref, () => ({
      open(state: any) {
        setFormPopup(state);
        formik.setFieldValue("organisationId", singleUserData?.organisationId);
        formik.setFieldValue(
          "departmentId",
          singleUserData?.departmentId?.map((item: any) =>
            departmentData?.find((obj: any) => obj?.id == item)
          ) || []
        );
        setDepartments(
          singleUserData?.departmentId?.map((item: any) =>
            departmentData?.find((obj: any) => obj?.id == item)
          )
        );
        dispatch(fetchLabById({ departmentId: singleUserData.departmentId }));
        formik.setFieldValue(
          "laboratoryId",
          singleUserData?.laboratoryId?.map((item: any) =>
            labData?.find((obj: any) => obj?.id == item)
          ) || []
        );
        setLaboratory(
          singleUserData?.laboratoryId?.map((item: any) =>
            labData?.find((obj: any) => obj?.id == item)
          )
        );
      },
    }));

    React.useEffect(() => {
      if (purchasedDateInputRef.current) {
        purchasedDateInputRef.current.disabled = true;
      }
      if (expiryDateInputRef.current) {
        expiryDateInputRef.current.disabled = true;
      }
    }, [purchasedDateInputRef.current, expiryDateInputRef.current]);

    React.useEffect(() => {
      formik.setFieldValue(
        "departmentId",
        singleUserData?.departmentId?.map((item: any) =>
          departmentData?.find((obj: any) => obj?.id == item)
        ) || []
      );
      setDepartments(
        singleUserData?.departmentId?.map((item: any) =>
          departmentData?.find((obj: any) => obj?.id == item)
        )
      );
      formik.setFieldValue(
        "laboratoryId",
        singleUserData?.laboratoryId?.map((item: any) =>
          labData?.find((obj: any) => obj?.id == item)
        ) || []
      );
      setLaboratory(
        singleUserData?.laboratoryId?.map((item: any) =>
          labData?.find((obj: any) => obj?.id == item)
        )
      );
    }, [organizationSliceData]);

    React.useEffect(() => {
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

    const checkCredentials = (name: any) => {
      return true;
    };
    const onSubmit = async (values: any) => {
      const isMatch = checkCredentials(values.name);
      if (isMatch) {
        var deptArray: any = [];
        values.departmentId.map((item: any) => deptArray.push(item?.id));
        var labArray: any = [];
        values.laboratoryId.map((item: any) => labArray.push(item?.id));

        const assetValues: any = {
          name: values.name,
          organisationId: values.organisationId,
          perchasedDate: values.perchasedDate,
          lastUsedDate: "Not yet used",
          availability: values.availability,
          expiryDate: values.expiryDate,
          departmentId: deptArray,
          laboratoryId: labArray,
          status: values.status,
          instituteId: singleUserData?.instituteId,
        };

        if (uploadedFile !== null) {
          assetValues["assetImageUrl"] = uploadedFile;
        }

        await dispatch(postAssetsData(assetValues))
          .then((res: any) => {
            if (res) {
              submitFormPopup();
              clearForm();
              fileUploadField.current.value = null;
            } else {
              toast("Something went worng !", {
                style: {
                  background: "#d92828",
                  color: "#fff",
                },
              });
            }
          })
          .catch((error: any) => {
            console.error(error);
            toast(error.message, {
              style: {
                background: "#d92828",
                color: "#fff",
              },
            });
          });
        // dispatch(fetchAssetsData(queryStrings));
      } else {
        formik.setFieldError("name", "Invalid first name");
      }
    };

    const clearForm = () => {
      formik.resetForm();
      setDepartments([]);
      setUploadedFile(null);
      setLaboratory([]);
      setOrganization([]);
    };
    const submitFormPopup = () => {
      setFormPopup(false);
      reload();
      toast(`Assets have been created successfully!`, {
        style: {
          background: "#00bf70",
          color: "#fff",
        },
      });
    };

    const Placeholder = ({ children }: any) => {
      return <div>{children}</div>;
    };

    const formik: any = useFormik({
      initialValues: {
        name: "",
        perchasedDate: null,
        expiryDate: null,
        departmentId: [],
        laboratoryId: [],
        organisationId: "",
        status: "",
        // assets_image: '',
        availability: "",
        // assets_id: 'ASSE-1000',
        lastUsedDate: "",
      },
      validationSchema: validationSchema,
      onSubmit: onSubmit,
    });

    React.useEffect(() => {
      setOrganizationData(
        organizationSliceData?.map((item: any) => ({
          label: item.name,
          value: item.name,
          id: item._id,
        }))
      );
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
    }, [departmentSliceData, labSliceData, organizationSliceData]);

    const handleConfirmationState = (state: any) => {
      if (state === 0) {
        confirmationPopupRef.current.open(false);
      } else {
        confirmationPopupRef.current.open(false);
        setFormPopup(false);
        clearForm();
      }
    };
    const handleDateChanges = (selectedDate: any, name: any) => {
      const formattedDate = moment(selectedDate.$d).format("MM/DD/YYYY");
      formik.handleChange(name)(formattedDate);
    };

    const handleImageUpload = async () => {
      const selectedFile = fileUploadField.current.files[0];

      const s3 = new AWS.S3({
        // params: { Bucket: S3_BUCKET, folderName: "profile" },
        region: "us-east-1",
        accessKeyId: process.env.REACT_APP_ACCESSKEYID,
        secretAccessKey: process.env.REACT_APP_SECRETACCESSKEYID,
      });
      const keyPath = `profile/${Date.now()}`;
      const params = {
        Bucket: "test-run-v2",
        Key: keyPath,
        Body: selectedFile,
        ACL: "public-read",
        // ContentType: selectedFile.type
      };
      setLoader(true);
      const result = s3.upload(params).promise();

      await result
        .then((res: any) => {
          setUploadedFile(res.Location);
          toast(`Image has been uploaded successfully!`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          });
        })
        .catch((error: any) => {
          console.error(error);
          setLoader(false);
        });
      await result.catch((error: any) => {
        console.error("Failed to upload");
        toast(`Failed to upload !`, {
          style: {
            background: "#e2445c",
            color: "#fff",
          },
        });
      });
      setLoader(false);
    };

    const triggerFileUploadField = () => {
      fileUploadField.current?.click();
    };

    return (
      <div>
        <Dialog
          open={formPopup}
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
                <Typography>{type} asset</Typography>
                <CloseIcon
                  onClick={() => {
                    closeFormPopup(false);
                    clearForm();
                    fileUploadField.current.value = null;
                  }}
                />
              </Box>
              <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={5}
                  lg={4}
                  sx={{
                    padding: "0px !important",
                    paddingRight: {
                      xs: "0px !important",
                      md: "30px !important",
                    },
                  }}
                >
                  <Box>
                    <Box
                      style={{
                        width: "220px",
                        height: "220px",
                        padding: !loader ? "10px" : "86px",
                        background: "#e4e5e7",
                        margin: "auto",
                      }}
                    >
                      {!loader ? (
                        <img
                          src={uploadedFile === null ? preview : uploadedFile}
                          alt="assetimg"
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <CircularProgress color="inherit" />
                      )}
                    </Box>
                    <Box
                      className="edit-profile-btn"
                      sx={{ mt: 3, mb: 3, pb: "0px !important" }}
                    >
                      <span className="file-wrapper">
                        <input
                          disabled={loader}
                          ref={fileUploadField}
                          type="file"
                          name="photo"
                          id="photo"
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={handleImageUpload}
                        />
                        <span
                          className="button"
                          onClick={triggerFileUploadField}
                        >
                          Upload photo
                        </span>
                      </span>
                      {/* {formik.touched.assets_image &&
                        formik.errors.assets_image && (
                          <Typography className="error-field">
                            {formik.errors.assets_image}
                          </Typography>
                        )} */}
                    </Box>
                    {/* <Box className="asset-id">
                      <label>Asset Id (autogenerated)</label>
                      <TextField
                        margin="none"
                        fullWidth
                        id="assets_id"
                        name="assets_id"
                        autoComplete="assets_id"
                        InputLabelProps={{ shrink: false }}
                        placeholder="Assets Id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        size="small"
                    
                        disabled
                      />
                     
                    </Box> */}
                    {/* <Box>
                      <Typography className="recent-use">
                        Recently used
                      </Typography>
                      <Box className="data-detail">
                        <img src={darkcircle} alt="darkcircle" />
                        <Typography>no data found</Typography>
                      </Box>
                      <Timeline className="asset-timeline">
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot>
                              <img src={darkcircle} alt="darkcircle" />
                            </TimelineDot>
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent className="timeline-content">
                            <Typography>Date:22/05/2023</Typography>
                            <Typography>Dept-Computer science</Typography>
                            <Typography>Dept-Computer science</Typography>
                          </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot>
                              <img src={lightcircle} alt="lightcircle" />
                            </TimelineDot>
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent className="timeline-content">
                            <Typography>Date:22/05/2023</Typography>
                            <Typography>Dept-Computer science</Typography>
                            <Typography>Dept-Computer science</Typography>
                          </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot>
                              <img src={lightcircle} alt="lightcircle" />
                            </TimelineDot>
                          </TimelineSeparator>
                          <TimelineContent>
                            <Box className="edit-profile-btn view-more">
                              <Button>View more</Button>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    </Box> */}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={7}
                  lg={8}
                  sx={{
                    padding: "0px !important",
                    paddingTop: { xs: "30px !important", md: "0px !important" },
                  }}
                >
                  <Box>
                    <Grid container spacing={2} className="asset-popup">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box style={{ position: "relative" }}>
                          <label>
                            Assets name
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <TextField
                            margin="normal"
                            fullWidth
                            id="name"
                            name="name"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="Assets name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            size="small"
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
                          <label>
                            Purchase date
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              disableFuture
                              format="MM/DD/YYYY"
                              onChange={(selectedDate: any) =>
                                handleDateChanges(selectedDate, "perchasedDate")
                              }
                              value={formik.values.perchasedDate}
                              inputRef={purchasedDateInputRef}
                            />
                          </LocalizationProvider>
                          {formik.touched.perchasedDate &&
                            formik.errors.perchasedDate && (
                              <Typography
                                className="error-field"
                                style={{
                                  color: "#E2445C",
                                  position: "absolute",
                                  top: "2em",
                                  right: "9.4em",
                                }}
                              >
                                Purchase date required
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
                        <Box>
                          <label style={{ whiteSpace: "nowrap" }}>
                            Guaranty/warranty/expiry date
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              disablePast
                              format="MM/DD/YYYY"
                              onChange={(selectedDate: any) =>
                                handleDateChanges(selectedDate, "expiryDate")
                              }
                              value={formik.values.expiryDate}
                              inputRef={expiryDateInputRef}
                            />
                          </LocalizationProvider>
                          {formik.touched.expiryDate &&
                            formik.errors.expiryDate && (
                              <Typography
                                className="error-field"
                                style={{
                                  color: "#E2445C",
                                  position: "absolute",
                                  top: "17em",
                                  right: "4.2em",
                                }}
                              >
                                Guaranty/warranty/expiry date required
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} className="asset-popup">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
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
                            disabled={true}
                            id="organisationId"
                            name="organisationId"
                            // autoComplete="organisationId"
                            placeholder="Organization"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
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
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      className="asset-popup multi-selection"
                    >
                      <Grid item xs={12} sm={12} md={12} lg={12}>
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
                            options={
                              departmentData !== undefined &&
                              departmentData?.length !== 0
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
                                  departments?.length == 0 ? "Department/s" : ""
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
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      className="asset-popup multi-selection"
                    >
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box style={{ position: "relative" }}>
                          <label style={{ display: "block" }}>
                            Laboratory/ies
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <Autocomplete
                            multiple
                            id="laboratoryId"
                            value={laboratory}
                            options={
                              labData !== undefined && labData?.length !== 0
                                ? labData
                                : []
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
                            Status<span style={{ color: "#E2445C" }}>*</span>
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
                              formik.values.status !== ""
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
                              formik.touched.status &&
                              Boolean(formik.errors.status)
                            }
                          >
                            <MenuItem value={"Active"}>Active</MenuItem>
                            <MenuItem value={"Inactive"}>In-Active</MenuItem>
                            {/* {StatusList.map((item: any) => (
                              <MenuItem key={item.id} value={item.state}>
                                {item.name}
                              </MenuItem>
                            ))} */}
                          </Select>
                          {formik.touched.status && formik.errors.status && (
                            <Typography className="error-field">
                              {formik.errors.status}
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
                            Availability
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
                              formik.values.availability !== ""
                                ? undefined
                                : () => (
                                    <Placeholder>
                                      Select Availability
                                    </Placeholder>
                                  )
                            }
                            margin="none"
                            fullWidth
                            id="availability"
                            name="availability"
                            autoComplete="availability"
                            placeholder="Laboratory"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.availability}
                            size="small"
                            error={
                              formik.touched.availability &&
                              Boolean(formik.errors.availability)
                            }
                          >
                            <MenuItem value={"Available"}>Available</MenuItem>
                            <MenuItem value={"In_Use"}>In Use</MenuItem>
                            <MenuItem value={"Not_Available"}>
                              Not Available
                            </MenuItem>
                            {/* {AvailabilityList.map((item) => (
                              <MenuItem key={item.id} value={item.state}>
                                {item.name}
                              </MenuItem>
                            ))} */}
                          </Select>
                          {formik.touched.availability &&
                            formik.errors.availability && (
                              <Typography className="error-field">
                                {formik.errors.availability}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ py: 1 }} />
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
                    fileUploadField.current.value = null;
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  // onClick={submitFormPopup}
                  className="add-btn"
                  disabled={!formik.isValid}
                >
                  {type === "edit" ? "Update" : "Create"}
                </Button>
              </Box>
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
export default Addnewpopup;
