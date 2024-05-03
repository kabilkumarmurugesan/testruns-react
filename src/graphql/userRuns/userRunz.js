 import { gql } from '@apollo/client';

export const POST_USER_RUNS = gql`
mutation Create_userRunz(
    $runId :String!
    $organisationId :String!
    $userProcedure :String
    $static_chart_data: String
    $remarks: String
    $results : String
    $used_Asset: [String]
    $endTime:String
    $startTime:String
) {
    create_userRunz(runId: $runId, organisationId: $organisationId, userProcedure: $userProcedure, static_chart_data:$static_chart_data, remarks:$remarks, used_Asset:$used_Asset,endTime:$endTime,startTime:$startTime, results:$results) {
        _id
        runId
        organisationId
        userProcedure
        static_chart_data
        remarks
        results
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_USER_RUNS = gql`
mutation Update_userRun(
    $_id: String!
    $userProcedure: String
    $static_chart_data: String
    $remarks: String
    $results : String
    $used_Asset: [String]
    $endTime:String
    $startTime:String
) {
    update_userRun(_id: $_id, userProcedure: $userProcedure, static_chart_data: $static_chart_data, remarks:$remarks, used_Asset:$used_Asset, endTime:$endTime, startTime:$startTime, results:$results) {
        _id
        runId
        organisationId
        userProcedure
        static_chart_data
        remarks
        results
        isActive
        isDeleted
        createdAt
        updatedAt
    }
}
`;

export const GET_SINGLE_USER_RUNS = gql`
query Get_userRun(
    $runId: String!
) {
    get_userRun(runId: $runId) {
        _id
        runId
        organisationId
        userProcedure
        static_chart_data
        remarks
        results
        isActive
        isDeleted
        createdAt
        updatedAt
        endTime
        startTime
        used_Asset
    }
}`;
