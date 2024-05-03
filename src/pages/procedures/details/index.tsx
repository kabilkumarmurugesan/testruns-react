import React from "react";
import PrivateRoute from "../../../components/PrivateRoute";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import edit from "../../../assets/images/edit.svg";
import { Editor } from "@tinymce/tinymce-react";
import {
  fetchSingleProcedureData,
  fetchUpdateProcedureData,
} from "../../../api/procedureAPI";
import { useDispatch, useSelector } from "react-redux";
import ProcedureForm from "../ProcedureForm";
import SuccessPopup from "../../../components/SuccessPopup";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import moment from "moment";
import { fetchAssetsName, fetchUpdateAssetsData } from "../../../api/assetsAPI";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import SpinerLoader from "../../../components/SpinnerLoader";
import AWS from "aws-sdk";
import { useLocation } from "react-router";
// import ProceduresRichText from './Editor';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Procedure Name is required")
    .max(50, "Must be 50 characters or less"),
  asset_Name: Yup.array().notRequired(),
  procedure: Yup.string().required().max(50, "Must be 50 characters or less"),
});

export default function ProcedureDetails() {
  const location: any = useLocation();
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [procedureData, setprocedureData] = React.useState<any>({});
  const [procedureValue, setprocedureValue] = React.useState<any>(
    location.state?.props
  );
  const [assetsData, setAssetsData] = React.useState<any>([]);
  const [assetNamepatch, setAssetNamepatch] = React.useState<any>([]);
  const [state, setState] = React.useState({ content: "" });
  const [isLoader, setIsLoader] = React.useState(true);
  const [htmlInput, setHtmlInput] = React.useState<any>({});

  const confirmationPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const formPopupRef: any = React.useRef(null);
  const editorRef: any = React.useRef(null);

  const procedureSliceData = useSelector(
    (state: any) => state.procedure.data?.get_procedure
  );
  const assetsSliceData = useSelector(
    (state: any) => state.assets.data?.get_all_assets_name
  );
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  // Fetch procedure data on component mount
  const onSubmit = (values: any) => {
    const isMatch = checkCredentials(values.name);
    if (isMatch) {
      // dispatch(fetchUpdateAssetsData(values));
      // setFormPopup(false);
    } else {
      formik.setFieldError("name", "Invalid first name");
    }
  };

  const credencial = loginUserSliceData?.verifyToken?.role[0];

  const formik: any = useFormik({
    initialValues: {
      name: procedureData?.name,
      asset_Name: "",
      procedure: "",
      html: "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  React.useEffect(() => {
    // Set a timer for 1 second (1000 milliseconds)
    const timerId = setTimeout(() => {
      setIsLoader(false);
      setprocedureData(procedureSliceData);
      location.state?.props &&
        procedureSliceData &&
        setprocedureValue(procedureSliceData);
      setState({ content: procedureSliceData?.procedureDetials });
      formik.setValues({ ...formik.values, name: procedureSliceData?.name });
      const data: { label: string; value: string; id: number }[] = [];
      if (procedureSliceData?.assetId.length !== 0) {
        // Uncomment the following lines if you have data structure like procedureSliceData.assetId
        procedureSliceData?.assetId?.map(
          (item: { name: string; _id: number }) => {
            data.push({ label: item.name, value: item.name, id: item._id });
          }
        );
      }
      setAssetNamepatch(data);
    }, 2000); // 1000 milliseconds = 1 second

    // Clean up the timer on component unmount or if procedureSliceData changes
    return () => clearTimeout(timerId);
  }, [procedureSliceData]);

  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  const handleSubmitFormPopup = () => {
    formPopupRef.current.open(false);
    successPopupRef.current.open(true, "Procedure");
    setTimeout(() => {
      successPopupRef.current.open(false, "Procedure");
    }, 3000);
  };

  const handleOpenConfirmationPopup = (state: any) => {
    confirmationPopupRef.current.open(state);
  };

  const handleChange = (content: any) => {
    setState({ content });
  };

  const handleEditorChange = (e: any) => {
    // console.log('Content was updated:', e.target.getContent());
  };

  const handleHtmlInput = () => {
    let objects = {};
    // @ts-ignore
    let inputEl: any = document
      ?.getElementById("content")
      ?.querySelectorAll("input");

    inputEl?.forEach((ele: any) => {
      const { id, value } = ele;
      let temp = { [id]: value };
      objects = { ...objects, temp };
      setHtmlInput((prev: any) => ({ ...prev, [id]: value }));
      // @ts-ignore
      ele.onChange = (e) => {
        const { id, value } = e.target;
        setHtmlInput((prev: any) => ({ ...prev, [id]: value }));
      };
    });
  };

  const handleSave = (e: any) => {
    var assetIds: any = [];
    let finalTableTitleResult: any;
    assetNamepatch?.map((item: any) => assetIds.push(item?.id));
    const payload = {
      _id: procedureData._id,
      name: formik.values.name,
      procedureDetials: state.content,
      assetId: assetIds,
    };
    handleHtmlInput();

    const tablesEles: any = document
      ?.getElementById("content")
      ?.querySelectorAll("table");

    if (tablesEles) {
      const result = Array?.from(tablesEles)?.map((tablesInstance: any) => {
        const headerCells = tablesInstance?.querySelectorAll("[data-column]");
        const headerNames = Array.from(headerCells).map((header: any) => ({
          key: header.getAttribute("data-column"),
          value: header.textContent.trim(),
        }));
        const tableDataRows: any = tablesInstance.querySelectorAll("tbody tr");
        const rowData = Array.from(tableDataRows)?.map((tableDataRow: any) => {
          const tableCells = tableDataRow.querySelectorAll("td[data-column]");
          return Array.from(tableCells).map((cell: any) => {
            const inputCntext = cell.querySelector("input[type='text']");
            if (inputCntext) {
              return {
                key: cell.getAttribute("data-column"),
                value: htmlInput[inputCntext.id],
              };
            }
          });
        });
        return {
          headerNames: headerNames,
          rowData: rowData,
        };
      });
      const mergedDatasets = result.map((dataset) => {
        const mergedData: any = [];
        for (let i = 0; i < dataset.rowData.length; i++) {
          const rowData = dataset.rowData[i];
          const mergedRow: any = {};
          for (let j = 0; j < rowData?.length; j++) {
            const header = dataset.headerNames[j];
            const value: any = rowData[j];
            mergedRow[header?.value] = value?.value;
          }
          mergedData.push(mergedRow);
        }
        return mergedData;
      });
      let filteredData = mergedDatasets?.filter((sublist) =>
        sublist?.some((obj: any) => Object?.keys(obj).length > 0)
      );
      filteredData = filteredData?.map((sublist) =>
        sublist?.filter((obj: any) => Object?.keys(obj).length > 0)
      );

      const results = filteredData?.map((dataset, index) => {
        const subResult = [];
        const firstDataItem = dataset[index];
        for (const key in firstDataItem) {
          const label = key;
          const values: any = [];
          dataset?.forEach((item: any) => {
            if (item[key]) {
              values.push(parseInt(item[key]));
            }
          });
          subResult.push({ label, values });
        }
        return subResult;
      });

      const tablesin = document
        ?.getElementById("content")
        ?.querySelectorAll("[data-table]");
      const getTitle: any = [];

      tablesin?.forEach((element: any) => {
        getTitle.push(element.textContent);
      });

      finalTableTitleResult = getTitle?.map((list: any, index: any) => {
        return { label: list, value: list, data: results[index] };
      });
      let vals = Object.values(htmlInput);
      const empty = vals.filter((item) => item === "");
    }
    if (formik.values.name !== "") {
      dispatch(fetchUpdateProcedureData(payload))
        .then(() => {
          handleAssetStatusValidation(payload);
          toast(`Procedure has been saved successfully!`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          });
          const procedureId = { _id: procedureData._id };
          dispatch(fetchSingleProcedureData(procedureId));
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  const handleAssetStatusValidation = (payload: any) => {
    let orginalAssets: any = [];
    procedureSliceData?.assetId?.map((item: { name: string; _id: number }) => {
      orginalAssets.push({ id: item._id, status: "Available" });
    });
    const newAssets = payload.assetId;
    const removedAsset = orginalAssets.filter(
      (obj: any) => !newAssets.some((val: any) => obj.id === val)
    );
    const diif = newAssets.filter(
      (val: any) => !orginalAssets.some((obj: any) => obj.id === val)
    );
    const addedAsset = diif.map((item: any) => {
      return { id: item, status: "In_Use" };
    });
    if (removedAsset.length > 0) {
      handleAssetStatusUpdation(removedAsset);
    }
    // if (addedAsset.length > 0) {
    //   handleAssetStatusUpdation(addedAsset);
    // }
  };

  const handleAssetStatusUpdation = (payload: any) => {
    payload.forEach((asset: any) => {
      const assetsChangePayload = {
        _id: asset.id,
        availability: asset.status,
      };
      dispatch(fetchUpdateAssetsData(assetsChangePayload));
    });
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const procedureId = { _id: window.location.pathname.split("/")[3] };
      dispatch(fetchSingleProcedureData(procedureId));
    }
  }, []);

  const reloadSingleData = async () => {
    const procedureId = { _id: procedureData._id };
    setIsLoader(true);
    await dispatch(fetchSingleProcedureData(procedureId));
    await setIsLoader(false);
  };

  React.useEffect(() => {
    const payload: any = {};
    payload["organisationId"] = loginUserSliceData?.verifyToken.organisationId;
    dispatch(fetchAssetsName(payload));
  }, []);

  React.useEffect(() => {
    setAssetsData(
      assetsSliceData?.map((item: any) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      }))
    );
  }, [assetsSliceData]);

  const checkCredentials = (values: any) => {
    return true;
  };

  const uploadVideo = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl: any = URL.createObjectURL(file);
      if (videoUrl) {
        const editor = editorRef.current.editor;

        editorRef.current?.insertContent(
          `<video controls><source src="${videoUrl}" type="video/mp4"></video>`
        );
      }
    }
  };

  const handleEditorInit = (editor: any) => {
    editor.ui.registry.addButton("uploadvideo", {
      text: "Upload Video",
      onAction: () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "video/*");
        input.onchange = uploadVideo;
        input.click();
      },
    });
  };

  const s3 = new AWS.S3({
    // params: { Bucket: S3_BUCKET, folderName: "profile" },
    region: "us-east-1",
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEYID,
  });

  return (
    <PrivateRoute>
      {!isLoader ? (
        <Box className="proceduredetails-page">
          <Box
            className="top-section"
            sx={{
              position: "relative !important",
              top: "0px !important",
              width: "100% !important",
            }}
          >
            <Box sx={{ padding: "24px 0px", margin: "0px 24px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <Box sx={{ paddingRight: "4rem" }}>
                    <Typography className="id-detail">
                      {procedureData?.procedureNumber}
                    </Typography>
                    <Typography className="id-detail-title">
                      {procedureData?.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <Box>
                    <Typography className="id-detail">Created by</Typography>
                    <Typography
                      className="id-detail"
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        marginTop: "0.4rem",
                      }}
                    >
                      {procedureData?.createdByName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <Box>
                    <Typography className="id-detail">Created on</Typography>
                    <Typography
                      className="id-detail"
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        marginTop: "0.4rem",
                      }}
                    >
                      {moment(parseInt(procedureData?.createdAt)).format(
                        "MM/DD/YYYY"
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      className="edit-btn"
                      onClick={() => {
                        formPopupRef.current.open(true, procedureData);
                      }}
                      disabled={!credencial?.procedure_management?.edit}
                    >
                      <img
                        src={edit}
                        alt="edit"
                        style={{ marginRight: "8px" }}
                      />
                      Edit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              {/* <Grid container spacing={2}>
             
            </Grid> */}
            </Box>
            <Divider
              sx={{ borderColor: "#FFEAA5", borderBottomWidth: "5px" }}
            />
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box
              className="main-proceduredetails"
              sx={{ padding: "1.5rem 1.5rem 8rem !important" }}
            >
              <Grid container spacing={2} className="">
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  className="prod-input-auto  prod-input"
                >
                  <Box style={{ position: "relative" }}>
                    <label style={{ marginBottom: "0.6rem", display: "block" }}>
                      Procedure name
                    </label>
                    <TextField
                      margin="none"
                      fullWidth
                      id="name"
                      name="name"
                      autoComplete="off"
                      className={
                        !credencial?.procedure_management?.edit
                          ? "bg-gray-input"
                          : '"prod-name"'
                      }
                      disabled={!credencial?.procedure_management?.edit}
                      InputLabelProps={{ shrink: false }}
                      inputProps={{ maxLength: 51 }}
                      placeholder="Procedure name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      size="small"
                      error={formik.touched.name && Boolean(formik.errors.name)}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <Typography className="error-field">
                        {formik.errors.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  className="prod-input-auto prod-multi"
                >
                  <Box style={{ position: "relative" }}>
                    <label style={{ marginBottom: "0.6rem", display: "block" }}>
                      Assets name
                    </label>
                    <Autocomplete
                      multiple
                      id="asset_Name"
                      className={
                        !credencial?.procedure_management?.edit
                          ? "bg-gray-input"
                          : ""
                      }
                      disableCloseOnSelect
                      value={assetNamepatch}
                      disabled={!credencial?.procedure_management?.edit}
                      options={assetsData !== undefined ? assetsData : []}
                      getOptionLabel={(option: any) => option.label}
                      isOptionEqualToValue={(option: any, value: any) =>
                        value.id == option.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={
                            assetNamepatch?.length == 0 ? "Asset Name/s" : ""
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
                            {option.label}
                          </li>
                        </React.Fragment>
                      )}
                      onChange={(_, selectedOptions: any) => {
                        setAssetNamepatch(selectedOptions);
                        formik.setValues({
                          ...formik.values,
                          asset_Name: selectedOptions,
                        });
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Box style={{ position: "relative" }}>
                    <label>Full procedure</label>
                    <Box sx={{ mt: 1.5 }} id="content">
                      <Editor
                        apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                        onInit={(evt: any, editor: any) =>
                          (editorRef.current = editor)
                        }
                        // value={editorData}
                        init={{
                          height: 650,
                          paste_data_images: false,
                          menubar: true,
                          selector: "textarea",
                          plugins: [
                            "advlist",
                            "paste",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                            "image",
                            "insertdatetime",
                            "template",
                            "insertinput",
                            "customInsertButton",
                            "customAlertButton subscript superscript charmap textpattern",
                          ],
                          toolbar:
                            "undo redo | blocks formatselect | " +
                            "charmap subscript superscript bold italic | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "help |link image code table customInsertButton insertdatetime template insertinput customDataAttrButton uploadVideo tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry ",
                          image_advtab: true,
                          image_title: true,
                          automatic_uploads: true,
                          file_picker_types: "image",
                          table_advtab: "true",
                          file_picker_callback: function (cb, value, meta) {
                            var input = document.createElement("input");
                            input.setAttribute("type", "file");
                            input.setAttribute(
                              "accept",
                              "image/jpg, image/jpeg, image/png"
                            );
                            input.onchange = function () {
                              var file: any = this.files[0];
                              var reader = new FileReader();
                              reader.onload = function () {
                                const keyPath = `profile/${Date.now()}`;
                                const params = {
                                  Bucket: "test-run-v2",
                                  Key: keyPath,
                                  Body: file,
                                  ACL: "public-read",
                                  // ContentType: selectedFile.type
                                };

                                s3.upload(
                                  params,
                                  function (err: any, data: any) {
                                    if (err) {
                                      console.error(
                                        "Error uploading image to AWS S3:",
                                        err
                                      );
                                    } else {
                                      const id =
                                        "blobid" + new Date().getTime();
                                      const blobCache =
                                        window?.tinymce?.activeEditor
                                          .editorUpload.blobCache;
                                      const blobInfo = blobCache.create(
                                        id,
                                        file,
                                        data.Location
                                      );
                                      blobCache.add(blobInfo);
                                      cb(data.Location, { alt: file.name });
                                    }
                                  }
                                );
                              };
                              reader.readAsDataURL(file);
                            };

                            input.click();
                          },
                          setup: function (editor) {
                            handleEditorInit(editor);
                            editor.ui.registry.addButton("customInsertButton", {
                              icon: "edit-block",
                              tooltip: "Insert Input Element",
                              onAction: function (_) {
                                const value = nanoid(7);
                                editor.insertContent(
                                  `&nbsp;<input type='text' id='value_${value}' name='value_${value}'>&nbsp;`
                                );
                              },
                            });
                            var toTimeHtml = function (date: any) {
                              return (
                                '<time datetime="' +
                                date.toString() +
                                '">' +
                                date.toDateString() +
                                "</time>"
                              );
                            };
                            editor.ui.registry.addButton("customVideoUpload", {
                              text: "Upload Video",
                              onAction: function () {
                                editor?.insertContent(
                                  `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4"></video>`
                                );
                              },
                            });

                            editor.ui.registry.addButton("customDateButton", {
                              icon: "insert-time",
                              tooltip: "Insert Current Date",
                              disabled: true,
                              onAction: function (_) {
                                editor.insertContent(toTimeHtml(new Date()));
                              },
                              onSetup: function (buttonApi) {
                                var editorEventCallback = function (
                                  eventApi: any
                                ) {
                                  buttonApi?.setDisabled(
                                    eventApi.element.nodeName.toLowerCase() ===
                                      "time"
                                  );
                                };
                                editor.on("NodeChange", editorEventCallback);
                                return function (buttonApi) {
                                  editor.off("NodeChange", editorEventCallback);
                                };
                              },
                            });

                            editor.ui.registry.addButton(
                              "customDataAttrButton",
                              {
                                icon: "fas fa-cog",
                                tooltip: "Assign Data Attribute",
                                onAction: function (_) {
                                  const selectedNode =
                                    editor.selection.getNode();
                                  const key = window.prompt(
                                    "Enter data attribute key:"
                                  );
                                  if (key) {
                                    const value = window.prompt(
                                      "Enter data attribute value:"
                                    );
                                    if (value) {
                                      selectedNode.setAttribute(
                                        `data-${key}`,
                                        value
                                      );
                                    }
                                  }
                                },
                              }
                            );
                          },
                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                        value={state.content}
                        onChange={handleEditorChange}
                        onEditorChange={handleChange}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box className="edit-details" sx={{ p: 2 }}>
              <Button
                variant="contained"
                className="cancel-btn"
                onClick={() => navigate("/procedures")}
              >
                Back
              </Button>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!credencial?.procedure_management?.edit}
                  className="add-btn"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </form>
          <ProcedureForm
            formData={procedureValue}
            type={"edit"}
            ref={formPopupRef}
            closeFormPopup={handleCloseFormPopup}
            submitFormPopup={handleSubmitFormPopup}
            openConfirmationPopup={handleOpenConfirmationPopup}
            reloadSingleData={reloadSingleData}
          />

          <SuccessPopup ref={successPopupRef} />
        </Box>
      ) : (
        <SpinerLoader isLoader={isLoader} />
      )}
    </PrivateRoute>
  );
}
