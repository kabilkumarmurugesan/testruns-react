import { gql } from '@apollo/client';

export const POST_PROCEDURE = gql`

mutation Create_procedure(
        $name: String!
        $organisationId: String!
        $departmentId: [String]!
        $laboratoryId: [String]!
        $createdOn: String!
        $createdBy: String!
        $procedureDetials: String!
        $instituteId: String!
        $createdByName: String
       
        ) {
    create_procedure(
        name: $name
        organisationId: $organisationId
        departmentId: $departmentId
        laboratoryId: $laboratoryId
        createdOn: $createdOn
        createdBy: $createdBy
        procedureDetials: $procedureDetials
        instituteId: $instituteId
        createdByName: $createdByName
    ) {
        _id
        name
        procedureNumber
        procedureDetials
        organisationId
        userId
        isActive
        isDeleted
        createdAt
        createdOn
        updatedAt
    }
}
`;



export const GET_PROCEDURE = gql`
query Get_all_procedures($page: Int!, $perPage: Int!, $sortBy: String, $sortOrder: String, $searchBy: String, $search: String, $laboratoryId: [String],$organisationId: String) {
    get_all_procedures(page: $page, perPage: $perPage, sortBy: $sortBy, sortOrder: $sortOrder, searchBy: $searchBy, search: $search, laboratoryId:$laboratoryId, organisationId:$organisationId) {
         Procedures {
            _id
            name
            procedureNumber
            procedureDetials
            organisationId
            userId
            isActive
            isDeleted
            createdAt
            createdBy
            createdByName
            createdOn
            updatedAt
            departmentId {
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
            laboratoryId {
                _id
                name
                userId
                departmentId
                isActive
                isDeleted
                createdAt
                updatedAt
            }
            assetId {
                _id
                name
            }
        }
        pageInfo {
            currentPage
            totalPages
            totalCount
            hasNextPage
            hasPreviousPage
        }
    }
}
`;

export const DELETE_PROCEDURE = gql`
mutation Delete_procedure($_id:[String]!) {
    delete_procedure(_id: $_id ) {
        data
    }
}
`;

export const GET_SINGLE_PROCEDURE = gql`
query Get_procedure($_id: String!) {
    get_procedure(_id: $_id) {
        _id
        name
        procedureNumber
        procedureDetials
        organisationId
        userId
        isActive
         departmentId {
            _id
            name
            departmentNumber
            
        }
        laboratoryId {
            _id
            name
            departmentId
           
        }
         assetId {
            _id
            name }
        isDeleted
        createdAt
        createdBy
        createdByName
        createdOn
        updatedAt
    }
}
`;
export const UPDATE_PROCEDURE = gql`
mutation Update_procedure(
    $_id: String!
        $name: String
        $departmentId: [String]
        $laboratoryId: [String]
        $organisationId: String
        $createdBy: String
        $assetId: [String]
        $procedureDetials:String
) {
    update_procedure(
        _id: $_id
        name: $name
        departmentId: $departmentId
        laboratoryId: $laboratoryId
        organisationId: $organisationId
        createdBy: $createdBy
        assetId: $assetId
        procedureDetials: $procedureDetials
    ) {
         _id
        name
        procedureNumber
        procedureDetials
        organisationId
        departmentId
        laboratoryId
        
        userId
        isActive
        isDeleted
        createdAt
        updatedAt
        createdOn
    }
}
`;

export const GET_ALL_PROCEDURE_NAME = gql`
query Get_all_procedures_name {
    get_all_procedures_name {
        name
        _id
    }
}
`