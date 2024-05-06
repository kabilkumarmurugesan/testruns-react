/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, Suspense } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssetsName } from "../../api/assetsAPI";
import { InfluxDB } from "@influxdata/influxdb-client";
import { toast } from "react-toastify";
import SpinerLoader from "../SpinnerLoader";
import io from "socket.io-client";
import ApexCharts from "apexcharts";
// import ReactApexChart from "react-apexcharts";

const url: any = process.env.REACT_APP_INFLUX_DB_URL;
const token = process.env.REACT_APP_REALTIME_TOKEN;
const org: any = process.env.REACT_APP_INFLUX_DB_ORG;
// const bucket = 'Pasco Codenode';
const bucket = process.env.REACT_APP_BUCKET_NAME;

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
const ReactApexChart = React.lazy(() => import("react-apexcharts"));
export default function RealtimeChart({
  handleDateChartRetrieve,
  savedConnectData,
  startDate,
  endDate,
  usedAsset,
  isPause,
  getsetUsedAsset,
}: any) {
  var emptyData: any = null;
  const [assets, setAssets] = React.useState(
    savedConnectData === null ? null : savedConnectData.assets
  );
  const [colorsList, setColorsList] = React.useState<any>([
    "#e22828",
    "#90239f",
    "#111fdf",
    "#38e907",
    "#7f6c8e",
    "#532625",
    "#d3b15a",
    "#f931d2",
    "#0982d9",
    "#c6fd2f",
  ]);

  const [assetsOptions, setAssetsOptions] = React.useState<any>([]);
  const [measure, setMeasure] = React.useState<any>("Codenode1_connect");
  const [isChartPause, setIsChartPause] = React.useState<any>(isPause);
  const dispatch: any = useDispatch();
  const [channelOptions, setChannelOptions] = React.useState<any>([]);
  const [channelTemp, setChannelTemp] = React.useState<any>([]);
  const [chartData, setChartData] = React.useState<any>({
    datasets: [],
  });

  const [chartDatas, setChartDatas] = React.useState<any>({});

  const [yAxisList, setYAxisList] = useState([]);

  const [realTimeData, setRealTimeData] = React.useState<any>([]);
  const [selectedcolor, setSelectedcolor] = React.useState<any>([]);
  const [selectedcolorIndex, setSelectedcolorIndex] = React.useState<any>([]);
  const [series, setSeries] = React.useState<any>([]);
  const [realTimeSeries, setRealTimeSeries] = React.useState<any>([]);
  const [realTimeSeriesList, setRealTimeSeriesList] = React.useState<any>({});
  const [isSets, setIsSets] = React.useState(false);
  const [showArchivedChart, setShowArchivedChart] = React.useState<any>(false);
  let interval: any = 0;

  const [socket, setSocket] = React.useState<any>(null);

  const [channelList, setChannelList] = React.useState<any>([
    {
      sensor: null,
      axis: "Y1",
      color: colorsList[0],
    },
  ]);
  var RealTimeOptions: any = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    chart: {
      id: "realtime",
      height: 350,
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: selectedcolor,
    stroke: {
      colors: selectedcolor,
      curve: "straight",
      width: 3,
    },

    xaxis: {
      type: "datetime",
      range: 1000 * 10,
    },
    yaxis: yAxisList,

    legend: {
      show: false,
    },
  };

  const optionsapex: any = {
    chart: {
      id: "chart2",
      type: "line",
      height: 230,
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
    },

    colors: colorsList,
    stroke: {
      colors: colorsList,
      curve: "straight",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      yaxis: yAxisList,
    },
  };

  const optionsLine: any = {
    chart: {
      id: "chart1",
      height: 130,
      type: "area",
      brush: {
        target: "chart2",
        enabled: true,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date(startDate).getTime(),
          max: new Date(endDate).getTime(),
        },
      },
    },
    colors: colorsList,
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  const axisList: any = [
    {
      name: "Y1",
      value: "Y1",
    },
    {
      name: "Y2",
      value: "Y2",
    },
    {
      name: "Y3",
      value: "Y3",
    },
    {
      name: "Y4",
      value: "Y4",
    },
  ];

  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);

  const procedureSliceData = useSelector((state: any) => state.runs.data);

  const assetsSliceData = procedureSliceData?.get_run?.procedureId.assetId;

  const Placeholder = ({ children }: any) => {
    return <div style={{ color: "lightgrey" }}>{children}</div>;
  };

  useEffect(() => {
    const payload: any = {};
    payload["organisationId"] = loginUserSliceData?.verifyToken.organisationId;
    dispatch(fetchAssetsName(payload));
  }, [loginUserSliceData]);

  useEffect(() => {
    setIsChartPause(isPause);
  }, [isPause]);

  useEffect(() => {
    if (endDate && endDate !== null && assets && assets !== null) {
      setShowArchivedChart(true);
      setIsChartPause(true);
      getTimeRangeData();
      clearInterval(interval);
    }
  }, [endDate, isSets]);

  useEffect(() => {
    if (assetsSliceData) {
      const assetsFilterData: any = assetsSliceData.filter((item: any) =>
        item.name.includes("_connect")
      );
      setAssetsOptions(assetsFilterData);

      if (usedAsset !== null) {
        const temp = assetsSliceData.filter(
          (item: any) => item._id === usedAsset
        );
        const atemp = temp.length > 0 ? temp[0].name : null;
        handleAssetsChange({ target: { value: atemp } });
      }
    }
  }, [assetsSliceData, usedAsset]);

  const getTimeRangeData = async () => {
    try {
      const selectedChannel: any = [];
      channelOptions.forEach((element: any) => {
        selectedChannel.push(element.name);
      });
      const fields = selectedChannel
        .map((item: any) => `r._field == "${item}"`)
        .join(" or ");
      const stemp: any = moment(startDate);
      const etemp: any = moment(endDate);
      const query2: any = `from(bucket: "${bucket}")
        |> range(start: ${stemp.toISOString()}, stop: ${etemp.toISOString()})
        |> filter(fn: (r) => r["_measurement"] == "${measure}" and ${fields})
        |> yield(name: "mean")`;

      const channels = [...channelList];
      const seriesData: any = {};
      const seriesList: any = [];
      const channelSeriesList: any = [];
      selectedChannel.forEach((channal: any, index: number) => {
        const dataObj: any = { [`${channal}`]: [] };
        Object.assign(seriesData, dataObj);

        channelSeriesList.push({
          color: colorsList[index],
          sensor: channal,
          axis: axisList[index].name,
        });
      });
      const result = await queryApi.collectRows(query2);
      result.forEach((dataset: any) => {
        selectedChannel.forEach((channal: any, index: number) => {
          if (
            dataset._value !== undefined &&
            dataset._value !== null &&
            channal === dataset._field
          ) {
            channelSeriesList[index].sensor = channal;
            seriesData[`${dataset._field}`].push([
              new Date(dataset._time).getTime(),
              dataset._value.toFixed(2),
            ]);
          }
        });
      });

      Object.entries(seriesData).forEach(([key, value]) => {
        seriesList.push({
          name: key,
          data: value,
        });
      });

      setSeries(seriesList);
      setChannelList(channelSeriesList);
    } catch (error) {
      setShowArchivedChart(false);
      toast(`Invalid: Compilation failed!`, {
        style: {
          background: "#e2445c",
          color: "#fff",
        },
      });
    }
  };

  const streamData = (socket: any) => {
    const chart: any = { ...chartData };

    const channels = [...channelList];
    const seriesData: any = realTimeSeriesList;
    const RealTimeData: any = [...realTimeData];
    const seriesList: any = [];

    // Connect to the Socket.IO server

    socket.emit("joinRoom", measure);

    socket.emit("sendMessageToRoom", {
      room: measure,
      message: channelTemp?.toString(),
    });
    const newData: any = {};
    // Example: Listen for messages from the server
    socket.on("message", (data: any) => {
      // setMessages(data);

      channelTemp.forEach((channal: any, index: number) => {
        data.forEach((dataset: any) => {
          const sets = chart.datasets[index];
          const series = dataset._field || dataset._measurement;
          if (!(series in newData)) {
            newData[series] = [];
          }
          const yValue = parseFloat(dataset._value).toFixed(2);
          newData[series].push({
            x: new Date(dataset._time).getTime(),
            y: parseFloat(yValue),
          });

          if (
            dataset !== undefined &&
            dataset._value !== undefined &&
            dataset._value !== null &&
            channal === dataset._field &&
            seriesData &&
            RealTimeData
          ) {
            RealTimeData.push(dataset._value.toFixed(2));
            RealTimeData.slice(-10);
            // debugger
            seriesData[`${dataset._field}`].push({
              x: new Date(dataset._stop).getTime(),
              y: dataset._value.toFixed(2),
            });
          }
        });
      });
      Object.keys(newData).forEach((series) => {
        // Limiting to 10 data points for each series
        var newDataPoints: any = [...newData[series]];
        // setTimeout(()=>{
        const maxLength = 40;
        newDataPoints = newData[series].slice(-maxLength);

        setChartDatas((prevChartData: any) => ({
          ...prevChartData,
          [series]: newDataPoints,
        }));

        ApexCharts.exec("realtime-chart", "updateSeries", [
          {
            data: chartDatas,
          },
        ]);
      });
    });

    setRealTimeSeriesList(seriesData);
    setRealTimeData(RealTimeData);
    setRealTimeSeries(seriesList); // Update state with the received data
    // Clean up the socket connection when the component unmounts
    return () => {
      // socket.emit("leaveRoom", measure);

      socket.disconnect();
    };
  };

  const clearData = () => {
    setRealTimeSeries((prevData: any) => prevData.slice(-40));
  };

  setInterval(() => {
    clearData();
  }, 1000);

  useEffect(() => {
    var url: any = process.env.REACT_APP_BASE_URL;
    const socket: any = io(url);
    if (channelTemp.length !== 0) {
      ApexCharts.exec(
        "realtime-chart",
        "updateSeries",
        streamData(socket),
        true
      );
    }

    setSocket(socket);
    // streamData(socket)
    return () => {
      socket.emit("leaveRoom", measure);
      socket.disconnect();
    };
  }, [channelTemp]);

  const handleAddChannel = () => {
    const data: any = [...channelList];

    handleAddChannelColor(colorsList[data.length + 1], data.length + 1);
    data.length < 10
      ? data.push({
          color: colorsList[data.length === 4 ? 4 : data.length],
          sensor: null,
          axis: "Y1",
        })
      : toast("Please select add below 10 channels !", {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        });
    setChannelList(data);
  };
  const handleRemoveChannel = () => {
    const data: any = [...channelList];
    const series: any = [...realTimeSeries];
    const temp: any = [...channelTemp];
    let yaxisList: any = [...yAxisList];
    const chartDataValue = chartData;
    const chartDatasValue = chartDatas;
    removeTemp(chartData.datasets.length - 1, null);
    const keyschartDatas = Object.keys(chartDatasValue);
    const lastKeychartDatas: any = keyschartDatas[keyschartDatas.length - 1];
    delete chartDatasValue[lastKeychartDatas];

    data.pop();
    series.pop();
    setChartDatas(chartDatasValue);
    if (channelList[channelList.length - 1].sensor !== null) {
      temp.pop();
      let channelTempIndex = channelTemp.findIndex(
        (i: number) => i === channelList[channelList.length - 1].sensor
      );
      yaxisList.splice(channelTempIndex, 1);
      setYAxisList(yaxisList);
    }
    setChannelList(data);
    setRealTimeSeries(series);
    setChannelTemp(temp);
    let colorValue = [...selectedcolor];
    var unique: any = [];

    colorValue.forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element);
      }
      setSelectedcolor(unique);
    });
    setSelectedOptions((prevSelectedOptions: any) => {
      const updatedSelectedOptions: any = [...prevSelectedOptions];
      updatedSelectedOptions.pop();
      return updatedSelectedOptions;
    });
  };
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  // const checkUsername = ((element:any) => element == Object.keys(dataObj)[0]);
  const handleChannelChange = (event: any, index: any) => {
    const channels = [...channelList];
    var selectValue = [...selectedOptions];
    let yaxisList: any = [...yAxisList];
    const chartDatasValue = chartDatas;
    const realTimeSeries = realTimeSeriesList;
    const prevChannel = channels[index].sensor;
    let colorValue = [...selectedcolor];
    var updatedSelectedOptions: any;
    if (event.target.value !== null) {
      colorValue.push(channels[index].color);
      var unique: any = [];
      colorValue.forEach((element) => {
        if (!unique.includes(element)) {
          unique.push(element);
        }
      });
      const dataObj: any = { [`${event.target.value}`]: [] };
      Object.assign(realTimeSeries, dataObj);
      const selectedValue = event.target.value;
      setSelectedOptions((prevSelectedOptions: any) => {
        updatedSelectedOptions = [...prevSelectedOptions];
        updatedSelectedOptions[index] = selectedValue;
        return updatedSelectedOptions;
      });
      if (channels[index].sensor === null) {
        if (!JSON.stringify(yaxisList).includes(channels[index].axis)) {
          // If Y1 hasn't occurred already, push it into the array
          yaxisList.push({
            opposite:
              channels[index].axis === "Y1" || channels[index].axis === "Y3"
                ? false
                : true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: channels[index].color
            },
            labels: {
              style: {
                // colors: channels[index].color
              },
            },
            title: {
              text: channels[index].axis,
              style: {
                // color: channels[index].color
              },
            },
          });
        }
      }
    } else {
      let channelTempIndex = channelTemp.findIndex(
        (i: number) => i === channelList[index].sensor
      );
      colorValue.splice(channelTempIndex, 1);
      yaxisList.splice(channelTempIndex, 1);
      delete realTimeSeries[`${prevChannel}`];
      colorValue.filter((_, i) => i !== channelTempIndex);
      unique = colorValue;
      const keyschartDatas = Object.keys(chartDatasValue);
      const lastKeychartDatas: any = keyschartDatas[index - 1];
      delete chartDatasValue[lastKeychartDatas];
      setChartDatas(chartDatasValue);
      selectValue.splice(index, 1);
      setSelectedOptions(selectValue);
    }
    channels[index].sensor = event.target.value;
    setYAxisList(yaxisList);
    removeTemp(index, event.target.value);
    setSelectedcolor(unique);
    setSelectedcolorIndex(colorValue);
    setChannelList(channels);
    setRealTimeSeriesList(realTimeSeries);
    setIsChartPause(false);
  };

  const removeTemp = (index: any, value: any) => {
    const data = { ...chartData };
    data.datasets[index] = {
      label: value === null ? `Y${index + 1}` : value,
      fill: false,
      lineTension: 0,
      borderDash: [8, 4],
      data: [],
    };

    const temp: any = [];
    data.datasets.map((item: any) => {
      !["Y1", "Y2", "Y3", "Y4"].includes(item.label) && temp.push(item.label);
    });
    setChannelTemp(temp);
  };
  const handleYAxisChange = (event: any, keyIndex: any) => {
    const channels = [...channelList];
    channels[keyIndex].axis = event.target.value;
    let newYAxis: any = [];
    channelList.map((item: any, index: any) => {
      if (item.sensor !== null) {
        newYAxis.push({
          opposite: item.axis === "Y1" || item.axis === "Y3" ? false : true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          labels: {
            style: {},
          },
          title: {
            text: item.axis,
            style: {},
          },
        });
      }
    });

    function getUniqueListBy(arr: any, key: any) {
      let NAry: any = new Map(
        arr.map((item: any) => [item[key].text, item])
      ).values();

      return [...NAry];
    }

    const arr1: any = getUniqueListBy(newYAxis, "title");

    setYAxisList(arr1);
    setChannelList(channels);
  };

  const handleColorPickerChange = (event: any, key: any) => {
    // debugger
    const channels: any = [...channelList];
    const colors: any = [...colorsList];
    const prevColor: any = channels[key].color;
    channels[key].color = event.target.value;
    const prevColorIndex = colorsList.indexOf(prevColor);
    colors[prevColorIndex] = event.target.value;
    setColorsList(colors);
    setChannelList(channels);
    let colorValue = [...selectedcolor];
    colorValue[selectedcolor.indexOf(prevColor)] = event.target.value;
    setSelectedcolor(colorValue);
    // RealTimeOptions.colors=[event.target.value]
    // RealTimeOptions.stroke.colors=[event.target.value]

    // handleAddChannelColor(event.target.value, key);
  };

  const handleAddChannelColor = (value: string, key: any) => {
    let colorLists = [...colorsList];
    if (colorLists > key) {
      colorLists = [...colorLists, value];
    } else {
      colorLists[key] = value;
    }
    setColorsList(colorLists);
  };
  const resetClearData = () => {
    clearInterval(interval);
    setChannelTemp([]);
    setChannelList([
      {
        sensor: null,
        axis: "Y1",
        color: colorsList[0],
      },
    ]);
    setRealTimeData([]);
    setRealTimeSeries([]);
  };

  const handleAssetsChange = async (event: any) => {
    if (event.target.value !== null) {
      try {
        setMeasure(event.target.value);
        const query2 = `from(bucket: "${bucket}")
    |> range(start: -duration(v: 1s))
    |> filter(fn: (r) => r._measurement == "${event.target.value}")
    |> group(columns: ["_field"]) // Group by fiel  d to get all fields
    |> limit(n: 1) // Limit to 1 row (optional, you can adjust as needed)`;

        const result = await queryApi.collectRows(query2);
        const sensors: any = [];
        const data = { ...chartData };
        // const data2 = { ...chartData2 };
        // let temp = {
        //   name: 'temperature_data',
        // };

        // result.length === 0
        //   ? sensors.push(temp)
        //   : result.forEach((element: any) => {
        //       sensors.push({
        //         name: element._field,
        //       });
        //     });

        result.forEach((element: any) => {
          sensors.push({
            name: element._field,
          });
        });
        endDate && endDate !== null && setIsSets(true);
        setChannelOptions(sensors);
        setAssets(event.target.value);
        const atemp: any = assetsSliceData.filter(
          (item: any) => item.name === event.target.value
        );
        getsetUsedAsset(atemp[0]._id);
        channelList.forEach((item: any, index: any) => {
          data.datasets[index] = {
            label: `Y${index + 1}`,
            backgroundColor: colorsList[index],
            borderColor: colorsList[index],
            fill: false,
            lineTension: 0,
            borderDash: [8, 4],
            data: [],
          };
        });

        // sensors.forEach((item: any, index: any) => {
        //   data2.datasets[index] = {
        //     label: item.name,
        //     backgroundColor: colorsList[index > 3 ? 4 : index],
        //     borderColor: colorsList[index > 3 ? 4 : index],
        //     fill: false,
        //     lineTension: 0,
        //     borderDash: [8, 4],
        //     data: [],
        //   };
        // });
      } catch (error) {
        toast(`Error: Device not found. Please check the connection!`, {
          style: {
            background: "#e2445c",
            color: "#fff",
          },
        });
      }
    } else {
      setAssets(event.target.value);
      resetClearData();
    }
  };

  useEffect(() => {
    return () => {
      let temp = {
        assets,
        chartData,
        channelList,
      };
      handleDateChartRetrieve(temp);
    };
  }, [chartData, assets, channelList]);

  const errorToast = () => {
    toast(`Error: Must be fill the above fields!`, {
      style: {
        background: "#e2445c",
        color: "#fff",
      },
    });
  };
  return (
    <Box>
      <Grid container sx={{ my: 2 }} spacing={2}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={9}
          xl={9}
          style={{ borderRight: "1px solid #e4e5e7" }}
          className="chart-left"
        >
          <Grid container sx={{ px: 4 }}>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Select
                labelId="view-all-label"
                id="time-sec"
                value={assets}
                displayEmpty
                IconComponent={ExpandMoreOutlinedIcon}
                MenuProps={{
                  disableScrollLock: true,
                  marginThreshold: null,
                }}
                onChange={(event) => handleAssetsChange(event)}
                disabled={isSets}
                renderValue={
                  assets !== null
                    ? undefined
                    : () => <Placeholder>Select Assets</Placeholder>
                }
                size="small"
                style={{
                  width: "250px",
                  borderRadius: "10px",
                }}
              >
                {assetsOptions.map((item: any, index: number) => (
                  <MenuItem key={index} value={item.name}>
                    {item.name === null ? "Null" : item.name}
                  </MenuItem>
                ))}
                {assetsOptions.length > 0 ? (
                  <MenuItem key={emptyData} value={emptyData}>
                    -- Clear Data --
                  </MenuItem>
                ) : (
                  <MenuItem>-- No Recored --</MenuItem>
                )}
              </Select>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={3}
              textAlign={"end"}
            ></Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            {showArchivedChart ? (
              <>
                {series.length !== 0 ? (
                  <>
                    <div id="chart-line2">
                      <ReactApexChart
                        options={optionsapex}
                        series={series}
                        type="line"
                        height={480}
                      />
                    </div>
                    <div id="chart-line">
                      <ReactApexChart
                        options={optionsLine}
                        series={series}
                        type="area"
                        height={180}
                      />
                    </div>
                  </>
                ) : (
                  <SpinerLoader isLoader={series.length === 0} />
                )}
              </>
            ) : (
              <Suspense fallback={<div>Loading...</div>}>
                <ReactApexChart
                  options={RealTimeOptions}
                  series={Object.keys(chartDatas).map((series) => ({
                    name: series,
                    data: chartDatas[series],
                  }))}
                  type="line"
                  height={540}
                />
              </Suspense>
            )}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={3}
          xl={3}
          style={{ overflowY: "scroll" }}
          className="chart-right"
        >
          <Grid container alignItems={"center"}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Typography variant="body1" fontWeight={500}>
                Channels
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              textAlign={"end"}
            >
              <Button
                variant="contained"
                className={
                  channelList[0].sensor !== null ? "add-chart" : "remove-chart"
                }
                sx={{ mr: 2 }}
                onClick={() => handleAddChannel()}
                disabled={channelList[0].sensor === null}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                className={
                  channelList?.length < 2 ? "remove-chart" : "add-chart"
                }
                onClick={() => handleRemoveChannel()}
                disabled={channelList?.length < 2}
              >
                <RemoveIcon />
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }} style={{ overflowY: "auto", height: "580px" }}>
            {channelList?.map((element: any, key: number) => (
              <Box key={key}>
                <Grid container>
                  <Grid item xs={12} sm={6} md={3} lg={8} xl={8}>
                    <Box>
                      <Box className="color-chart">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            labelId="view-all-label"
                            size="small"
                            value={element.sensor}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={(event) => {
                              key === 0
                                ? handleChannelChange(event, key)
                                : channelList[key - 1].sensor == null
                                ? errorToast()
                                : handleChannelChange(event, key);
                            }}
                            renderValue={
                              element.sensor !== null
                                ? undefined
                                : () => <Placeholder>Select</Placeholder>
                            }
                            disabled={assets === null || isSets}
                            style={{ width: "90%" }}
                          >
                            {channelOptions.map((item: any, index: number) => (
                              <MenuItem
                                key={index}
                                value={item.name}
                                disabled={selectedOptions.includes(item.name)}
                              >
                                {item.name}
                              </MenuItem>
                            ))}
                            {channelOptions.length > 0 ? (
                              <MenuItem key={emptyData} value={emptyData}>
                                -- Clear Data --
                              </MenuItem>
                            ) : (
                              <MenuItem>-- No Recored --</MenuItem>
                            )}
                          </Select>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={4} xl={4}>
                    <Box>
                      <Box className="color-chart">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            labelId="view-all-label"
                            size="small"
                            value={element.axis}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={(event) => handleYAxisChange(event, key)}
                            disabled={
                              assets === null ||
                              isSets ||
                              element.sensor == null
                            }
                            renderValue={
                              element.axis !== null
                                ? undefined
                                : () => <Placeholder>Axis</Placeholder>
                            }
                            fullWidth
                          >
                            {axisList.map((item: any, index: any) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                        <Box className="color-picker">
                          <input
                            style={{
                              backgroundColor: element.color,
                              color: element.color,
                            }}
                            type="color"
                            className="color-input"
                            value={element.color}
                            onChange={(event) =>
                              handleColorPickerChange(event, key)
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Divider orientation="horizontal" sx={{ py: 0 }} />
    </Box>
  );
}
