import { gql } from '@apollo/client';

export const GET_LABS = gql`
  query Get_all_labs($departmentId :[String]) {
    get_all_labs(departmentId: $departmentId) {
        _id
        name
        organisationID
        status
        departmentId
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;