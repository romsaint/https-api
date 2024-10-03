import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


function App() {
  const [val, setVal] = useState(null);

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(async position => {
    //   const { longitude, latitude } = position.coords;

    //   const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    // });

    try{
      const users = axios.get('https://127.0.0.1:5000/user/all-users').then(val => {
        setVal(val.data)
      })
    }catch(e){
      console.log(e)
    }
    
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        <code>src/App.js</code> and save to reload.
        </p>
        <pre>{JSON.stringify(val)}</pre>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;