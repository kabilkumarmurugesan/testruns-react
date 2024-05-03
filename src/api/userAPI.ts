import {
  GET_USER,
  POST_USER,
  DELETE_USER,
  UPDATE_USER,
  GET_SINGLE_USER,
  LOGIN_USER,
  GET_USER_DATA,
  GET_SHARED_USER_DATA
} from '../graphql/users/users.js';
import {
  fetchUserFailure,
  fetchUserStart,
  fetchUserSuccess,
} from '../features/userSlice';
import {
  fetchLoginUserFailure,
  fetchLoginUserStart,
  fetchLoginUserSuccess,
} from '../features/loginUserSlice';
import {
  fetchuserDataStart,
  fetchuserDataFailure,
  fetchuserDataSuccess,
} from '../features/userDataSlice';
import { GraphqlInstance } from '../utils/config';

export const fetchUserData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchuserDataStart());
  try {
    const response: any = await GraphqlInstance.query(GET_USER, payload);
    dispatch(fetchuserDataSuccess(response.data));
    return response.data
  } catch (error: any) {
    dispatch(fetchuserDataFailure(error.message));
  }
};
export const postUserData = (payload: any) => async (dispatch: any) => {
  try {
    const response: any = await GraphqlInstance.mutation(POST_USER, payload);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const deleteUserData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(DELETE_USER, payload);
    return response;
  } catch (error: any) {
    console.error(error);
  }
};
export const fetchSingleUserData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchUserStart());
  try {
    const response: any = await GraphqlInstance.query(GET_SINGLE_USER, payload);
    dispatch(fetchUserSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchUserFailure(error.message));
    return error;
  }
};

export const fetchUpdateUserData = (payload: any) => async (dispatch: any) => {
  try {
    const response: any = await GraphqlInstance.mutation(UPDATE_USER, payload);
    return response;
  } catch (error: any) {
    console.error(error);
  }
};

export const fetchGetUser = (payload: any) => async (dispatch: any) => {
  dispatch(fetchUserStart());
  try {
    const response: any = await GraphqlInstance.query(GET_USER, payload);
    dispatch(fetchUserSuccess(response));
  } catch (error: any) {
    dispatch(fetchUserFailure(error.message));
  }
};

export const fetchLoginUser = (payload: any) => async (dispatch: any) => {
  dispatch(fetchLoginUserStart());
  try {
    const response: any = await GraphqlInstance.mutation(LOGIN_USER, payload);
    dispatch(fetchLoginUserSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchLoginUserFailure(error.message));
  }
};

export const fetchAllUser = (payload: any) => async (dispatch: any) => {
  dispatch(fetchUserStart());
  try {
    const response: any = await GraphqlInstance.query(GET_USER_DATA, payload);
    dispatch(fetchUserSuccess(response));
    return response.data;
  } catch (error: any) {
    dispatch(fetchUserFailure(error.message));
  }
};

export const fetchSharedUser = (payload: any) => async (dispatch: any) => {
  // dispatch(fetchUserStart());
  try {
    const response: any = await GraphqlInstance.query(GET_SHARED_USER_DATA, payload);
    // dispatch(fetchUserSuccess(response));
    return response.data;
  } catch (error: any) {
    // dispatch(fetchUserFailure(error.message));
  }
};
