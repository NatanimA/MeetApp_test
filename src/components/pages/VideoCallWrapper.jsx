import React, { useEffect, useState } from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng"
import { client as useClient,useMicrophoneAndCameraTracks } from "../../constants";
import VideoCall from "./VideoCall";
import ChannelForm from "./ChannelForm";
import Waiting from "./Waiting";
import {client} from "../../constants/index"

const VideoCallWrapper = () => {
  const [inCall, setInCall] = useState(false);
  const [inWaiting, setInWaiting ] = useState(JSON.parse(sessionStorage.getItem('user'))?.waiting || false);
  const [channelName, setChannelName] = useState("");
  const [time, setTime] = useState(0)
  const [timeIsUp, setTimeIsUp] = useState(false)
  const [users, setUsers] = useState([]);
  const [session,setSession ] = useState();

  useEffect(() => {
    if(inWaiting){
      setInCall(true)
    }
  },[])
  return (
    <div>
      {inWaiting ? (<Waiting users={users} time={time} setTimeIsUp={timeIsUp} setTime={setTime} setUsers={setUsers} setInWaiting={setInWaiting} inCall={inCall} setInCall={setInCall} />) : (
        <ChannelForm time={time} users={users} setInWaiting={setInWaiting} setUsers={setUsers} setTime={setTime} setInCall={setInCall} setChannelName={setChannelName} />
      )}
      {timeIsUp ? (<h4>Time is Up</h4>) : ""}

    </div>
  );
};

export default VideoCallWrapper;
