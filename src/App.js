import React, { useState, useEffect } from 'react'
import {Helmet} from "react-helmet";
const startBeep = require("./start-13691.mp3");
const endBeep = require("./stop-13692.mp3");

function App() {

  const startAudio = document.getElementById("audio_tag_start");
  const endAudio = document.getElementById("audio_tag_end");

  const [state, setState] = useState({
    timer: '5:00',
    bg: 'blue-bg',
    preReminder: 15,
    enabled: true,
    lastTotal: 0
  });

  const getTimeRemaining = (time, deadline) => {
    const total = Math.floor((deadline - time) / 1000);
    const seconds = Math.floor(total % 60);
    const minutes = Math.floor((total / 60) % 60);
    return {
      total, minutes, seconds
    };
  }

  const updateTimer = () => {
    let date = new Date();
    let time = date.getTime();
    let deadline = time - (time % (5 * 60 * 1000)) + (5 * 60 * 1000);

    let { total, minutes, seconds } = getTimeRemaining(time, deadline);
    
    if (state.lastTotal != total && state.enabled) {
      if (total == 5 * 60 - 1) {
        endAudio.play();
      } else if (total == state.preReminder) {
        startAudio.play();
      }
    }

    setState(prevState => {
      return {
        ...prevState,
        bg: ((total>state.preReminder || state.enabled == false)?'blue-bg':'red-bg'),
        timer: minutes + ':' + (seconds > 9 ? seconds : '0' + seconds),
        lastTotal: total
      };
    });
  }

  useEffect(() => {
    const scheduler = setTimeout(() => {
      updateTimer();
    }, 100);
    return () => {
      clearTimeout(scheduler);
    };
  }, [state]);

  const pauseFn = () => {
    setState(prevState => {
      return {
        ...prevState,
        enabled: !state.enabled
      };
    });
  }

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    link.href = "./"+(state.bg=='blue-bg'?'favicon-blue.png':'favicon-red.png');
  }, [state.bg]);
  
  return (
    <div className={'App ' + state.bg}>
      <Helmet>
        <meta name="theme-color" content={state.bg=='blue-bg'?"#1565C0":"#AD1457"} />
      </Helmet>
      <div className="App">
        <div id="ui">
          <div id="ui-left">
            <h2 id="timer" class={state.enabled?'':'paused'}>{state.timer}</h2>
          </div>
          <div id="ui-right">
            <button id="mini-btn" onClick={() => window.open('.', '','width=240,height=120')}>Mini</button> 
            <input id="pre-reminder" autocomplete='false' title='Pre Reminder' type='number' value={state.preReminder} arrow onChange={(e) => {
              setState(prevState => {
                return {
                  ...prevState,
                  preReminder: e.target.value
                };
              });
            }}/>
            <button onClick={(e) => {pauseFn();}}>{state.enabled?'Pause':'Go'}</button>
          </div>
        </div>
      </div>
      <audio id="audio_tag_start" src={startBeep}/>
      <audio id="audio_tag_end" src={endBeep}/>
    </div>
  );
}

export default App;
