import {
  fetchProcedureStart,
  fetchProcedureFailure,
  fetchProcedureSuccess,
} from '../features/procedureSlice';
import {
  POST_PROCEDURE,
  GET_PROCEDURE,
  DELETE_PROCEDURE,
  UPDATE_PROCEDURE,
  GET_SINGLE_PROCEDURE,
  GET_ALL_PROCEDURE_NAME,
} from '../graphql/procedure/procedure.js';
import { GraphqlInstance } from '../utils/config';

export const postProcedureData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      POST_PROCEDURE,
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const fetchProcedureData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchProcedureStart());
  try {
    const response: any = await GraphqlInstance.query(GET_PROCEDURE, payload);

    dispatch(fetchProcedureSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchProcedureFailure(error.message));
  }
};

export const deleteProcedureData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      DELETE_PROCEDURE,
      payload,
    );
  } catch (error: any) {
    console.error(error);
  }
};

export const fetchSingleProcedureData =
  (payload: any) => async (dispatch: any) => {
    dispatch(fetchProcedureStart());
    try {
      const response: any = await GraphqlInstance.query(
        GET_SINGLE_PROCEDURE,
        payload,
      );
      dispatch(fetchProcedureSuccess(response.data));
    } catch (error: any) {
      dispatch(fetchProcedureFailure(error.message));
    }
  };

export const fetchProcedure = (payload: any) => async (dispatch: any) => {
  try {
    const response: any = await GraphqlInstance.query(
      GET_SINGLE_PROCEDURE,
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const fetchUpdateProcedureData = (payload: any) => async () => {
  return await GraphqlInstance.mutation(UPDATE_PROCEDURE, payload);
};
export const fetchProcedureName = () => async (dispatch: any) => {
  try {
    const response: any = await GraphqlInstance.query(
      GET_ALL_PROCEDURE_NAME,
      {},
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};
