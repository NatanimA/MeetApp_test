import React,{ useState,useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { client as useClient,useMicrophoneAndCameraTracks } from "../../constants";
import Controls from "./Controls";
import Videos from "./Videos";
import { config } from "../../constants";

const VideoCall = (props) => {
  const {users,setUsers,setTimeIsUp, time, setInCall,session,setInWaiting } = props;
  const [start, setStart] = useState(false);
  const [cameras, setCameras] = useState(null);
  const [channelName, setChannelName] = useState(session.channelName)
  // using the hook to get access to the client object
  const client = useClient();
  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  AgoraRTC.getDevices().then((devices) => {
        const cameras = devices.filter((device) => device.kind === "videoinput");
        setCameras(cameras);
      });

  useEffect(() => {
    // function to initialise the SDK
    console.log("Vidio Call Config:", config)
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          if(user.audioTrack) user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      await client.join(config.appId, name, config.token, null);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);

    };

    if (ready && tracks) {
      console.log("init ready");
      console.log('track', tracks);
      // console.log('videotrack', readyVideo);
      console.log("Time purchased is: ",time)
      init(channelName);
    }

  }, [channelName,client, ready, tracks]);

  // useEffect(() => {
  //   if( time <= Math.floor(client.getRTCStats().Duration/60)){
  //     console.log("Leaving channel because time is up")
  //     leaveChannel();
  //     setTimeIsUp(true);
  //     return;
  //   }
  // },[client.getRTCStats().Duration])

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  return (
    <div className="App">
      {ready && tracks && cameras && (
        <Controls time={time} tracks={tracks} session={session} setStart={setStart} setUsers={setUsers} setInCall={setInCall} cameras={cameras} setInWaiting={setInWaiting} />
      )}
      {start && tracks && <Videos users={users} tracks={tracks} />}
    </div>
  );
};

export default VideoCall;
