import {
  fetchRunsStart,
  fetchRunsSuccess,
  fetchRunsFailure,
  fetchCalendarEventStart,
  fetchCalendarEventSuccess,
  fetchCalendarEventFailure,
} from '../features/myPageSlice';
import { GET_RUNS } from '../graphql/runs/runs.js';
import { CALENDER_DATA } from '../graphql/myPage/myPage.js';
import { GraphqlInstance } from '../utils/config';

export const fetchMyPageRunsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRunsStart());
  try {
    const response: any = await GraphqlInstance.query(GET_RUNS, payload);
    dispatch(fetchRunsSuccess(response));
    return response;
  } catch (error: any) {
    dispatch(fetchRunsFailure(error.message));
  }
};

export const fetchCalendarEventData =
  (payload: any) => async (dispatch: any) => {
    dispatch(fetchCalendarEventStart());
    try {
      const response: any = await GraphqlInstance.query(CALENDER_DATA, payload);
      dispatch(fetchCalendarEventSuccess(response.data));
      return response;
    } catch (error: any) {
      dispatch(fetchCalendarEventFailure(error.message));
    }
  };
