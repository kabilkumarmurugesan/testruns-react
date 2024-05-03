import { toast } from 'react-toastify';
import {
  fetchAssetsStart,
  fetchAssetsSuccess,
  fetchAssetsFailure,
} from '../features/assetsSlice';
import {
  GET_ASSETS_NAMES,
  GET_ASSETS,
  POST_ASSETS,
  DELETE_ASSETS,
  GET_SINGLE_ASSETS,
  UPDATE_ASSETS,
  GET_PROCEDURE_ASSETS,
  GET_ALL_RUNS_PROCEDURE,
} from '../graphql/assets/assets.js';
import { GraphqlInstance } from '../utils/config';

export const fetchAssetsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchAssetsStart());
  try {
    const response: any = await GraphqlInstance.query(GET_ASSETS, payload);
    dispatch(fetchAssetsSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchAssetsFailure(error.message));
  }
};

export const postAssetsData = (payload: any) => async (dispatch: any) => {
  try {
    const response: any = await GraphqlInstance.mutation(POST_ASSETS, payload);
    const q: any = { page: 1, perPage: 10, sortOrder: 'desc' };
    dispatch(fetchAssetsData(q));
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const deleteAssetsData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      DELETE_ASSETS,
      payload,
    );
    let res = response.data ? response.data : response;
    return res;
  } catch (error: any) {
    toast(error.message, {
      style: {
        background: '#d92828',
        color: '#fff',
      },
    });
    return error;
  }
};

export const fetchSingleAssetsData =
  (payload: any) => async (dispatch: any) => {
    dispatch(fetchAssetsStart());
    try {
      const response: any = await GraphqlInstance.query(
        GET_SINGLE_ASSETS,
        payload,
      );
      dispatch(fetchAssetsSuccess(response.data));
    } catch (error: any) {
      dispatch(fetchAssetsFailure(error.message));
    }
  };

export const fetchUpdateAssetsData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      UPDATE_ASSETS,
      payload,
    );
    return response;
  } catch (error: any) {
    console.error(error);
  }
};

export const fetchAssetsName = (payload: any) => async (dispatch: any) => {
  dispatch(fetchAssetsStart());
  try {
    const response: any = await GraphqlInstance.query(
      GET_ASSETS_NAMES,
      payload,
    );
    dispatch(fetchAssetsSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchAssetsFailure(error.message));
  }
};

export const fetchProcedureByAssetsName =
  (payload: any) => async (dispatch: any) => {
    dispatch(fetchAssetsStart());
    try {
      const response: any = await GraphqlInstance.query(
        GET_PROCEDURE_ASSETS,
        payload,
      );
      dispatch(fetchAssetsSuccess(response.data));
      return response.data;
    } catch (error: any) {
      dispatch(fetchAssetsFailure(error.message));
    }
  };

export const fetchRunsByProcedure = (payload: any) => async (dispatch: any) => {
  // dispatch(fetchAssetsStart());
  try {
    const response: any = await GraphqlInstance.query(
      GET_ALL_RUNS_PROCEDURE,
      payload,
    );
    // dispatch(fetchAssetsSuccess(response.data));
    return response.data;
  } catch (error: any) {
    console.error(error);
    // dispatch(fetchAssetsFailure(error.message));
  }
};
