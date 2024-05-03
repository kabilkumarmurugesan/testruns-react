
 import { gql } from '@apollo/client';
 gql`
 enum RunStatus {
      Created
      Started
      Stopped
      Submitted
      Completed
    }
`
export const GET_RUNS = gql`
 query Get_all_runs($page: Int!, $perPage: Int!, $sortBy: String, $assignedTo:String, $assignedBy:String, $sortOrder: String, $searchBy: String, $search: String, $userId:String,$organisationId:String) {
    get_all_runs(page: $page, perPage: $perPage, sortBy: $sortBy, assignedTo:$assignedTo, assignedBy:$assignedBy,sortOrder: $sortOrder, searchBy: $searchBy, search: $search, userId: $userId, organisationId: $organisationId){
         Runs {
            _id
            objective
            runNumber
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
            dueDate
            status
            isActive
            procedureName
            assignedByName
            assignedToName
            runId
            isDeleted
            #createdAt
            createdOn
            #updatedAt
            shared
            procedureId {
                _id
                name
                procedureNumber
                #assetId
              
            }
            departmentId {
                _id
                name
               
            }
            laboratoryId {
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
export const POST_RUNS = gql`
  mutation Create_run(
        $objective: String!
        $procedureId: String!
        $createdOn: String!
        $organisationId:String!
        $departmentId: [String]!
        $laboratoryId: [String]!
        $assignedTo: String!
        $procedureName: String!
        $assignedToName : String!
        $assignedByName : String!
        $assignedBy: String!
        $status: RunStatus!
        $dueDate: String!
        $userId :String
    
  ) {
    create_run(
        objective: $objective
        procedureId: $procedureId
        organisationId:$organisationId
        createdOn: $createdOn
        departmentId: $departmentId
        laboratoryId: $laboratoryId
        assignedTo: $assignedTo
        assignedBy: $assignedBy
        assignedByName: $assignedByName
        assignedToName: $assignedToName
        procedureName: $procedureName
        status: $status
        dueDate: $dueDate
        userId: $userId
    
    ) {
       _id
        objective
        runNumber
        dueDate
        status
        isActive
        isDeleted
        createdAt
        updatedAt
        departmentId 
        laboratoryId 
        procedureId
      
    }
  }
  `; 
   export const DELETE_RUNS = gql`
mutation Delete_run($_id: [String]!) {
  delete_run(_id: $_id) {
      data
    }
}
`;

export const GET_SINGLE_RUNS = gql`
query Get_run($_id: String!) {
    get_run(_id: $_id){
        _id
        userId
        objective
        runNumber
        runId
        organisationId
        instituteId
        createdOn
        dueDate
        status
        isActive
        isDeleted
        createdAt
        shared
        updatedAt
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
        procedureId {
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
            createdOn
            updatedAt
            assetId {
                _id
                name
            }
        }
        departmentId {
            _id
            name
            departmentNumber
        }
        laboratoryId {
            _id
            name
        }
    
    }
}
`;
export const UPDATE_RUNS = gql`

mutation Update_run(
     $_id: String!
     $organisationId: String
     $procedureId: String
    $objective: String
    $departmentId: [String]
    $laboratoryId: [String]
    $dueDate: String
    $status: RunStatus
    $assignedTo: String
    $procedureName: String
    $assignedBy: String
        ) {
     update_run(
    _id: $_id
        objective: $objective
        organisationId: $organisationId
        procedureId: $procedureId
        departmentId: $departmentId
        laboratoryId: $laboratoryId
        status: $status
        procedureName: $procedureName
        assignedTo: $assignedTo
        assignedBy: $assignedBy
        dueDate: $dueDate
    )   {_id
        objective
        runNumber
        dueDate
        status
        isActive
        isDeleted
        createdAt
        updatedAt
        departmentId 
        laboratoryId 
        procedureId
           }
}

`;


export const GET_CHART_TABLE = gql`
query Static_chart {
    static_chart(userRunId: "655b261e7e26fb0012425184") {
        tableName
        headers
        rows {
            values
        }
    }
}`;
