import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import images from './assets/images.js';
import club from './assets/PNG-cards-1.3/2_of_clubs.png'

const App = () => {
  const [p1bottom, setp1bottom] = useState([]);
  const [p1mid, setp1mid] = useState([]);
  const [p1top, setp1top] = useState([]);
  const [p1discards, setp1discards] = useState([]);
  const [p2bottom, setp2bottom] = useState([]);
  const [p2mid, setp2mid] = useState([]);
  const [p2top, setp2top] = useState([]);
  const [p2discards, setp2discards] = useState([]);
  
  return (
    <div>placeholder</div>
  )
}

export default App;
