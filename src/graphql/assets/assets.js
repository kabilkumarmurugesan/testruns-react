import { gql } from '@apollo/client';


gql`
 enum AssetStatus {
      Active
      Inactive
    }
  enum AssetAvailability {
      Available 
      In_Use 
      Not_Available
    } `

export const GET_ASSETS = gql`
 query Get_all_assets($page: Int!, $perPage: Int!, $sortBy: String, $sortOrder: String, $searchBy: String, $search: String, $laboratoryId:[String],$organisationId: String) {
    get_all_assets(page: $page, perPage: $perPage, sortBy: $sortBy, sortOrder: $sortOrder, searchBy: $searchBy, search: $search, laboratoryId: $laboratoryId, organisationId:$organisationId) {
        pageInfo {
            currentPage
            totalPages
            totalCount
            hasNextPage
            hasPreviousPage
        }
        Assets {
            _id
            name
            assetNumber
            organisationId
            perchasedDate
            lastUsedDate
            assetImageUrl
            status
            expiryDate
            isActive
            isDeleted
            createdAt
            updatedAt
            availability
            departmentId {
                _id
                name
                isActive
                isDeleted
                createdAt
                updatedAt
            }
            laboratoryId {
                _id
                name
                
                departmentId
                isActive
                isDeleted
                createdAt
                updatedAt
            }
        }
    }
  }
`; 
export const POST_ASSETS = gql`
  mutation Create_asset(
    $name: String!
    $departmentId: [String]!
    $laboratoryId: [String]!
    $organisationId: String!
    $perchasedDate: String!
    $lastUsedDate: String!
    $status: AssetStatus!
    $availability: AssetAvailability!
    $expiryDate: String!
    $assetImageUrl: String
    $instituteId: String!
  ) {
    create_asset(
      name: $name
      departmentId: $departmentId
      laboratoryId: $laboratoryId
      organisationId: $organisationId
      perchasedDate: $perchasedDate
      lastUsedDate: $lastUsedDate
      status: $status
      availability: $availability
      expiryDate: $expiryDate
      assetImageUrl: $assetImageUrl
      instituteId: $instituteId
    ) {
      _id
      name
      departmentId
      laboratoryId
      perchasedDate
      lastUsedDate
      status
      availability
      expiryDate
    }
  }
`;

export const DELETE_ASSETS = gql`
mutation Delete_asset($_id: [String]!) {
  delete_asset(_id: $_id) {
      data
    }
}
`;
export const GET_SINGLE_ASSETS = gql`
query Get_asset($_id: String!) {
    get_asset(_id: $_id) {
        _id
        name
        assetNumber
        organisationId
        assetImageUrl
        perchasedDate
        lastUsedDate
        status
        availability
        expiryDate
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_ASSETS = gql`

mutation Update_asset(
        $_id: String!
        $name: String
        $organisationId: String
        $perchasedDate: String
        $assetImageUrl: String
        $lastUsedDate: String
        $availability: AssetAvailability
        $expiryDate: String
        $departmentId: [String]
        $laboratoryId: [String]
        $status: AssetStatus
        ) {
     update_asset(
        _id: $_id
        name: $name
        organisationId: $organisationId
        perchasedDate: $perchasedDate
        assetImageUrl:$assetImageUrl
        lastUsedDate: $lastUsedDate
        availability: $availability
        expiryDate: $expiryDate
        departmentId: $departmentId
        laboratoryId: $laboratoryId
        status:$status
    ) {
        _id
        name
        assetNumber
        organisationId
        perchasedDate
        lastUsedDate
        status
        availability
        expiryDate
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}

`;

export const GET_ASSETS_NAMES = gql`
 query Get_all_assets_name (    $organisationId: String) {
    get_all_assets_name (   organisationId:$organisationId) {
         name
        _id
    }
}
`;

export const GET_PROCEDURE_ASSETS = gql`
query Get_all_procedures_by_asset($assetId: [String]) {
    get_all_procedures_by_asset(assetId: $assetId) {
        name
        _id
    }
}
`;

export const GET_ALL_RUNS_PROCEDURE = gql`
query Get_all_runs_by_procedure($procedureId:[String],$page: Int!, $perPage: Int!, $sortBy: String, $sortOrder: String, $searchBy: String, $search: String,) {
    get_all_runs_by_procedure(procedureId: $procedureId, page: $page, perPage: $perPage, sortBy: $sortBy, sortOrder: $sortOrder, searchBy: $searchBy, search: $search) {
        Runs {
            _id
            userId
            objective
            runNumber
            runId
            procedureName
            organisationId
            instituteId
            dueDate
            status
            shared
            createdOn
            isActive
            isDeleted
            createdAt
            updatedAt
             departmentId {
                _id
                name
                departmentNumber
            }
            laboratoryId {
                _id
                name
            }
            assignedTo {
                _id
                firstName
                email
                role
            }
            assignedBy {
                _id
                firstName
                email
                role
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
