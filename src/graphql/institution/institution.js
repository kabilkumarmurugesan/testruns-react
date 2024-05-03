import { gql } from '@apollo/client';

export const GET_ALL_INSTITUTIONS = gql`
query Get_all_institute {
    get_all_institute {
        _id
        name
        status
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;