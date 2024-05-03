import { gql } from '@apollo/client';

export const GET_ORGANIZATION = gql`
  query Get_all_organisations($instituteId: String) {
    get_all_organisations(instituteId: $instituteId) {
        _id
        name
        instituteId
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;