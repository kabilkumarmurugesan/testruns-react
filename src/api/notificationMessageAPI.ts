import {
  fetchNotificationMessageFailure,
  fetchNotificationMessageStart,
  fetchNotificationMessageSuccess,
} from '../features/notificationMessageSlice';
import {
  GET_NOTIFICATION_MESSAGE,
  READ_SINGLE_NOTIFICATION_MESSAGE,
  READ_BULK_NOTIFICATION_MESSAGE,
} from '../graphql/notification_message/notification_message.js';
import { GraphqlInstance } from '../utils/config';

export const fetchNotificationMessageData =
  (payload: any) => async (dispatch: any) => {
    dispatch(fetchNotificationMessageStart());
    try {
      const response: any = await GraphqlInstance.query(
        GET_NOTIFICATION_MESSAGE,
        payload,
      );
      dispatch(fetchNotificationMessageSuccess(response.data));

      return response;
    } catch (error: any) {
      dispatch(fetchNotificationMessageFailure(error.message));
    }
  };

export const fetchReadSingleMessageData =
  (payload: any) => async (dispatch: any) => {
    try {
      const response: any = await GraphqlInstance.mutation(
        READ_SINGLE_NOTIFICATION_MESSAGE,
        payload,
      );

      return response;
    } catch (error: any) {
      console.error(error);
    }
  };
export const fetchReadBulkMessageData =
  (payload: any) => async (dispatch: any) => {
    try {
      const response: any = await GraphqlInstance.mutation(
        READ_BULK_NOTIFICATION_MESSAGE,
        payload,
      );

      return response;
    } catch (error: any) {
      console.error(error);
    }
  };
