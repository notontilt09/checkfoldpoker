import React, { useState, } from 'react';
import axios from 'axios';
import './App.css';

import images from './assets/images.js';


const App = () => {
  console.log(images);
  const [ws, setWs] = useState(new WebSocket('ws://localhost:3030'));
  const [test, setTest] = useState([]);

  ws.onopen = () => {
    console.log('connected');
  }

  ws.onmessage = e => {
    console.log(e.data);
    // TODO: do something with the data...
  }

  ws.onclose = () => {
    console.log('disconnected');
    setWs(new WebSocket('ws://localhost:3030'));
  }

  const handleChanges = e => {
    setTest(e.target.value);
  }

  const submitForm = e => {
    e.preventDefault();
    ws.send(test);
  }
  
  // const newWindow = () => {
  //   // window.open with these params to open a new window with /table url
  //   window.open('/table', '_blank', 'toolbar=0,location=0,menubar=0,height=500,width=800');
  // }

  return (
    // <div onClick={newWindow}>new window</div>
    <form>
      <input type="text" value={test} onChange={handleChanges} />
      <button onClick={submitForm}>Submit</button>
    </form>
  )
}

export default App;
