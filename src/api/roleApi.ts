import {
  fetchRoleStart,
  fetchRoleSuccess,
  fetchRoleFailure,
} from "../features/roleSlice";
import { FIND_ROLE, UPDATE_FIND_ROLE } from "../graphql/role/role.js";
import { GraphqlInstance } from "../utils/config";

export const fetchRoleData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRoleStart());
  try {
    const response: any = await GraphqlInstance.query(FIND_ROLE, payload);

    dispatch(fetchRoleSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchRoleFailure(error.message));
  }
};
export const fetchSingleRoleData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRoleStart());
  try {
    const response: any = await GraphqlInstance.query(FIND_ROLE, payload);
    dispatch(fetchRoleSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchRoleFailure(error.message));
  }
};

export const fetchUpdateRoleData = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      UPDATE_FIND_ROLE,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
    return error;
  }
};
