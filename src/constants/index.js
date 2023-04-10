import { createClient as agoraClient,createMicrophoneAndCameraTracks } from 'agora-rtc-react'
import { split,HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloClient,InMemoryCache } from '@apollo/client';
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from '@apollo/client/link/ws'


// Change GraphQl End Points
const SUBSCRIPTION_LINK = 'ws://meetapp.onrender.com/graphql'
const HTTP_LINK = 'https://meetapp.onrender.com/graphql'

const appId = "832e475dcfa445a48fa706959fbe113e"; //ENTER APP ID HERE
let token = ''
export const config = {
  mode: "rtc", codec: "vp8",appId:appId,token:token
};

const wsLink = new WebSocketLink( new SubscriptionClient(SUBSCRIPTION_LINK))

const httpLink = new HttpLink({
  uri:HTTP_LINK
})


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient =  new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});



export const client = agoraClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()
