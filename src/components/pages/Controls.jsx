import React, { useState } from "react";
import { client as useClient } from "../../constants";
import { useMutation } from "@apollo/client";
import { REMOVE_USER_QUEUE } from "../../constants/query";

export const Controls = (props) => {
  const client = useClient();

  const { time,tracks, setStart, setInCall, cameras,session,setInWaiting } = props;
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localCameraTrack, setLocalCameraTrack] = useState(null);
  const [virtualBackground, setVirtualBackground] = useState(false);
  const [trackState, setTrackState] = useState({ video: true, audio: true, virtualBackground: false, });

  const [removeUserQueue,{data,error,loading}] = useMutation(REMOVE_USER_QUEUE)

  // Enable virtual background
  const beautyOptions = {
    lighteningContrastLevel: 1,
    lighteningLevel: 0.7,
    smoothnessLevel: 0.5,
    rednessLevel: 0.1,
    enable: true,
    backgroundImageUrl: "https://plus.unsplash.com/premium_photo-1666262369867-6e521a979afb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3BsYXNofGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
  };

  const getStats = () => {
    console.log("Minutest purchased: ",time)
    console.log(Math.floor(client.getRTCStats().Duration/60) + " Minutes")
    console.log(client.getRTCStats().Duration + "seconds")
  }
  const mute = async (type) => {
    if(type === "audio"){
            await tracks[0].setEnabled(!trackState.audio)
            setTrackState((ps) => {
                return {...ps,audio:!ps.audio}
            })
        }

    else if(type === "video"){
        await tracks[1].setEnabled(!trackState.video)
        setTrackState((ps) => {
            return {...ps,video:!ps.video}
        })
    } else if (type === "background") {
      console.log("jere");
      await tracks[1].setBeautyEffect(!trackState.virtualBackground, beautyOptions);
      console.log("done updating background");
      setTrackState((ps) => {
        return { ...ps, virtualBackground: !ps.virtualBackground };
      });
    }
  };

  const changeCamera = async (event) => {
    await tracks[1].setDevice(event.target.value);
  }

  const leaveChannel = async () => {
    const response = await removeUserQueue({variables:{id:session?.id}})
    if(!error && !loading && response?.data){
      console.log("Remove Response: ",response)
      await client.leave();
      client.removeAllListeners();
    // we close the tracks to perform cleanup
      tracks[0].close();
      tracks[1].close();
      sessionStorage.removeItem('user')
      setStart(false);
      setInCall(false);
      setInWaiting(false)
    }
  };

  return (
    <div className="controls">
      <p className={trackState.audio ? "on" : ""}
        onClick={() => mute("audio")}>
        {trackState.audio ? "MuteAudio" : "UnmuteAudio"}
      </p>
      <button onClick={() => getStats()}>
        Stats
      </button>
      <p className={trackState.video ? "on" : ""}
        onClick={() => mute("video")}>
        {trackState.video ? "MuteVideo" : "UnmuteVideo"}
      </p>
      <p className={trackState.virtualBackground ? "on" : ""}
        onClick={() => mute("background")}>
        {trackState.virtualBackground ? "Enable Background" : "Disable Background"}
      </p>
      <select id="camera-source-select" onChange={changeCamera}>
        <option disabled selected value="">Choose Camera</option>
        {cameras &&
          cameras.map((camera) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label}
            </option>
          ))}
      </select>
      {<p onClick={() => leaveChannel()}>Leave</p>}
    </div>
  );
};

export default Controls;
