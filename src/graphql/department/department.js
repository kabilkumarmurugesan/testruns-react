import { gql } from '@apollo/client';

export const GET_DEPARTMENT = gql`
  query Get_all_departments($organisationId: String) {
    get_all_departments(organisationId: $organisationId) {
         _id
        name
        departmentNumber
        organisationID
        status
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;