import { gql } from '@apollo/client';

export const POST_BULKRUNZ = gql`
mutation BulkCreate_run($runs: [BulkCreateRun]) {
    bulkCreate_run(runs: $runs) {
        _id
        runNumber
        assignedTo
        assignedBy
        dueDate
        status
        isActive
        isDeleted
        createdAt
        updatedAt
        objective
    }
}`;
 gql`
 enum RunStatus {
      Created
      Started
      Stopped
      Submitted
      Completed
    }
`
gql`
  input BulkCreateRun {
    objective: String
    userId:String 
    shared:Boolean
    procedureId: String!
    departmentId: [String]
    laboratoryId: [String]
    organisationId: String
    instituteId: String
    assignedTo: String
    assignedBy: String
    dueDate: String
    status: RunStatus
  }
`

export const SHARE_RUNZ = gql`
mutation Share_run(
$runId: [String],
$shareUserId: [String]
) {
    share_run(runId: $runId, shareUserId: $shareUserId) {
        runNumber
    }
}
`