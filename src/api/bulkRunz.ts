import {
  POST_BULKRUNZ,
  SHARE_RUNZ,
} from '../graphql/bulkRunz/bulkRunz.js';
import { GraphqlInstance } from '../utils/config';

export const fetchbulkRunz = (payload: any) => async () => {
  try {
    const response = await GraphqlInstance.mutation(POST_BULKRUNZ, payload);
    return response;
  } catch (error: any) {
    console.error(error);
  }
};
export const fetchShareRunz = (payload: any) => async () => {
  try {
    const response = await GraphqlInstance.mutation(SHARE_RUNZ, payload);
    return response;
  } catch (error: any) {
    console.error(error);
  }
};
