import './App.css';
import React, { useState, useEffect } from 'react';

function Header(){
    
        const [theme, setTheme] = useState('light');

  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  
  useEffect(() => {
    document.body.className = ''; 
    document.body.classList.add(`${theme}-mode`);
    document.getElementById('header').className = 'App-header';
    document.getElementById('header').classList.add(`${theme}-mode`);
    document.getElementById('box').className = 'box';
    document.getElementById('box').classList.add(`${theme}-mode`);
     document.getElementById('mirror').className = 'mirror';
    document.getElementById('mirror').classList.add(`${theme}-mode`);
  }, [theme]);

  return (
        <header className="App-header" id="header">
            <h1 className="Heading" >EmotionMirror</h1>
            <h2 className="subHeading">The emotions you try to hide are now known 😉</h2>
           <div className="App">
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
            
        </header>
    );
}

export default Header;