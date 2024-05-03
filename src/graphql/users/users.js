import { gql } from '@apollo/client';

gql`
 enum AssetStatus {
      Active
      Inactive
    }
 enum CreatedStatus{
    Self
    Admin
 }   
    `
export const GET_USER = gql`
query get_all_users($page: Int!, $perPage: Int!, $sortBy: String, $sortOrder: String, $searchBy: String, $search: String, $organisationId:String, $instituteId: String) {
    get_all_users(page: $page, perPage: $perPage, sortBy: $sortBy, sortOrder: $sortOrder, searchBy: $searchBy, search: $search, organisationId :$organisationId, instituteId:$instituteId) {
        pageInfo {
            currentPage
            totalPages
            totalCount
            hasNextPage
            hasPreviousPage
        }
        Identity {
            _id
            fullName
            firstName
            lastName
            organisationId
            email
            role
            instituteId
            phoneNumber
            status
             departmentId
            laboratoryId
            imageUrl
            createdOn
            isDeleted
            createdAt
            updatedAt
            createdBy
            
            
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
export const POST_USER = gql`
mutation Create_user(
       $uid: String
       $firstName:String!
       $lastName:String!
       $fullName:String
       $departmentId:[String]
       $laboratoryId:[String]
       $organisationId:String
       $email:String!
       $role:String
       $phoneNumber:String
       $instituteId: String
       $createdOn: String
       $createdBy: CreatedStatus
    
) {
    create_user(
        uid:$uid
        firstName:$firstName
        lastName:$lastName
        fullName:$fullName
        departmentId:$departmentId
        laboratoryId:$laboratoryId
        organisationId:$organisationId
        email:$email
        role:$role
        phoneNumber:$phoneNumber
        instituteId:$instituteId
        createdOn:$createdOn
        createdBy:$createdBy
        
    )  {identitys {
            _id
            uid
            firstName
            lastName
            fullName
            departmentId
            laboratoryId
            organisationId
            email
            instituteId
            role
            phoneNumber
            status
            isDeleted
            createdAt
            createdOn
            updatedAt
        }
        message
    }
}
`;

export const DELETE_USER = gql`
mutation Delete_user($_id: [String]!) {
    delete_user(_id: $_id) {
        data
    }
}
`;
export const UPDATE_USER = gql`
mutation  update_user(
       $_id:String!
       $firstName:String
       $lastName:String
       $fullName:String
       $departmentId:[String]
       $laboratoryId:[String]
       $organisationId:String
       $email:String
       $role:String
       $status:AssetStatus
       $imageUrl:String
       $phoneNumber:String
       $instituteId:String
    ) {
    update_user(
        _id:$_id
        firstName:$firstName
        lastName:$lastName
        fullName:$fullName
        departmentId:$departmentId
        laboratoryId:$laboratoryId
        organisationId:$organisationId
        email:$email
        role:$role
        imageUrl:$imageUrl
        instituteId: $instituteId
        status:$status
        phoneNumber:$phoneNumber
    ) {
        _id
        uid
        firstName
        lastName
        fullName
        departmentId
        laboratoryId
        organisationId
        email
        role
        phoneNumber
        status
        imageUrl
        isDeleted
        createdAt
        updatedAt
    }
}
`;
export const GET_SINGLE_USER = gql`
query Get_user($_id: String!) {
    get_user(_id: $_id) {
        _id
        firstName
        lastName
        departmentId
        laboratoryId
        imageUrl
        organisationId
        email
        instituteId
        role
        phoneNumber
        status
        #isActive
        isDeleted
        createdAt
        updatedAt
        createdBy
    }
}
`;
export const LOGIN_USER = gql`
mutation VerifyToken($idToken:String!) {
    verifyToken(idToken: $idToken) {
        _id
        uid
        firstName
        fullName
        lastName
        departmentId
        laboratoryId
        organisationId
        email
        instituteId
        imageUrl
        phoneNumber
        status
        #isActive
        isDeleted
        createdAt
        updatedAt
         role {
            _id
            name
            type
            #isActive
            isDeleted
            createdAt
            updatedAt
            procedure_management {
                create
                delete
                edit
                view
                assign
                share
            }
            asset_management {
                create
                delete
                edit
                view
                assign
                share
            }
            runs_management {
                create
                delete
                edit
                view
                assign
                share
            }
            profile_management {
                editUserName
                changePassword
                editDepartment
                editLab
                editOrganisation
                editContact
                editRole
            }
            user_management {
                create
                delete
                edit
                view
            }
            role_management {
                edit
            }
        }
    }
}
`;

export const GET_USER_DATA = gql`
query Find_users($organisationId:String,$ignoreUser:[String]) {
    find_users(organisationId:$organisationId,ignoreUser:$ignoreUser) {
        _id
        uid
        firstName
        imageUrl
        lastName
        departmentId
        laboratoryId
        organisationId
        email
        instituteId
        imageUrl
        role
        phoneNumber
        status
        #isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;

export const GET_SHARED_USER_DATA = gql`
query Get_share_data($runId:[String!]) {
    get_share_data(runId:$runId) {
        _id
        firstName
        lastName
        fullName
        email
    }
}
`;