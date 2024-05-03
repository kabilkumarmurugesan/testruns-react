import {
  fetchRunsStart,
  fetchRunsSuccess,
  fetchRunsFailure,
  fetchChartTableStart,
  fetchChartTableSuccess,
  fetchChartTableFailure,
} from '../features/runsSlice';
import {
  GET_RUNS,
  POST_RUNS,
  DELETE_RUNS,
  GET_SINGLE_RUNS,
  UPDATE_RUNS,
  GET_CHART_TABLE,
} from '../graphql/runs/runs.js';
import { GraphqlInstance } from '../utils/config';

export const fetchRunsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRunsStart());
  try {
    const response: any = await GraphqlInstance.query(GET_RUNS, payload);
    dispatch(fetchRunsSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchRunsFailure(error.message));
  }
};

export const postRunsData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(POST_RUNS, payload);
    return response;
  } catch (error: any) {
    console.error(error);
  }
};
export const deleteRunsData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(DELETE_RUNS, payload);
    return response;
  } catch (error: any) {
    console.error(error);
  }
};
export const fetchSingleRunsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRunsStart());
  try {
    const response: any = await GraphqlInstance.query(GET_SINGLE_RUNS, payload);
    dispatch(fetchRunsSuccess(response.data));
    return response
  } catch (error: any) {
    dispatch(fetchRunsFailure(error.message));
  }
};

export const fetchUpdateRunsData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(UPDATE_RUNS, payload);
    return response;
  } catch (error: any) {
    console.error(error);
  }
};

export const fetchTableChartData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchChartTableStart());
  try {
    const response: any = await GraphqlInstance.query(GET_CHART_TABLE, payload);
    dispatch(fetchChartTableSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchChartTableFailure(error.message));
  }
};
