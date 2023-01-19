import React from 'react';
import './App.css';
import { io } from "socket.io-client";

function App() {

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  })

  return (
    <div className="App">
      <header className="App-header">        
          <label htmlFor="name-input">Welcome To Toucan Party Chat, What Is Your Name?</label>
          <p>{!data ? "Loading..." : data}</p>
          <input type="text" name="name-input" id="name-input" />
          <button onClick={() => {
            const socket = io('http://localhost:3001');
          }}>Save</button>
      </header>
    </div>
  );
}

export default App;
