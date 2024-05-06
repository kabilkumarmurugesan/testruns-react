/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import TablePagination from "../../../components/table/TablePagination";
import { Box, Chip, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { fetchRunsData } from "../../../api/RunsAPI";
import { HistoryHeaders, HistoryRows } from "../../../utils/data";
import TableHeader from "../../../components/table/TableHeader";
import TablePopup from "../../../components/table/TablePopup";
import { fetchRunsByProcedure } from "../../../api/assetsAPI";
import TableSkeleton from "../../../components/table/TableSkeleton";
import Emptystate from "../../../assets/images/Emptystate.svg";
// import RunsForm from './RunsForm';

// table start

const rows = HistoryRows;

export default function HistoryTable({ procedureId }: any) {
  const [headers, setHeaders] = React.useState<any>(HistoryHeaders);
  const [currentPage, setCurrentPage] = React.useState(1);
  const tablePopupRef: any = React.useRef(null);

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [loader, setLoader] = React.useState(false);
  const [runzData, setRunzData] = React.useState<any>([]);
  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);
  const RunsSliceData = useSelector(
    (state: any) => state.runs.data?.get_all_runs
  );
  const singleUserData = useSelector(
    (state: any) => state.user?.data?.get_user
  );
  const dispatch: any = useDispatch();
  React.useEffect(() => {
    setRunzData(runzData);
  }, [runzData]);

  const [pageInfo, setPageInfo] = React.useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [pagesInfo, setPagesInfo] = React.useState<any>({});
  const [queryStrings, setQueryString] = React.useState<any>({
    page: 1,
    perPage: 5,
    searchBy: null,
    search: null,
    sortBy: null,
    sortOrder: "desc",
  });
  const filters = () => {
    dispatch(fetchRunsData(queryStrings));
  };
  const handleRequestSort = () => {};

  React.useEffect(() => {
    let payload: any = {
      procedureId: procedureId,
      page: queryStrings.page,
      perPage: queryStrings.perPage,
      searchBy: queryStrings.searchBy,
      search: queryStrings.search,
      sortBy: queryStrings.sortBy,
      sortOrder: queryStrings.sortOrder,
    };
    if (procedureId.length !== 0) {
      payload["procedureId"] = procedureId;

      setLoader(true);
      dispatch(fetchRunsByProcedure(payload))
        .then((res: any) => {
          setRunzData(res?.get_all_runs_by_procedure?.Runs);
          setPageInfo(res?.get_all_runs_by_procedure?.pageInfo);
          setLoader(false);
        })
        .catch((err: any) => {
          console.error(err);
          setLoader(false);
        });
    }
  }, [pageInfo, queryStrings]);

  React.useEffect(() => {
    const page: any = { ...pageInfo };
    page["currentPage"] = pagesInfo?.currentPage;
    page["totalPages"] = pagesInfo?.totalPages;
    page["hasNextPage"] = pagesInfo?.hasNextPage;
    page["hasPreviousPage"] = pagesInfo?.hasPreviousPage;
    page["totalCount"] = pagesInfo?.totalCount;
    setRunzData(runzData?.Runs);
    setPageInfo(page);
  }, [pagesInfo]);

  React.useEffect(() => {
    // if(loginUserSliceData?.verifyToken?.role[0]?.name=="Requester"){
    //   setQueryString({...queryStrings,["assignedTo"]:loginUserSliceData?.verifyToken?._id,["assignedBy"]:loginUserSliceData?.verifyToken?._id,["userId"]:loginUserSliceData?.verifyToken?._id})
    // }
    // if(loginUserSliceData?.verifyToken?.role[0]?.name=="Tester"){
    //   setQueryString({...queryStrings,["userId"]:loginUserSliceData?.verifyToken?._id})
    // }
    // if(loginUserSliceData?.verifyToken?.role[0]?.name=="Admin"){
    //   setQueryString({...queryStrings,["organisationId"]:singleUserData?.organisationId})
    // }

    return () => {
      const headersList: any = [...headers];
      headersList.map((item: any) => {
        return (item.sort = "asc");
      });
      setHeaders(headersList);
    };
  }, []);

  const handlePageChange = (even: any, page_no: number) => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    payload["page"] = page_no;
    page["currentPage"] = page_no;
    setPageInfo(page);
    setQueryString(payload);
    setCurrentPage(page_no);
  };

  const handleTableSorting = (_event: any, _data: any, _index: any) => {
    const payload: any = { ...queryStrings };
    const headersList: any = [...headers];
    payload["sortBy"] = headersList[_index].id;
    payload["sortOrder"] = headersList[_index].sort === "asc" ? "desc" : "asc";
    headersList[_index].sort =
      headersList[_index].sort === "asc" ? "desc" : "asc";
    setHeaders(headersList);
    setQueryString(payload);
  };
  const filteredData = headers.filter((item: any) => item.is_show !== false);

  return (
    <Box className="runz-page" sx={{ padding: "24px 0px" }}>
      <Box className="table-outer" sx={{ width: "100%" }}>
        <TableContainer className="tableHeight3">
          <Table
            sx={{ minWidth: 500, position: "relative" }}
            aria-labelledby="tableTitle"
            stickyHeader
          >
            <TableHeader
              numSelected={0}
              onRequestSort={handleRequestSort}
              onSelectAllClick={function (
                event: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
              order={"asc"}
              orderBy={""}
              rowCount={0}
              columns={headers}
              filters={filters}
              handleTableSorting={handleTableSorting}
            />
            {loader ? (
              <TableBody>
                <TableSkeleton columns={filteredData} image={false} rows={5} />
              </TableBody>
            ) : !runzData || (runzData?.length === 0 && !loader) ? (
              <TableBody>
                <Box
                  sx={{
                    textAlign: "center",
                    position: "absolute",
                    left: "0rem",
                    right: "0rem",
                    padding: "5%",
                    width: "100%",
                  }}
                >
                  <img src={Emptystate} alt="" />
                  <Typography className="no-remainder">
                    Runs not found.
                  </Typography>
                </Box>
                {/* </p> */}
              </TableBody>
            ) : (
              <TableBody>
                {runzData?.map((row: any, index: number) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >
                      {headers[0].is_show && (
                        <TableCell scope="row">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box>
                              <Box>{row.runNumber}</Box>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      {headers[1].is_show && (
                        // <TableCell>{row.objective}</TableCell>

                        <TableCell align="center">{row.objective}</TableCell>
                      )}
                      {headers[2].is_show && (
                        <TableCell>
                          {row.departmentId[0] !== null ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <>
                                <Chip
                                  key={index}
                                  label={row.departmentId[0].name}
                                  sx={{
                                    m: 0.5,
                                    padding: "0px 3px",
                                  }}
                                />
                                {row.departmentId.length > 1 && (
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: "#9F9F9F",
                                      fontSize: "12px",
                                      whiteSpace: "nowrap",
                                    }}
                                    onClick={(_event) => {
                                      _event.preventDefault();
                                      _event.stopPropagation();
                                      tablePopupRef.current.open(
                                        true,
                                        "departments",
                                        row.departmentId
                                      );
                                    }}
                                  >
                                    +{row.departmentId.length - 1} More
                                  </span>
                                )}
                              </>
                            </Box>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      )}

                      {headers[3].is_show && (
                        <TableCell>
                          {row.laboratoryId[0] !== null ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <>
                                <Chip
                                  key={index}
                                  label={row.laboratoryId[0].name}
                                  sx={{
                                    m: 0.5,
                                    padding: "0px 3px",
                                  }}
                                />
                                {row.laboratoryId.length > 1 && (
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: "#9F9F9F",
                                      fontSize: "12px",
                                      whiteSpace: "nowrap",
                                    }}
                                    onClick={(_event) => {
                                      _event.preventDefault();
                                      _event.stopPropagation();
                                      tablePopupRef.current.open(
                                        true,
                                        "lab",
                                        row.laboratoryId
                                      );
                                    }}
                                  >
                                    +{row.laboratoryId.length - 1} More
                                  </span>
                                )}
                              </>
                            </Box>
                          ) : (
                            <span style={{ textAlign: "center" }}>-</span>
                          )}
                        </TableCell>
                      )}
                      {headers[4].is_show && (
                        <TableCell align="center">{row.dueDate}</TableCell>
                      )}
                      {/* {headers[5].is_show && (
                        <TableCell align="center">{row.dueDate}</TableCell>
                        // <TableCell align="center">{row.userId}</TableCell>
                      )} */}
                      {headers[5].is_show && (
                        <TableCell align="center">
                          {row?.assignedTo?.firstName}
                        </TableCell>
                      )}
                      {headers[6].is_show && (
                        <TableCell>
                          {/* <FormControl className="Status-info" style={{ marginTop: '7px'}}> */}
                          <Box
                            style={{
                              borderRadius: "20px",
                              color: "white",
                              width: "110px",
                              padding: "9px 0px",
                              alignItems: "center",
                              textAlign: "center",
                              height: "24px",
                              display: "flex",
                              justifyContent: "center",
                              fontSize: "12px",
                              backgroundColor:
                                row?.status === "Created"
                                  ? "#8d8d8d"
                                  : row?.status === "Started"
                                  ? "#faaa49"
                                  : row?.status === "Completed"
                                  ? "#00bf70"
                                  : row?.status === "Submitted"
                                  ? "#a01fb1"
                                  : "#e2445c",
                            }}
                          >
                            {row?.status === "Created"
                              ? "Created"
                              : row?.status === "Started"
                              ? "Started"
                              : row?.status === "Completed"
                              ? "Completed"
                              : row?.status === "Submitted"
                              ? "Submitted"
                              : "Stopped"}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {!runzData ||
          (runzData?.length === 0 && !loader && (
            <TablePagination
              currentPage={currentPage}
              perPage={queryStrings.perPage}
              handlePageChange={handlePageChange}
              currentPageNumber={queryStrings.page}
              totalRecords={runzData?.length}
              page={pageInfo}
            />
          ))}
      </Box>
      <TablePopup ref={tablePopupRef} />
    </Box>
  );
}
