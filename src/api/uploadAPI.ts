import {
  fileUploadStart,
  fileUploadSuccess,
  fileUploadFailure,
} from '../features/fileUploadSlice';
import { FILE_UPLOAD } from '../graphql/file-upload/file-upload.js';
import { GraphqlInstance } from '../utils/config';

export const fileUploadData = (payload: any) => async (dispatch: any) => {
  dispatch(fileUploadStart());
  try {
    const response: any = await GraphqlInstance.mutation(FILE_UPLOAD, payload);

    dispatch(fileUploadSuccess(response.data));
    return response;
  } catch (error: any) {
    console.error(error);
    dispatch(fileUploadFailure(error));
  }
};
