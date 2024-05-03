import { gql } from '@apollo/client';

export const GET_ALL_NOTIFICATION = gql`
query Get_all_notifications {
    get_all_notifications {
        _id
        uid
        #title
        userId
        isActive
        isDeleted
        createProcedure {
            email
            notification
        }
        runsCommend {
            email
            notification
        }
        runAssiged {
            email
            notification
        }
    }
}
`; 
export const GET_SINGLE_NOTIFICATION = gql`
query Get_notification($userId: String) {
    get_notification(userId: $userId) {
        _id
        uid
        userId
        isActive
        isDeleted
        createProcedure {
            email
            notification
        }
        runsCommend {
            email
            notification
        }
        runAssiged {
            email
            notification
        }
    }
}
`
export const UPDATE_NOTIFICATION = gql`

mutation Update_notification(
  $_id: String!
        $createProcedure: [NotificationMethodInput]
        $runsCommend: [NotificationMethodInput]
        $runAssiged: [NotificationMethodInput]  
) {
    update_notification(
        _id: $_id
        createProcedure: $createProcedure
        runsCommend: $runsCommend
        runAssiged: $runAssiged
    ) {
        _id
        uid
        userId
        isActive
        isDeleted
    }
}
`

gql`
input NotificationMethodInput{
  email: Boolean
  notification: Boolean
}
`
