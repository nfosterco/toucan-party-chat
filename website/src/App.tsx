import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">        
        <form>
          <label htmlFor="name-input">Welcome To Toucan Party Chat, What Is Your Name?</label>
          <input type="text" name="name-input" id="name-input" />
          <button>Save</button>
        </form>
      </header>
    </div>
  );
}

export default App;
