import { gql } from "@apollo/client";

export const ADD_USER_QUEUE = gql`
    mutation($name:String!,$waiting:Boolean!,$minutes:Int!) {
        addUserQueue(name:$name,waiting:$waiting,minutes:$minutes) {
            id
            name
            waiting
            minutes
            token
            channelName
        }
    }
`;

export const REMOVE_USER_QUEUE = gql`
    mutation($id: ID!){
        removeUserQueue(id:$id){
            message
        }
    }
`;

export const GET_SUBSCRIPTION_USER_QUEUE = gql`
    subscription($id:String!){
        getUserWaitingUserQueue(id:$id){
            id
            name
            waiting
            minutes
            token
            channelName
        }
    }
`;
