import {
  fetchinstitutionStart,
  fetchinstitutionSuccess,
  fetchinstitutionFailure,
} from '../features/institutionSlice';
import { GET_ALL_INSTITUTIONS } from '../graphql/institution/institution.js';
import { GraphqlInstance } from '../utils/config';

export const fetchinstitutionData = () => async (dispatch: any) => {
  dispatch(fetchinstitutionStart());
  try {
    const response: any = await GraphqlInstance.query(GET_ALL_INSTITUTIONS, {});
    dispatch(fetchinstitutionSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchinstitutionFailure(error.message));
  }
};
