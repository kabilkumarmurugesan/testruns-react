import {
  fetchLabStart,
  fetchLabFailure,
  fetchLabSuccess,
} from '../features/labSlice';
import { GET_LABS } from '../graphql/lab/lab.js';
import { GraphqlInstance } from '../utils/config';

export const fetchLabData = () => async (dispatch: any) => {
  dispatch(fetchLabStart());
  try {
    const response: any = await GraphqlInstance.query(GET_LABS, {});
    dispatch(fetchLabSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchLabFailure(error.message));
  }
};

export const fetchLabById = (payload: any) => async (dispatch: any) => {
  dispatch(fetchLabStart());
  try {
    const response: any = await GraphqlInstance.query(GET_LABS, payload);
    dispatch(fetchLabSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchLabFailure(error.message));
  }
};
