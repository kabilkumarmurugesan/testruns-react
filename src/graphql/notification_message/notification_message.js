import { gql } from '@apollo/client';

export const GET_NOTIFICATION_MESSAGE = gql`
query Get_notification_message( $userId: String!
$_id: String
$page: Int
$perPage: Int) {
    get_notification_message( userId: $userId
 _id: $_id
page:$page
perPage:$perPage  ){
        message {
            _id
            title
            userId
            message
            isRead
            notificationRuleId
            isActive
            isDeleted
            createdAt
        }
    }
}`

export const READ_SINGLE_NOTIFICATION_MESSAGE = gql`

mutation Update_single_notification(
    $_id: String!
    $isRead: Boolean!
) {
    update_single_notification(_id: $_id, isRead: $isRead)
}`

export const READ_BULK_NOTIFICATION_MESSAGE = gql`

mutation update_notification_message(
    $userId: String!
    $isRead: Boolean!
) {
    update_notification_message(userId: $userId, isRead: $isRead)
}`

