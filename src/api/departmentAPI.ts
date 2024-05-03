import {
  fetchDepartmentStart,
  fetchDepartmentSuccess,
  fetchDepartmentFailure,
} from '../features/departmentSlice';
import { GET_DEPARTMENT } from '../graphql/department/department.js';
import { GraphqlInstance } from '../utils/config';

export const fetchDepartmentData = () => async (dispatch: any) => {
  dispatch(fetchDepartmentStart());
  try {
    const response: any = await GraphqlInstance.query(GET_DEPARTMENT, {});
    dispatch(fetchDepartmentSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchDepartmentFailure(error.message));
  }
};

export const fetchDepartmentById = (payload: any) => async (dispatch: any) => {
  dispatch(fetchDepartmentStart());
  try {
    const response: any = await GraphqlInstance.query(GET_DEPARTMENT, payload);
    dispatch(fetchDepartmentSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchDepartmentFailure(error.message));
  }
};
