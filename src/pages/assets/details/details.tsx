import React, { useState } from "react";
import PrivateRoute from "../../../components/PrivateRoute";
import Successpopup from "../../../components/SuccessPopup";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Autocomplete,
  Checkbox,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import moment from "moment";
import test from "../../../assets/images/Noimage.png";
import HistoryTable from "./history";
import {
  fetchProcedureByAssetsName,
  fetchUpdateAssetsData,
} from "../../../api/assetsAPI";
import { useDispatch, useSelector } from "react-redux";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { fetchLabById } from "../../../api/labAPI";
import SuccessPopup from "../../../components/SuccessPopup";
import { toast } from "react-toastify";
import { Height } from "@mui/icons-material";
import AWS from "aws-sdk";
import { useLocation, useNavigate } from "react-router";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Asset Name is required")
    .max(50, "Must be 50 characters or less"),
  assetId: Yup.string().required(),
  departmentId: Yup.array()
    .min(1, "Please select at least one Department")
    .required("Department is required"),
  laboratoryId: Yup.array()
    .min(1, "Please select at least one Laboratory")
    .required("Laboratory is required"),
  organisationId: Yup.string().required("Organisation is required"),
  status: Yup.string().required("Status is required"),
  availability: Yup.string().required("Availability is required"),
  perchasedDate: Yup.string().required("Purchase date is required").nullable(),
  expiryDate: Yup.string().required("Expiry date is required").nullable(),
  assetImageUrl: Yup.string().notRequired(),

  // lastUsedDate: Yup.string().required(),
});
export default function AssetDetails() {
  const navigate = useNavigate()
  const [value, setValue] = React.useState(0);
  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const location: any = useLocation();
  const assetValue = location.state?.props;
  const getFunction = location.state?.func;
  const fileUploadField = React.useRef<any>(null);

  const [uploadedFile, setUploadedFile] = React.useState<any>(
    assetValue?.assetImageUrl
  );
  const triggerFileUploadField = () => {
    fileUploadField.current && fileUploadField.current?.click();
  };
  const [labEdit, setLabEdit] = React.useState(false);
  const successPopupRef: any = React.useRef(null);
  const [formPopup, setFormPopup] = React.useState(false);
  const [editAcces, seteditAcces] = React.useState(true);
  const [openSuccess, setSuccessOpen] = React.useState(false);
  const [departmentData, setDepartmentData] = React.useState([]);
  const [labData, setLabData] = React.useState([]);
  const purchasedDateInputRef: any = React.useRef(null);
  const expiryDateInputRef: any = React.useRef(null);
  const [organizationData, setOrganizationData] = React.useState([]);
  const assetId = assetValue?._id;
  const [procedureId, setProcedureId] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [organization, setOrganization] = React.useState([
    {
      label: "",
      value: "",
      id: assetValue?.organisationId,
    },
  ]);
  const [departments, setDepartments] = React.useState(
    assetValue?.departmentId?.map((item: any) => ({
      label: item?.name,
      value: item?.name,
      id: item?._id,
    }))
  );
  const [laboratory, setLaboratory] = React.useState(
    assetValue?.laboratoryId?.map((item: any) => ({
      label: item?.name,
      value: item?.name,
      id: item?._id,
    }))
  );

  const dispatch: any = useDispatch();
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  React.useEffect(() => {
    if (purchasedDateInputRef.current) {
      purchasedDateInputRef.current.disabled = true;
    }
    if (expiryDateInputRef.current) {
      expiryDateInputRef.current.disabled = true;
    }
  }, [purchasedDateInputRef.current, expiryDateInputRef.current]);

  React.useEffect(() => {
    seteditAcces(
      loginUserSliceData?.verifyToken?.role[0]?.asset_management?.edit
    );
    let payload = {
      assetId: [assetId],
    };
    dispatch(fetchProcedureByAssetsName(payload))
      .then((res: any) => {
        if (res?.get_all_procedures_by_asset?.length !== 0) {
          var procedrueList: any = [];

          res?.get_all_procedures_by_asset.map((item: any) => {
            procedrueList.push(item._id);
          });
          setProcedureId(procedrueList);
        } else {
          setProcedureId([]);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);
  // const departments: any =
  // // []
  // assetValue.departmentId?.map((item: any) => ({
  //   label: item?.name,
  //   value: item?.name,
  //   id: item?._id,
  // }));
  // const laboratory: any =
  // // []
  // assetValue.laboratoryId?.map((item: any) => ({
  //   label: item?.name,
  //   value: item?.name,
  //   id: item?._id,
  // }));
  // const AssetSliceData = useSelector(
  //   (state: any) => state.assets.data?.get_asset,
  // );
  const checkCredentials = (values: any) => {
    return true;
  };
  // const assetsSliceData = useSelector(
  //   (state: any) => state.assets.data?.get_asset,
  // );
  // React.useEffect(() => {
  //   // setAssetValue(assetValue);
  //   formik.setValues({
  //     name: assetValue?.name,
  //     assetId: assetValue?.assetNumber,
  //     laboratoryId: assetValue?.laboratoryId,
  //     organisationId: assetValue?.organisationId,
  //     departmentId: assetValue?.departmentId,
  //     // userId: 'USER_1001',
  //     status: assetValue?.status,
  //     availability: assetValue?.availability,
  //     // assets_id: assetValue.assets_id,
  //     lastUsedDate: assetValue?.lastUsedDate,
  //     perchasedDate:dayjs(purchaseDate),
  //     expiryDate: dayjs(expireDate)
  //   })
  //   setDepartments(  assetValue?.departmentId?.map((item: any) => ({
  //     label: item?.name,
  //     value: item?.name,
  //     id: item?._id,
  //   })),)
  // }, [assetValue]);

  // React.useEffect(() => {
  //   setAssetValue(assetsSliceData);
  // }, [assetsSliceData]);

  // React.useEffect(() => {
  //   if(typeof window !== 'undefined'){
  //     const assetId = {_id:window.location.pathname.split("/")[3]}
  //     dispatch(fetchSingleAssetsData(assetId));
  //    }
  // }, []);

  // const onSubmit = (values: any) => {

  // const isMatch = checkCredentials(values);
  // const procedures: any = {
  //   name: 'Stenography2',
  //   assectId: 'ASSET_1002',
  //   departmentId: '653b80a0301e33001265a64a',
  //   laboratoryId: '653b7fd4301e33001265a646',
  //   userId: 'USER_1001',
  //   procedureDetials:"Stenography2"

  // };
  // if(isMatch){
  //  dispatch(postProcedureData(values))
  // }

  // };
  const onSubmit = (values: any) => {
    // debugger
    const isMatch = checkCredentials(values.name);
    if (isMatch) {
      var deptArray: any = [];
      departments.map((item: any) => deptArray.push(item?.id));
      var labArray: any = [];
      laboratory.map((item: any) => labArray.push(item?.id));
      var org = organization;
      var assetValues = {
        _id: assetValue._id,
        name: values.name,
        organisationId: values?.organisationId,
        perchasedDate: values?.perchasedDate,
        // lastUsedDate: values.lastUsedDate,
        assetImageUrl: values.assetImageUrl,
        availability: values.availability,
        expiryDate: values?.expiryDate,
        departmentId: deptArray,
        laboratoryId: labArray,
        status: values.status,
      };

      dispatch(fetchUpdateAssetsData(assetValues));

      submitFormPopup();
      getFunction();
    } else {
      formik.setFieldError("name", "Invalid first name");
    }
  };

  const handleDateChanges = (selectedDate: any, name: any) => {
    if (selectedDate !== null) {
      const formattedDate = moment(selectedDate?.$d).format("MM/DD/YYYY");
      formik.handleChange(name)(formattedDate);
    }
  };
  const submitFormPopup = () => {
    setFormPopup(false);
    // successPopupRef.current.open(true, 'Asset');
    toast(`Assets have been updated successfully!`, {
      style: {
        background: "#00bf70",
        color: "#fff",
      },
    });
    setTimeout(() => {
      // successPopupRef.current.open(false, 'Asset');
      // getFunction
      navigate("/assets");
    }, 2000);
  };

  const departmentSliceData = useSelector(
    (state: any) => state.department.data?.get_all_departments
  );
  const labSliceData = useSelector(
    (state: any) => state.lab.data?.get_all_labs
  );

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

  const organizationSliceData = useSelector(
    (state: any) => state.organization.data?.get_all_organisations
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
    setOrganizationData(
      organizationSliceData?.map((item: any) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      }))
    );
  }, [departmentSliceData, labSliceData, organizationSliceData]);

  const purchaseDate = moment(assetValue?.perchasedDate)
    .local()
    .format("MM/DD/YYYY");
  const expireDate = moment(assetValue?.expiryDate)
    .local()
    .format("MM/DD/YYYY");

  const formik: any = useFormik({
    initialValues: {
      name: assetValue?.name,
      assetId: assetValue?.assetNumber,
      laboratoryId: assetValue?.laboratoryId,
      organisationId: assetValue?.organisationId,
      departmentId: assetValue?.departmentId,
      // userId: 'USER_1001',
      status: assetValue?.status,
      availability: assetValue?.availability,
      assetImageUrl: uploadedFile,
      // assets_id: assetValue.assets_id,
      lastUsedDate: assetValue?.lastUsedDate,
      perchasedDate: dayjs(purchaseDate),
      expiryDate: dayjs(expireDate),
      // perchasedDate:dayjs(today),
      // expiryDate: dayjs(today)
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const handleImageUpload = async () => {
    if (
      fileUploadField.current !== null &&
      fileUploadField.current !== undefined
    ) {
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
      await result.then((res: any) => {
        formik.setFieldValue("assetImageUrl", res.Location);
        setUploadedFile(res.Location);
        toast(`Image has been uploaded successfully!`, {
          style: {
            background: "#00bf70",
            color: "#fff",
          },
        });
      });
      await result.catch((err) => {
        console.error("Failed to upload");
        toast(`Failed to upload !`, {
          style: {
            background: "#e2445c",
            color: "#fff",
          },
        });
      });
      setLoader(false);
    }
  };

  return (
    <PrivateRoute>
      <Box className="main-padding">
        <Successpopup open={openSuccess} close={() => setSuccessOpen(false)} />
        <Box
          className="title-main"
          sx={{ borderBottom: "3px solid #F3F3F3", paddingBottom: "1rem" }}
        >
          <Box>
            <Typography>Asset details</Typography>
            <Typography className="sub-text">
              Edit your assets and can view its usage history.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Box sx={{ borderBottom: 0 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="tabs-common"
              className="tabs-common"
            >
              <Tab label="Edit details" {...a11yProps(0)} />
              <Tab label="History" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <CustomTabPanel value={value} index={0}>
              <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  lg={3}
                  xl={3}
                  sx={{
                    padding: "0px !important",
                    paddingRight: {
                      xs: "0px !important",
                      md: "30px !important",
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ textAlign: "center" }}>
                      {!loader ? (
                        <img
                          src={uploadedFile == null ? test : uploadedFile}
                          alt="test"
                          className="dynamic-img"
                          style={{ height: "250px", objectFit: "contain" }}
                        />
                      ) : (
                        <CircularProgress
                          color="inherit"
                          style={{
                            height: "250px",
                            width: "250px",
                            padding: "103px",
                          }}
                        />
                      )}
                    </Box>

                    <Box
                      className="edit-profile-btn"
                      sx={{ mt: 3, mb: 3, pb: "0px !important" }}
                    >
                      <Button onClick={triggerFileUploadField}>
                        Upload photo
                      </Button>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        ref={fileUploadField}
                        accept="image/jpg, image/jpeg, image/png"
                        onChange={handleImageUpload}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={5}
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
                            Asset Name{" "}
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <TextField
                            margin="none"
                            fullWidth
                            id="name"
                            name="name"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="Name"
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
                    <Grid container spacing={2} className="asset-popup">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box
                          className="asset-id"
                          style={{ position: "relative" }}
                        >
                          <label>
                            Asset Id (autogenerated)
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <TextField
                            margin="normal"
                            fullWidth
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.assetId}
                            id="assetId"
                            name="assetId"
                            autoComplete="off"
                            inputProps={{ maxLength: 50 }}
                            autoFocus
                            disabled
                            InputLabelProps={{ shrink: false }}
                            placeholder="Asset Id"
                            error={
                              formik.touched.assetId &&
                              Boolean(formik.errors.assetId)
                            }
                          />
                          {formik.touched.assetId && formik.errors.assetId && (
                            <Typography className="error-field">
                              {formik.errors.assetId}
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
                              inputRef={purchasedDateInputRef}
                              format="MM/DD/YYYY"
                              onChange={(selectedDate: any) =>
                                handleDateChanges(selectedDate, "perchasedDate")
                              }
                              value={formik.values.perchasedDate}
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
                          <label>
                            Guaranty/warranty/expiry date
                            <span style={{ color: "#E2445C" }}>*</span>
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              inputRef={expiryDateInputRef}
                              disablePast
                              format="MM/DD/YYYY"
                              onChange={(selectedDate: any) =>
                                handleDateChanges(selectedDate, "expiryDate")
                              }
                              value={formik.values.expiryDate}
                            />
                          </LocalizationProvider>
                          {formik.touched.expiryDate &&
                            formik.errors.expiryDate && (
                              <Typography className="error-field">
                                required
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
                          {/* <FormControl sx={{ width: '100%' }}> */}
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
                            id="organisationId"
                            name="organisationId"
                            autoComplete="organisationId"
                            placeholder="Organization"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.organisationId}
                            disabled={true}
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
                          {/* </FormControl> */}
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
                          {/* <FormControl sx={{ width: '100%' }}> */}
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
                              value.id == option.id
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
                              // setLaboratory([]);
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
                              formik.values.departmentId?.map((item: any) =>
                                dept.push(item?.id)
                              );
                              let payload: any = {
                                departmentId: dept,
                              };
                              dispatch(fetchLabById(payload));
                            }}
                          />{" "}
                          {formik.touched.departmentId &&
                            formik.errors.departmentId && (
                              <Typography className="error-field">
                                {formik.errors.departmentId}
                              </Typography>
                            )}
                          {/* <Autocomplete
                              multiple
                              id="departmentId"
                              options={
                                departmentData !== undefined ? departmentData : []
                              }
                              // value={departments}
                              disableCloseOnSelect
                              getOptionLabel={(option: any) => option.label}
                              renderOption={(props, option, { selected }) => (
                                 
                                <li {...props}>
                                  <Checkbox
                                    style={{ marginRight: 0 }}
                                    checked={selected}
                                  />
                                  {option.label}
                                </li>
                              )}
                              renderInput={(params) => <TextField {...params} />}
                              fullWidth
                              placeholder="Department"
                              size="medium"

                              onChange={(e, f) => {
                                f.forEach((element) =>
                                  departments.push(element.id),
                                );
                                formik.setFieldValue('departmentId', departments);
                              }}
                            />*/}
                          {/* {formik.touched.departmentId &&
                              formik.errors.departmentId && (
                                <Typography
                                  style={{
                                    color: '#E2445C',
                                    position: 'relative',
                                    top: '-109px',
                                    right: '-535px',
                                    fontSize: '14px ',
                                  }}
                                >
                                  {formik.errors.departmentId}
                                </Typography>
                              )} */}
                          {/* </FormControl> */}
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
                            id="departmentId"
                            options={labData !== undefined ? labData : []}
                            getOptionLabel={(option: any) => option.label}
                            isOptionEqualToValue={(option: any, value: any) =>
                              value.id == option.id
                            }
                            disableCloseOnSelect
                            value={laboratory}
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
                            {/* {AvailabilityList.map((item: any) => (
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
              <Box className="edit-details">
                <Button
                  variant="contained"
                  className="cancel-btn"
                  onClick={() => navigate("/assets")}
                  // onClick={() => navigate('/assets', {state:{props1:location.state.queries}})}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.dirty}
                  className="add-btn"
                >
                  Save
                </Button>
              </Box>
            </CustomTabPanel>
          </form>
          <CustomTabPanel value={value} index={1}>
            <Box className="asset-id-name">
              <img
                src={uploadedFile == null ? test : uploadedFile}
                alt="test"
                className="dynamic-img"
              />
              <Box className="asset-name">
                <Typography>{assetValue?.assetNumber}</Typography>
                <Typography>{assetValue?.name}</Typography>
              </Box>
            </Box>
            <Box>
              <HistoryTable procedureId={procedureId} />
            </Box>
          </CustomTabPanel>
          <SuccessPopup ref={successPopupRef} type={"edit"} />
        </Box>
      </Box>
    </PrivateRoute>
  );
}
