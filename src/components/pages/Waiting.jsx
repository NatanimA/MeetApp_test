import React, { useEffect, useState } from 'react'
import { useSubscription } from '@apollo/client'
import { config } from '../../constants'
import { client as useClient } from '../../constants'
import VideoCall from './VideoCall'
import { GET_SUBSCRIPTION_USER_QUEUE } from '../../constants/query'

const Waiting = (props) => {
  const client = useClient()
  const { users,setInCall,inCall,setUsers,time,setTime,setTimeIsUp,setInWaiting } = props
  const[ queue,setQueue] = useState([])
  const [session,setSession] = useState(JSON.parse(sessionStorage.getItem('user')))
  const [inUsers,setInUsers] = useState([])

  const subscription = useSubscription(GET_SUBSCRIPTION_USER_QUEUE,{variables:{id:session.id}})

  console.log("Subscription: ",subscription)

  useEffect(() => {
    if(subscription.data){
      const user = subscription.data.getUserWaitingUserQueue.find(u => u.id === session.id)
      if(user){
        setSession(user)
        config.token=user.token
        sessionStorage.setItem('user',JSON.stringify(user))
      }
    }
  },[subscription.data])

  return (
    <>
      {/* inCall && */}
      {!session.waiting ?  (
          <VideoCall users={inUsers} setUsers={setInUsers} session={session} setTimeIsUp={setTimeIsUp} time={time} setInCall={setInCall} setInWaiting={setInWaiting} />
        ) : (<div>Waiting...</div>)}
    </>

  )

}

export default Waiting;
