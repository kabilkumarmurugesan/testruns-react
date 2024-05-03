
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
 query Get_all_runs($page: Int!, $perPage: Int!, $sortBy: String, $assignedTo:String, $assignedBy:String, $sortOrder: String, $searchBy: String, $search: String) {
    get_all_runs(page: $page, perPage: $perPage, sortBy: $sortBy, assignedTo:$assignedTo, assignedBy:$assignedBy, sortOrder: $sortOrder, searchBy: $searchBy, search: $search){
         Runs {
            _id
            objective
            runNumber
            dueDate
            status
            isActive
            isDeleted
            createdAt
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
                departmentId
                isActive
                isDeleted
                createdAt
                updatedAt
            }
            procedureId{
                _id
                name
                procedureNumber
                procedureDetials
                isActive
                isDeleted
                createdAt
                updatedAt
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

export const CALENDER_DATA = gql`
 query runs_calender_data($month: String!, $year: String!, $assignedTo:String) {
    runs_calender_data(month: $month, year: $year, assignedTo:$assignedTo){
         _id
        objective
        runNumber
        procedureId
        departmentId
        laboratoryId
        organisationId
        instituteId
        userId
        dueDate
        assignedTo
        assignedBy
        status
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}`; 