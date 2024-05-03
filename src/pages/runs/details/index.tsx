/* eslint-disable no-var run */
import React from "react";
import PrivateRoute from "../../../components/PrivateRoute";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import edit from "../../../assets/images/edit.svg";
import shareimg from "../../../assets/images/Share-black.svg";
import printer from "../../../assets/images/printer.svg";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Editor } from "@tinymce/tinymce-react";
import KeyboardArrowDownIcon from "../../../assets/images/chevrondown-thin.svg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import AddPeoplePopup from "../../../components/AddPeoplePopup";
import * as html2json from "html2json";
import parse from "html-react-parser";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import RunsForm from "../RunsForm";
import SuccessPopup from "../../../components/SuccessPopup";
import moment from "moment";
import { RunsStatusList } from "../../../utils/data";
import {
  fetchSingleRunsData,
  fetchTableChartData,
  fetchUpdateRunsData,
} from "../../../api/RunsAPI";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import TableChart from "../../../components/charts/TableChart";
import {
  UpdateUserRunsData,
  fetchSingleUserRunzData,
  postUserRunsData,
} from "../../../api/userRunsAPI";
import SpinerLoader from "../../../components/SpinnerLoader";
import RealtimeChart from "../../../components/charts/RealtimeChart";
import { fetchUpdateAssetsData } from "../../../api/assetsAPI";
import { useLocation, useNavigate } from "react-router";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const navigate: any = useNavigate();
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
        <Box sx={{ p: 3 }}>
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

export default function RunsDetails() {
  const dispatch: any = useDispatch();
  const location: any = useLocation();

  const [runzValue, setRunzValue] = React.useState<any>(location.state?.props);
  const [disableStart, setDisableStart] = React.useState<any>(
    runzValue?.status !== "Started"
  );
  const [disableChart, setDisableChart] = React.useState<boolean>(true);
  const [disableStop, setDisableStop] = React.useState<any>(
    runzValue?.status !== "Started"
  );
  const [value, setValue] = React.useState(0);
  const [userRunzResult, setUserRunzResult] = React.useState("");
  const [procedureResult, setProcedureResult] = React.useState("");
  const [userRunzID, setUserRunzID] = React.useState<any>({});
  const [remarks, setRemarks] = React.useState<any>("");
  const [runsOpen, setRunsOpen] = React.useState(false);
  const [moreInfo, setMoreInfo] = React.useState(false);
  const [userProcedure, setuserProcedure] = React.useState("");
  const runsStatus = RunsStatusList;
  const [isLoader, setIsLoader] = React.useState<boolean>(true);
  const [selectedChart, setSelectedChart] = React.useState<any>("Table_Chart");
  const [state, setState] = React.useState({ content: "" });
  const [typePopup, settypePopup] = React.useState("");
  const [staticChartData, setStaticChartData] = React.useState("");
  const [savedChartData, setSavedChartData] = React.useState(null);
  const [savedConnectData, setSavedConnectData] = React.useState(null);
  const [isChartPause, setIsChartPause] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const htmlData: any = state?.content ? state?.content : "";
  const [htmlInput, setHtmlInput] = React.useState<any>({});
  const htmlToJSON: any = html2json?.html2json(htmlData);
  const [usedAsset, setUsedAsset] = React.useState<any>(null);
  const uses = htmlToJSON?.child.map((ele: any) => ele);
  const formRef: any = React.useRef(null);
  const inputRefs = React.useRef<any>({});
  const runsPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const prevStateRef = React.useRef(htmlToJSON);
  const [charts, setCharts] = React.useState<any>([]);
  const [startDate, setStartDate] = React.useState<any>(null);
  const [endDate, setEndDate] = React.useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [save, setSave] = React.useState(false);
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);
  const credencial = loginUserSliceData?.verifyToken?.role[0];
  const tableChartSlice = useSelector(
    (state: any) => state.tableChart.data?.static_chart
  );
  const procedureSliceData = useSelector((state: any) => state.runs.data);

  const assetsSliceData = procedureSliceData?.get_run?.procedureId?.assetId;

  const editorRef: any = React.useRef(null);

  const colorsList = ["#e22828", "#90239f", "#111fdf", "#38e907", "#252525"];

  var runzId: any = [];
  runzId.push(runzValue?._id);
  var runzRow: any = [];
  runzRow.push(runzValue);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const procedureId = { _id: window.location.pathname.split("/")[3] };
      dispatch(fetchSingleRunsData(procedureId));
    }
  }, [value, disableStop, disableStart]);

  React.useEffect(() => {
    runzValue && setDisableChart(runzValue?.status === "Created");
    if (typeof window !== "undefined") {
      const runz = {
        runId:
          runzValue?.shared == true
            ? runzValue.runId
            : window.location.pathname.split("/")[3],
        // runId: window.location.pathname.split('/')[3],
      };
      dispatch(fetchSingleUserRunzData(runz))
        .then((res: any) => {
          setUserRunzID(res?.get_userRun);
          setRemarks(res?.get_userRun?.remarks);
          setStartDate(res?.get_userRun?.startTime);
          setEndDate(res?.get_userRun?.endTime);
          getSateicDate();
          if (
            res?.get_userRun?.used_Asset &&
            res?.get_userRun?.used_Asset.length > 0
          ) {
            setUsedAsset(res?.get_userRun?.used_Asset[0]);
          }
          if (save) {
            setUserRunzResult(userRunzResult);
          } else {
            setUserRunzResult(
              res?.get_userRun?.results !== undefined &&
                res?.get_userRun?.results
            );
          }
          // if (
          //   res?.get_userRun?.results !== null &&
          //   res?.get_userRun?.results !== ''
          // )
          //   setUserRunzResult(
          //     res?.get_userRun?.results !== undefined &&
          //       res?.get_userRun?.results,
          //   );
          // else {
          //   setUserRunzResult(userRunzResult);
          // }
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [value, runzValue]);

  function isEmptyObject(obj: any) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  const handleReloadSingleData = async () => {
    const procedureId = { _id: runzValue?._id };
    setIsLoader(true);
    await dispatch(fetchSingleRunsData(procedureId));
    const runz = {
      runId: runzValue?.shared
        ? runzValue.runId
        : window.location.pathname.split("/")[3],
    };
    await dispatch(fetchSingleUserRunzData(runz))
      .then((res: any) => {
        setUserRunzID(res?.get_userRun);
        setUserRunzResult(
          res?.get_userRun?.results !== undefined && res?.get_userRun?.results
        );
        setProcedureResult(
          res?.get_userRun?.results !== undefined && res?.get_userRun?.results
        );
        setIsLoader(false);
      })
      .catch((err: any) => {
        console.error(err);
        setIsLoader(false);
      });
  };

  React.useEffect(() => {
    if (runzValue) {
      setRunzValue(runzValue);
      setuserProcedure(userProcedure);
      setState({ content: userProcedure });
      if (runzValue?.status === "Created" && userRunzID?._id === undefined) {
        setDisableStart(false);
        setDisableStop(true);
      } else if (runzValue?.status === "Started" && userRunzID?._id) {
        setDisableStart(true);
        setDisableStop(false);
      } else if (runzValue?.status === "Stopped" && userRunzID?._id) {
        setDisableStart(true);
        setDisableStop(true);
      } else if (runzValue?.status === "Created") {
        setDisableStart(true);
        setDisableStop(true);
      }
    }
  }, [runzValue, userProcedure, userRunzID, value]);

  React.useEffect(() => {
    let text: any = "";
    if (userRunzResult !== null && userRunzResult !== "") {
      //   setResult(result)
      //   Object.entries(result).forEach(([key, value]) => {
      //     text =
      //       text +
      //       `<div>
      //       <div>
      //       <span style="font-size: 18px; line-height: 3">${key}</span> <span style="font-size: 18px; font-weight: 600">${value}</span>
      //       </div>
      //     </div>`;
      //   });
      // }
      // else{
      setUserRunzResult(userRunzResult);
      Object.entries(userRunzResult).forEach(([key, value]) => {
        text =
          text +
          `<div>
          <div>
          <span style="font-size: 18px; line-height: 3">${key}</span> <span style="font-size: 18px; font-weight: 600">${value}</span>
          </div>
        </div>`;
      });
    }
    if (text !== "") {
      setUserRunzResult(text + "</ul>");
    }
  }, [userProcedure]);
  React.useEffect(() => {
    // Set a timer for 1 second (1000 milliseconds)
    const timerId = setTimeout(() => {
      if (procedureSliceData?.get_run) {
        setIsLoader(false);
        setRunzValue(procedureSliceData?.get_run);
        setuserProcedure(
          procedureSliceData?.get_run?.procedureId?.procedureDetials
        );
      }
    }, 2000);

    // Clean up the timer on component unmount or if procedureSliceData changes
    return () => clearTimeout(timerId);
  }, [procedureSliceData, disableStart, disableStop, value]);

  React.useEffect(() => {
    const filtered =
      userRunzID?.userProcedure &&
      Object.entries(JSON.parse(userRunzID?.userProcedure)).filter(
        ([key]) => key
      );

    const obj = filtered && Object.fromEntries(filtered);
    if (!isEmptyObject(obj && userProcedure)) {
      for (const [key, values] of Object.entries(obj)) {
        if (values && document.getElementById(key)) {
          // @ts-ignore
          document.getElementById(key).value = values;
        }
      }
    }
    // getSateicDate()
  }, [userRunzID?.userProcedure, state, value]);

  React.useEffect(() => {
    handleHtmlInput();
  }, [state?.content, userRunzID?.userProcedure, value]);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    getSateicDate();
  };

  React.useEffect(() => {
    dispatch(fetchTableChartData("655b261e7e26fb0012425184"));
  }, []);

  React.useEffect(() => {
    const data: any = [];
    const tableList: any = [];
    if (tableChartSlice) {
      tableChartSlice.forEach((element: any) => {
        const tableChartOptionsList: any = [];
        const tableChartValues: any = [];
        const tableChannelsList: any = [];
        const tableChartData: any = [];

        element.rows.forEach((rows: any) => {
          tableChartData.push(rows.values);
        });

        for (let i = 0; i < 4; i++) {
          tableChartOptionsList.push({
            name: element.headers[i] ? element.headers[i] : null,
            value: `Y${i + 1}`,
            yAxis: `Y${i + 1}`,
            color: colorsList[i],
            yAxisId:
              i === 0
                ? "left1"
                : i === 1
                ? "right1"
                : i === 2
                ? "left2"
                : "right2",
            orientation: i % 2 === 0 ? "left" : "right",
            dataKey: `plot${[i + 1]}`,
            channelValue: null,
            xValue: null,
            yValue: `Y${i + 1}`,
            tableChartData: tableChartData,
          });
        }

        element.headers.forEach((head: any) => {
          tableChannelsList.push({
            name: head,
            value: head,
          });
        });

        tableList.push({
          name: element.tableName[0],
          value: element.tableName[0],
        });

        element.rows.forEach((row: any, rowIndex: number) => {
          row.values.forEach((value: any) => {
            tableChartValues.push({
              [`plot${rowIndex + 1}`]: value,
              name: value,
            });
          });
        });
        data.push({
          name: element.tableName[0] ? element.tableName[0] : null,
          selectedTable: null,
          tableChartValues: [],
          tableChartOptionsList: tableChartOptionsList,
          tableChannelsList: tableChannelsList,
          tableList: tableList,
          activeChannelOptions: [],
          activeTableChartValues: [],
          xValue: null,
        });
      });
      setCharts(data);
    }
  }, [tableChartSlice]);

  const handleSubmitFormPopup = () => {
    runsPopupRef.current.open(false);
    successPopupRef.current.open(true, "Runs");
    setTimeout(() => {
      successPopupRef.current.open(false, "Runs");
    }, 3000);
  };

  const getSateicDate = () => {
    const tablesEles: any = document
      ?.getElementById("content")
      ?.querySelectorAll("table");
    let finalTableTitleResult: any;
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
              if (!Number.isInteger(parseFloat(item[key]))) {
                values.push(parseFloat(item[key]));
              } else {
                values.push(parseInt(item[key]));
              }
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

      tablesin?.forEach((element, index) => {
        getTitle.push(element.textContent);
      });

      finalTableTitleResult = getTitle?.map((list: any, index: any) => {
        return { label: list, value: list, data: results[index] };
      });
      setStaticChartData(finalTableTitleResult);
    }
  };

  const onSubmit = () => {
    // setLoading(true);

    handleHtmlInput();
    const tablesEles: any = document
      ?.getElementById("content")
      ?.querySelectorAll("table");
    let finalTableTitleResult: any;
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
              if (!Number.isInteger(parseFloat(item[key]))) {
                values.push(parseFloat(item[key]));
              } else {
                values.push(parseInt(item[key]));
              }
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

      tablesin?.forEach((element, index) => {
        getTitle.push(element.textContent);
      });

      finalTableTitleResult = getTitle?.map((list: any, index: any) => {
        return { label: list, value: list, data: results[index] };
      });
    }
    let vals = Object.values(htmlInput);

    const empty = vals.filter((item) => item == "");

    // if (empty.length !== 0) {
    //   toast('Please fill in all required fields before saving!', {
    //     style: {
    //       background: '#d92828',
    //       color: '#fff',
    //     },
    //   });
    setLoading(false);
    // } else if (empty.length === 0) {
    handleHtmlInput();
    var payload: any = {
      runId: runzValue._id,
      organisationId: procedureSliceData?.get_run?.organisationId,
      userProcedure: JSON.stringify(htmlInput),
      static_chart_data: JSON.stringify(finalTableTitleResult),
      startTime: moment(new Date()).toISOString(),
    };
    if (!userRunzID?._id) {
      // setLoading(true)
      // dispatch(postUserRunsData(payload))
      //   .then((res: any) => {
      //     setLoading(false);
      //     if (res.create_userRunz._id) {
      //       let payload1 = {
      //         _id: runzValue._id,
      //         status: 'Started',
      //         procedureName: runzValue?.procedureId?.name,
      //       };
      //       dispatch(fetchUpdateRunsData(payload1)).then(() => {
      //         const procedureId = { _id: runzValue?._id };
      //         dispatch(fetchSingleRunsData(procedureId));
      //         toast(`Initial run readings have been added successfully!`, {
      //           style: {
      //             background: '#00bf70',
      //             color: '#fff'
      //           },
      //         });
      //       });
      //     } else {
      //       toast('Something went wrong', {
      //         style: {
      //           background: '#d92828',
      //           color: '#fff',
      //         },
      //       });
      //     }
      //   })
      //   .catch((err: any) => {
      //     setLoading(false);
      //     console.error(err);
      //   });
      toast(
        loginUserSliceData.verifyToken._id === runzValue?.assignedTo?._id
          ? "Please click start button before saving the result!"
          : "Assigned user can be only update the value",
        {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        }
      );
    } else {
      setLoading(true);
      let payload2 = {
        _id: userRunzID?._id,
        organisationId: procedureSliceData?.get_run?.organisationId,
        userProcedure: JSON.stringify(htmlInput),
        static_chart_data: JSON.stringify(finalTableTitleResult),
      };
      dispatch(UpdateUserRunsData(payload2))
        .then((res: any) => {
          setLoading(false);
          setStaticChartData(finalTableTitleResult);
          setSavedChartData(null);
          toast(`Run readings have been updated successfully!`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          });
        })
        .catch((err: any) => {
          setLoading(false);
          console.error(err);
        });
    }
    const data: any = {
      value_1ZyZJXD: "0",
      // ... (other key-value pairs)
      value_jouUqbl: "33",
    };

    // Add "title" property to the last object
    data["title"] = "Vibrational_magnetometer_acet";

    htmlInput["title"] = procedureSliceData?.get_run?.procedureId?.name;

    fetch("https://vyxeuzxdui.us-east-1.awsapprunner.com/runPython", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(htmlInput),
    })
      .then((res) => {
        fetch("https://vyxeuzxdui.us-east-1.awsapprunner.com/runPython")
          .then((res) => res.json())
          .then((res) => {
            var newarray: any = [];
            newarray = Object.keys(res);

            const data = res !== undefined ? res[newarray][0] : "";
            // setUserRunzResult(data);
            let text: any = "";
            Object.entries(data).forEach(([key, value]) => {
              text =
                text +
                `<div>
              <div>
              <span style="font-size: 18px; line-height: 3">${key}</span> <span style="font-size: 18px; font-weight: 600">${value}</span>
              </div>
            </div>`;
            });
            if (text !== "") {
              setUserRunzResult(text + "</ul>");
            }
            setSave(true);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
    // }
  };

  const handleChanged1 = (content: any) => {
    setUserRunzResult(content);
  };
  const handleChanged = (content: any) => {
    setRemarks(content);
  };

  const resultSave = async () => {
    console.log(
      (userRunzResult !== "" && userRunzResult !== null) ||
        (procedureResult !== null && procedureResult !== ""),
      "userRunzResult"
    );
    if (runzValue.status === "Created") {
      setLoading(true);
      const payload: any = {
        runId: runzValue._id,
        results: JSON.stringify(
          userRunzResult !== null ? userRunzResult : procedureResult
        ),
      };

      if (
        !JSON.stringify(userRunzResult).includes("No calculations") &&
        ((userRunzResult !== "" && userRunzResult !== null) ||
          (procedureResult !== null && procedureResult !== ""))
      ) {
        await dispatch(postUserRunsData(payload)).then(() => {
          const procedureId = { _id: runzValue?._id };
          dispatch(fetchSingleRunsData(procedureId));
          let payload1 = {
            _id: runzValue._id,
            status: "Submitted",
            procedureName: runzValue?.procedureId?.name,
          };
          toast(`Results have been saved successfully!`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          });
          handleAssetStatusUpdation(assetsSliceData, "Available");

          dispatch(fetchUpdateRunsData(payload1));
          dispatch(fetchSingleRunsData(procedureId));
          setLoading(false);
        });
      } else {
        setLoading(false);
        toast("Result must be filled", {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        });
      }
    } else if (
      runzValue.status !== "Created" &&
      runzValue.status !== "Started"
    ) {
      setLoading(true);
      const payload2: any = {
        _id: userRunzID?._id,
        results: userRunzResult,
      };
      console.log(userRunzResult, "userRunzResult");
      if (
        !JSON.stringify(userRunzResult).includes("No calculations") &&
        ((userRunzResult !== "" && userRunzResult !== null) ||
          (procedureResult !== null && procedureResult !== ""))
      ) {
        console.log(userRunzResult, "userRunzResult");
        await dispatch(UpdateUserRunsData(payload2));
        let payload1 = {
          _id: runzValue._id,
          status: "Submitted",
          procedureName: runzValue?.procedureId?.name,
        };
        toast(`Result saved successfully !`, {
          style: {
            background: "#00bf70",
            color: "#fff",
          },
        });
        setLoading(false);
        await dispatch(fetchUpdateRunsData(payload1));
        const procedureId = { _id: runzValue?._id };
        dispatch(fetchSingleRunsData(procedureId));
      } else {
        setLoading(false);

        toast("Result must be filled", {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        });
      }
    } else {
      toast("Please click stop button before saving the result!", {
        style: {
          background: "#d92828",
          color: "#fff",
        },
      });
    }
    setSave(false);
  };

  const remarkSave = async () => {
    if (userRunzID?._id) {
      setLoading(true);
      const payload: any = {
        _id: userRunzID?._id,
        remarks: remarks,
      };
      let payload1 = {
        _id: runzValue._id,
        status: "Completed",
        procedureName: runzValue?.procedureId?.name,
      };
      if (runzValue.status == "Submitted" || runzValue.status == "Completed") {
        if (remarks !== "" && remarks !== null) {
          await dispatch(UpdateUserRunsData(payload));
          await dispatch(fetchUpdateRunsData(payload1));
          const procedureId = { _id: runzValue?._id };
          await dispatch(fetchSingleRunsData(procedureId));
          await toast(`Remarks have been saved successfully!`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          });
          setLoading(false);
        } else {
          setLoading(false);
          toast("Remarks field cannot be empty. Please enter a value!", {
            style: {
              background: "#d92828",
              color: "#fff",
            },
          });
        }
      } else {
        setLoading(false);
        toast(
          runzValue.status == "Stopped"
            ? "Please add the result before saving the remarks!"
            : "Please click stop button before saving the remarks!",
          {
            style: {
              background: "#d92828",
              color: "#fff",
            },
          }
        );
      }
    } else {
      setLoading(true);
      const payload2: any = {
        _id: userRunzID?._id,
        remarks: remarks,
      };
      let payload1 = {
        _id: runzValue._id,
        status: "Completed",
        procedureName: runzValue?.procedureId?.name,
      };
      if (remarks !== "" && remarks !== null) {
        if (runzValue.status !== "Created" && runzValue.status !== "Started") {
          await dispatch(postUserRunsData(payload2));
          await dispatch(fetchUpdateRunsData(payload1));
          const procedureId = { _id: runzValue?._id };
          await dispatch(fetchSingleRunsData(procedureId));
          await toast(`Remarks saved successfully !`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          });
          setLoading(false);
        } else {
          setLoading(false);
          toast("Remarks field cannot be empty. Please enter a value.", {
            style: {
              background: "#d92828",
              color: "#fff",
            },
          });
        }
      } else {
        setLoading(false);
        toast("Remarks field cannot be empty. Please enter a value.", {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        });
      }
    }
  };

  const printDocument = () => {
    const input: any = document.getElementById("divToPrint");
    // Set the desired PDF size (A4 or A3)
    const pdfWidth = typeof window !== "undefined" && window.innerWidth;
    const pdfHeight = typeof window !== "undefined" && window.innerHeight;

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        let formateArray: [any, any] = [pdfWidth, pdfHeight];
        const pdf: any = new jsPDF({
          orientation: "portrait",
          format: formateArray,
        });

        pdf.addImage(imgData, "JPEG", 0, 0);
        pdf.save("chart.pdf");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChartChange = (event: any) => {
    setSelectedChart(event.target.value);
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
      // setHtmlInput((prev: any) => ({ ...prev, title: procedureSliceData?.get_run?.procedureId?.name}));
      // setHtmlInput(prevData => ({
      //   ...prevData,
      //   title: "Vibrational_magnetometer_acet"
      // }));
      // @ts-ignore
      ele.onChange = (e) => {
        const { id, value } = e.target;
        setHtmlInput((prev: any) => ({ ...prev, [id]: value }));
        // setHtmlInput((prev: any) => ({ ...prev, title: procedureSliceData?.get_run?.procedureId?.name}));
      };
    });
    getSateicDate();
    // setHtmlInput((prev: any) => ({ ...prev, title: procedureSliceData?.get_run?.procedureId?.name}));
  };

  const uploadVideo = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
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

  const handleAssignClick = (val: string) => {
    setRunsOpen(true);
    settypePopup(val);
  };

  const handleStatusChange = async (status: any) => {
    setDisableStart(true);
    setDisableStop(status !== "Started");
    var runsChange: any = {
      _id: runzValue._id,
    };
    runsChange["status"] = status;
    status === "Stopped" && setIsChartPause(true);
    var createPayload: any = {
      runId: runzValue._id,
      organisationId: procedureSliceData?.get_run?.organisationId,
      userProcedure: JSON.stringify(htmlInput),
      static_chart_data: JSON.stringify(staticChartData),
    };
    var updatePayload: any = {
      _id: userRunzID?._id,
      organisationId: procedureSliceData?.get_run?.organisationId,
      userProcedure: JSON.stringify(htmlInput),
      static_chart_data: JSON.stringify(staticChartData),
      used_Asset: [usedAsset],
    };
    setLoading(true);
    if (status == "Started") {
      if (userRunzID?._id) {
        updatePayload["startTime"] = moment(new Date()).toISOString();
      } else {
        createPayload["startTime"] = moment(new Date()).toISOString();
      }
      setStartDate(moment(new Date()).toISOString());
    } else {
      setEndDate(moment(new Date()).toISOString());
      updatePayload["endTime"] = moment(new Date()).toISOString();
    }
    if (userRunzID?._id) {
      await dispatch(UpdateUserRunsData(updatePayload));
    } else {
      await dispatch(postUserRunsData(createPayload));
    }
    await dispatch(fetchUpdateRunsData(runsChange));
    toast(
      `${
        status == "Started"
          ? "Runs has been Started!"
          : "Runs has been Stopped!"
      } `,
      {
        style: {
          background: "#00bf70",
          color: "#fff",
        },
      }
    );
    let payload1 = {
      _id: runzValue._id,
      status: status,
      procedureName: runzValue?.procedureId?.name,
    };
    await dispatch(fetchUpdateRunsData(payload1)).then((res: any) => {
      const procedureId = { _id: runzValue?._id };
      dispatch(fetchSingleRunsData(procedureId)).then((res: any) => {
        if (res?.data?.get_run) {
          setLoading(false);
        }
      });
    });
  };

  const handleAssetStatusUpdation = (payload: any, status: string) => {
    payload.forEach((asset: any) => {
      const assetsChangePayload = {
        _id: asset._id,
        availability: status,
      };
      dispatch(fetchUpdateAssetsData(assetsChangePayload));
    });
  };

  const handleDateChartRetrieve = (data: any, type: string) => {
    type == "table" ? setSavedChartData(data) : setSavedConnectData(data);
  };

  const getsetUsedAsset = (data: any) => {
    setUsedAsset(data);
  };
  return (
    <PrivateRoute>
      {isLoader ? (
        <SpinerLoader isLoader={isLoader} />
      ) : (
        <>
          <Box className="runzdetails-page">
            <Box className="top-section">
              <Box sx={{ padding: "24px 0px", margin: "0px 24px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={10} md={10} lg={5} xl={6}>
                    <Box>
                      <Typography className="id-detail">
                        {runzValue?.runNumber}
                      </Typography>
                      <Typography className="id-detail-title">
                        {runzValue?.procedureId?.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={7} xl={6}>
                    <Box
                      sx={{
                        display: { xs: "none", lg: "flex" },
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "end",
                      }}
                    >
                      {loginUserSliceData.verifyToken._id ===
                        runzValue?.assignedTo?._id && (
                        <>
                          <Button
                            disabled={disableStart}
                            variant="contained"
                            style={{
                              boxShadow: "none",
                              backgroundColor: "#ffc60b",
                              padding: "4px 6px",
                              justifyContent: "center",
                            }}
                            sx={{ m: 2 }}
                            onClick={() => {
                              var payload: any = {
                                runId: runzValue._id,
                                organisationId:
                                  procedureSliceData?.get_run?.organisationId,
                                startTime: moment(new Date()).toISOString(),
                              };
                              dispatch(postUserRunsData(payload))
                                .then((res: any) => {
                                  setLoading(false);
                                  const runz = {
                                    runId: runzValue?.shared
                                      ? runzValue.runId
                                      : window.location.pathname.split("/")[3],
                                  };
                                  dispatch(fetchSingleUserRunzData(runz))
                                    .then((res: any) => {
                                      setUserRunzID(res?.get_userRun);
                                      const procedureId = {
                                        _id: runzValue?._id,
                                      };
                                      dispatch(
                                        fetchSingleRunsData(procedureId)
                                      );
                                    })
                                    .catch((err: any) => {
                                      console.error(err);
                                    });
                                })
                                .catch((err: any) => {
                                  setLoading(false);
                                  console.error(err);
                                });
                              handleStatusChange("Started");
                              handleAssetStatusUpdation(
                                assetsSliceData,
                                "In_Use"
                              );
                            }}
                          >
                            Start
                          </Button>
                          <Button
                            disabled={disableStop}
                            variant="contained"
                            style={{
                              boxShadow: "none",
                              backgroundColor: "#ffc60b",
                              padding: "4px 6px",
                              justifyContent: "center",
                              marginRight: "2rem",
                            }}
                            sx={{ m: 2 }}
                            onClick={() => {
                              handleStatusChange("Stopped");
                              handleAssetStatusUpdation(
                                assetsSliceData,
                                "Available"
                              );
                            }}
                          >
                            Stop
                          </Button>
                        </>
                      )}

                      <Button
                        type="submit"
                        variant="contained"
                        className="edit-btn"
                        onClick={() => {
                          handleAssignClick("share");
                        }}
                        disabled={!credencial?.runs_management?.share}
                      >
                        <img
                          src={shareimg}
                          alt="edit"
                          style={{ marginRight: "8px" }}
                        />
                        Share
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        className="edit-btn"
                        onClick={() => {
                          // setDialog2Open(true);
                          runsPopupRef.current.open(true, runzValue);
                        }}
                        disabled={!credencial?.runs_management?.edit}
                      >
                        <img
                          src={edit}
                          alt="edit"
                          style={{ marginRight: "8px" }}
                        />
                        Edit
                      </Button>
                      <Button
                        className="edit-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          marginRight: "0rem",
                        }}
                        onClick={() => setMoreInfo(!moreInfo)}
                      >
                        More Info
                        {!moreInfo ? (
                          <KeyboardArrowDown />
                        ) : (
                          <KeyboardArrowUp />
                        )}
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: { xs: "block", lg: "none" },
                        textAlign: "right",
                      }}
                    >
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        disableScrollLock={true}
                      >
                        {loginUserSliceData.verifyToken._id ==
                          runzValue?.assignedTo?._id && (
                          <>
                            <MenuItem onClick={handleClose}>
                              <Button
                                disabled={disableStart}
                                variant="contained"
                                style={{
                                  boxShadow: "none",
                                  backgroundColor: "#ffc60b",
                                  padding: "4px 6px",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  var payload: any = {
                                    runId: runzValue._id,
                                    organisationId:
                                      procedureSliceData?.get_run
                                        ?.organisationId,
                                    startTime: moment(new Date()).toISOString(),
                                  };
                                  dispatch(postUserRunsData(payload))
                                    .then((res: any) => {
                                      setLoading(false);
                                      const runz = {
                                        runId: runzValue?.shared
                                          ? runzValue.runId
                                          : window.location.pathname.split(
                                              "/"
                                            )[3],
                                      };
                                      dispatch(fetchSingleUserRunzData(runz))
                                        .then((res: any) => {
                                          setUserRunzID(res?.get_userRun);
                                        })
                                        .catch((err: any) => {
                                          console.error(err);
                                        });
                                      const procedureId = {
                                        _id: runzValue?._id,
                                      };
                                      dispatch(
                                        fetchSingleRunsData(procedureId)
                                      );
                                    })
                                    .catch((err: any) => {
                                      setLoading(false);
                                      console.error(err);
                                    });
                                  handleStatusChange("Started");
                                  handleAssetStatusUpdation(
                                    assetsSliceData,
                                    "In_Use"
                                  );
                                }}
                              >
                                Start
                              </Button>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <Button
                                disabled={disableStop}
                                variant="contained"
                                style={{
                                  boxShadow: "none",
                                  backgroundColor: "#ffc60b",
                                  padding: "4px 6px",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  handleStatusChange("Stopped");
                                  handleAssetStatusUpdation(
                                    assetsSliceData,
                                    "Available"
                                  );
                                }}
                              >
                                Stop
                              </Button>
                            </MenuItem>
                          </>
                        )}

                        <MenuItem
                          onClick={() => {
                            handleAssignClick("share");
                            handleClose();
                          }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            className="edit-btn"
                            disabled={!credencial?.runs_management?.share}
                          >
                            <img
                              src={shareimg}
                              alt="edit"
                              style={{ marginRight: "8px" }}
                            />
                            Share
                          </Button>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            // setDialog2Open(true);
                            runsPopupRef.current.open(true);
                            handleClose();
                          }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            className="edit-btn"
                            disabled={!credencial?.runs_management?.edit}
                          >
                            <img
                              src={edit}
                              alt="edit"
                              style={{ marginRight: "8px" }}
                            />
                            Edit
                          </Button>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setMoreInfo(!moreInfo);
                            handleClose();
                          }}
                        >
                          <Button
                            className="edit-btn"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              marginRight: "0rem",
                            }}
                          >
                            More Info
                            <img
                              src={KeyboardArrowDownIcon}
                              alt="KeyboardArrowDownIcon"
                              style={{ marginLeft: "8px" }}
                            />
                          </Button>
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box
                className="assign-create"
                sx={{
                  padding: "24px 0px",
                  margin: "0px 24px",
                  display: moreInfo ? "block" : "none",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">
                        Test objective
                      </Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: "16px",
                          marginTop: "0.4rem",
                        }}
                      >
                        {runzValue?.objective}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Run by</Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: "16px",
                          marginTop: "0.4rem",
                        }}
                      >
                        {runzValue?.assignedTo?.firstName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Assigned by</Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: "16px",
                          marginTop: "0.4rem",
                        }}
                      >
                        {runzValue?.assignedBy?.firstName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Created on</Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: "16px",
                          marginTop: "0.4rem",
                        }}
                      >
                        {moment(parseInt(runzValue?.createdAt)).format(
                          "MM/DD/YYYY"
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Status</Typography>

                      <Box style={{ padding: "0px" }}>
                        <Box
                          className={
                            runzValue?.status === "Created"
                              ? "create-select td-select"
                              : runzValue?.status === "Started"
                              ? "start-select td-select"
                              : runzValue?.status === "Completed"
                              ? "active-select td-select"
                              : runzValue?.status === "Submitted"
                              ? "submit-select td-select"
                              : "inactive-select td-select"
                          }
                          style={{
                            background:
                              runzValue?.status === "Created"
                                ? "#8d8d8d"
                                : runzValue?.status === "Started"
                                ? "#faaa49"
                                : runzValue?.status === "Stopped"
                                ? "#e2445c"
                                : runzValue?.status === "Submitted"
                                ? "#a01fb1"
                                : "#00bf70",
                            padding: "6px",
                            color: "white",
                            width: "140px",
                            borderRadius: "20px",
                            height: "26px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {runzValue?.status}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider
                sx={{ borderColor: "#FFEAA5", borderBottomWidth: "5px" }}
              />
            </Box>

            <Box className="main-runzdetails runz-height">
              <Box className="runz-height" sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 0 }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="tabs-common"
                    className="tabs-common"
                  >
                    <Tab label="Procedures" {...a11yProps(0)} />
                    <Tab
                      disabled={disableChart}
                      label="Charts"
                      {...a11yProps(1)}
                    />
                    <Tab
                      disabled={disableChart}
                      label="Results"
                      {...a11yProps(2)}
                    />
                    <Tab
                      disabled={disableChart}
                      label="Remarks"
                      {...a11yProps(3)}
                    />
                  </Tabs>
                </Box>
                <Box sx={{ paddingBottom: "6rem" }}>
                  <CustomTabPanel value={value} index={0}>
                    {/* <div dangerouslySetInnerHTML={{ __html: userProcedure }} /> */}
                    <div
                      id="content"
                      className="run-editor-width"
                      style={{ overflowY: "scroll" }}
                    >
                      <form ref={formRef} onChange={handleHtmlInput}>
                        {uses.map((el: any) =>
                          parse(htmlToJSON && html2json.json2html(el))
                        )}
                      </form>
                    </div>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Box id="divToPrint">
                      <Box sx={{ mb: 2 }}>
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={selectedChart}
                            onChange={handleChartChange}
                          >
                            <FormControlLabel
                              value="Table_Chart"
                              control={<Radio />}
                              label="Table Chart"
                              style={{
                                paddingLeft: "10px",
                              }}
                            />
                            <FormControlLabel
                              value="Realtime_Chart"
                              control={<Radio />}
                              label="Connected Chart"
                              style={{
                                paddingLeft: "10px",
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                      {selectedChart === "Table_Chart" ? (
                        <TableChart
                          staticChartData={staticChartData}
                          handleDateChartRetrieve={handleDateChartRetrieve}
                          savedChartData={savedChartData}
                        />
                      ) : selectedChart === "Realtime_Chart" ? (
                        // eslint-disable-next-line react/jsx-no-undef
                        <RealtimeChart
                          handleDateChartRetrieve={handleDateChartRetrieve}
                          savedConnectData={savedConnectData}
                          startDate={startDate}
                          endDate={endDate}
                          usedAsset={usedAsset}
                          isPause={isChartPause}
                          getsetUsedAsset={getsetUsedAsset}
                        />
                      ) : (
                        <Box>Archived Chart</Box>
                      )}
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <Editor
                      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                      value={
                        userRunzResult == null || userRunzResult == ""
                          ? procedureResult
                          : userRunzResult
                      }
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          "advlist",
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
                          "insertinput customInsertButton customAlertButton subscript superscript charmap",
                        ],
                        toolbar:
                          "undo redo | blocks formatselect | " +
                          "charmap subscript superscript bold italic | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "help |link image code table customInsertButton insertdatetime template insertinput customAlertButton uploadVideo tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry ",
                        image_advtab: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: "image",
                        setup: function (editor) {
                          handleEditorInit(editor);
                          editor.ui.registry.addButton("customInsertButton", {
                            icon: "edit-block",
                            tooltip: "Insert Input Element",
                            onAction: function (_) {
                              // const value = nanoid(7);
                              editor.insertContent(
                                `&nbsp;<input type='text' >&nbsp;`
                              );
                            },
                          });
                          editor.ui.registry.addButton("customVideoUpload", {
                            text: "Upload Video",
                            onAction: function () {
                              editor.insertContent(
                                `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4"></video>`
                              );
                            },
                          });
                          editor.ui.registry.addButton("customAlertButton", {
                            icon: "temporary-placeholder", // Use the built-in alert icon
                            // tooltip: 'Custom Alert',
                            onAction: function (_) {
                              const userInput = window.prompt(
                                "Enter data key attribute"
                              );
                            },
                          });
                        },
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                      onEditorChange={handleChanged1}
                    />
                  </CustomTabPanel>

                  <CustomTabPanel value={value} index={3}>
                    <Editor
                      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      init={{
                        height: 500,
                        menubar: true,
                         plugins: [
                          "advlist",
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
                          "customAlertButton subscript superscript charmap",
                        ],
                        toolbar:
                          "undo redo | blocks formatselect | " +
                          "charmap subscript superscript bold italic | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "help |link image code table customInsertButton insertdatetime template insertinput customAlertButton uploadVideo tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry ",
                        image_advtab: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: "image",
                        setup: function (editor) {
                          handleEditorInit(editor);
                          editor.ui.registry.addButton("customInsertButton", {
                            icon: "edit-block",
                            tooltip: "Insert Input Element",
                            onAction: function (_) {
                              // const value = nanoid(7);
                              editor.insertContent(
                                `&nbsp;<input type='text' >&nbsp;`
                              );
                            },
                          });
                          editor.ui.registry.addButton("customAlertButton", {
                            icon: "temporary-placeholder", // Use the built-in alert icon
                            // tooltip: 'Custom Alert',
                            onAction: function (_) {
                              const userInput = window.prompt(
                                "Enter data key attribute"
                              );
                            },
                          });
                          editor.ui.registry.addButton("customVideoUpload", {
                            text: "Upload Video",
                            onAction: function () {
                              editor.insertContent(
                                `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4"></video>`
                              );
                              // if (fileInputRef.current) {
                              //   fileInputRef.current.click();
                              // }
                            },
                          });
                        },
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                      value={remarks}
                      // onChange={handleEditorChange}
                      onEditorChange={handleChanged}
                    />
                  </CustomTabPanel>
                </Box>
              </Box>
              <Box className="edit-details" sx={{ p: 2 }}>
                <Button
                  onClick={() =>
                    navigate("/runs", {
                      state: {
                        props1: location.state.queries,
                        props2: location.state.currentPage,
                      },
                    })
                  }
                  variant="contained"
                  className="cancel-btn"
                >
                  Back
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {value == 1 && (
                    <img
                      onClick={() => printDocument()}
                      src={printer}
                      alt="printer"
                      style={{ marginRight: "1rem", cursor: "pointer" }}
                    />
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    className="add-btn"
                    disabled={
                      value == 0 && Object.keys(htmlInput).length == 0
                        ? true
                        : false
                    }
                    style={{
                      position: "sticky",
                      display: value == 1 ? "none" : "block",
                    }}
                    onClick={() => {
                      if (!loading) {
                        (value == 0 && onSubmit()) ||
                          (value == 2 && resultSave()) ||
                          (value == 3 && remarkSave());
                      }
                    }}
                  >
                    {!loading ? (
                      "Save"
                    ) : (
                      <CircularProgress color="warning" size={20} />
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <SuccessPopup ref={successPopupRef} type="edit" />
          <RunsForm
            formData={runzValue}
            ref={runsPopupRef}
            type="edit"
            submitFormPopup={handleSubmitFormPopup}
            handleReloadSingleData={handleReloadSingleData}
          />
          {runsOpen && (
            <AddPeoplePopup
              open={runsOpen}
              close={() => setRunsOpen(false)}
              runzId={runzId}
              runzRow={runzRow}
              typePopup={typePopup}
            />
          )}
        </>
      )}
    </PrivateRoute>
  );
}
