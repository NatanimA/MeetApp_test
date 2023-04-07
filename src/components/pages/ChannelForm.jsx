import React, { useEffect,useState } from "react";
import { config } from "../../constants";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Waiting from "./Waiting";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@apollo/client";
import { ADD_USER_QUEUE } from "../../constants/query";


const ChannelForm = (props) => {
  const {setInWaiting,users, time,setTime, setInCall,setUsers} = props;
  const [addUserQueue,{data,loading,error}]= useMutation(ADD_USER_QUEUE)
  const [name, setName]= useState('')

  const registerUserQueue = async () => {
    const state = {name:name,waiting:true,minutes:parseInt(time)}
    const response = await addUserQueue({variables:state})
    console.log("Response? : ",response)
    if(response?.data && !error && !loading){
      sessionStorage.setItem('user',JSON.stringify(response.data.addUserQueue))
      console.log("Config Before: ",config)
      config.token = response.data.addUserQueue.token
      console.log("config After",config)
      setInWaiting(true)
    }else {
      console.log(error)
    }

  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      registerUserQueue()
    } } className="join">
      {config.appId === '' && <p style={{color: 'red'}}>Please enter your Agora App ID in App.tsx and refresh the page</p>}
      <input type="number"
        name="minutes"
        placeholder="Enter Minutes"
        onChange={(e) => setTime(e.target.value)} required
      />

      <input type="text"
        name="name"
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)} required
      />

      <button type="submit">
        Join
      </button>

    </form>
  );
};


export default ChannelForm;
