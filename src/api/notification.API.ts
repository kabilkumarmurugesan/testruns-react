import {
  fetchNotificationStart,
  fetchNotificationSuccess,
  fetchNotificationFailure,
} from '../features/notificationSlice';
import {
  GET_ALL_NOTIFICATION,
  GET_SINGLE_NOTIFICATION,
  UPDATE_NOTIFICATION,
} from '../graphql/notification/notification.js';
import { GraphqlInstance } from '../utils/config';

export const fetchNotificationData = () => async (dispatch: any) => {
  dispatch(fetchNotificationStart());
  try {
    const response: any = await GraphqlInstance.query(GET_ALL_NOTIFICATION, {});
    dispatch(fetchNotificationSuccess(response.data));
  } catch (error: any) {
    console.error(error);
    dispatch(fetchNotificationFailure(error.message));
  }
};

export const fetchUserNotificationData =
  (payload: any) => async (dispatch: any) => {
    // dispatch(fetchNotificationStart());
    try {
      const response: any = await GraphqlInstance.query(
        GET_SINGLE_NOTIFICATION,
        payload,
      );
      return response.data;
      // dispatch(fetchNotificationSuccess(response.data));
    } catch (error: any) {
      console.error(error);
      // dispatch(fetchNotificationFailure(error.message));
    }
  };
export const fetchUpdateNotification = (payload: any) => async () => {
  try {
    const response: any = await GraphqlInstance.mutation(
      UPDATE_NOTIFICATION,
      payload,
    );
    return response;
  } catch (error: any) {
    console.error(error);
  }
};
