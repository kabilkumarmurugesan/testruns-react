import {
  POST_USER_RUNS,
  UPDATE_USER_RUNS,
  GET_SINGLE_USER_RUNS,
} from '../graphql/userRuns/userRunz.js';
import { GraphqlInstance } from '../utils/config';

export const postUserRunsData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      POST_USER_RUNS,
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const UpdateUserRunsData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      UPDATE_USER_RUNS,
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const fetchSingleUserRunzData =
  (payload: any) => async (dispatch: any) => {
    // dispatch(fetchUserStart());
    try {
      const response: any = await GraphqlInstance.query(
        GET_SINGLE_USER_RUNS,
        payload,
      );
      return response.data;
      // dispatch(fetchUserSuccess(response.data));
    } catch (error: any) {
      return error;
      // dispatch(fetchUserFailure(error.message));
    }
  };
