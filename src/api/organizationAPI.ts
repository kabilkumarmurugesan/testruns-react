import {
  fetchOrganizationStart,
  fetchOrganizationFailure,
  fetchOrganizationSuccess,
} from '../features/organizationSlice';
import { GET_ORGANIZATION } from '../graphql/organization/organization.js';
import { GraphqlInstance } from '../utils/config';

export const fetchOrganizationData = () => async (dispatch: any) => {
  dispatch(fetchOrganizationStart());
  try {
    const response: any = await GraphqlInstance.query(GET_ORGANIZATION, {});
    dispatch(fetchOrganizationSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchOrganizationFailure(error.message));
  }
};

export const fetchOrganizationById =
  (payload: any) => async (dispatch: any) => {
    dispatch(fetchOrganizationStart());
    try {
      const response: any = await GraphqlInstance.query(
        GET_ORGANIZATION,
        payload,
      );
      dispatch(fetchOrganizationSuccess(response.data));
      return response.data;
    } catch (error: any) {
      dispatch(fetchOrganizationFailure(error.message));
    }
  };
