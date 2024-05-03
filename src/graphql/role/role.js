import { gql } from '@apollo/client';

export const GET_ALL_ROLE = gql`

query Get_all_roles {
    get_all_roles(page: 1, perPage: 5) {
        _id
        name
        isActive
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

`;
export const GET_ROLE = gql`
query Get_role($instituteId :String!) {
    get_role(instituteId: $instituteId) {
         _id
        name
        type
        isActive
        isDeleted
        createdAt
        updatedAt
        role_management {
            edit
        }
        user_management {
            create
            delete
            edit
            view
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
        runs_management {
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
        procedure_management {
            create
            delete
            edit
            view
            assign
            share
        }
    }
}
`;


export const FIND_ROLE = gql`
query Find_roles($instituteId: String!) {
    find_roles(instituteId: $instituteId){
        _id
        name
        type
        isActive
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
}`
export const UPDATE_FIND_ROLE = gql`
mutation Update_role($roles: [BulkUpdateRole]) {
    update_role(roles: $roles) {
        _id
        name
        type
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}`


gql`
input ProcedureManagement {
    create: Boolean
    delete: Boolean
    edit: Boolean
    view: Boolean
    assign:Boolean
    share:Boolean
    }

   input AssetManagement {
          create: Boolean
          delete: Boolean
          edit: Boolean
          view: Boolean
          assign:Boolean
          share:Boolean
        }

 input RunsManagement {
          create: Boolean
          delete: Boolean
          edit: Boolean
          view: Boolean
          assign:Boolean
          share:Boolean
        }

 input BulkProfileManagement{
  editUserName: Boolean
  changePassword: Boolean
  editDepartment: Boolean
  editLab: Boolean
  editOrganisation: Boolean
  editContact: Boolean
  editRole:Boolean
}
  input BulkUserManagement {
  create: Boolean
  delete: Boolean
  edit: Boolean
  view: Boolean
}

 input BulkRoleManagement {
  edit: Boolean
}

  input BulkUpdateRole {
    _id: String!
    name: String
    type: String
    procedure_management: ProcedureManagement
    asset_management: AssetManagement
    runs_management: RunsManagement
    profile_management: BulkProfileManagement
    user_management: BulkUserManagement
    role_management: BulkRoleManagement
    instituteId: String
  }
`