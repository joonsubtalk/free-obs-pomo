import { useEffect, useState, useCallback } from "react";
import { useTimer } from "react-use-precision-timer";
import useSound from "use-sound";
import "./App.scss";
import Clock from "./Clock";

import tenSecondsSound from './assets/10-seconds-left.mp3';
import plantSound from './assets/valorant-spike-plant.mp3';
import youPlaySound from './assets/you-want-to-play-lets-play.mp3';
import gogoSound from './assets/neon-go-go-go.mp3';
import wait from './assets/wait.jpg';
import free from './assets/free.jpg';

const POMODORO = {
  STUDY:0,
  BREAK:1,
}

const App = () => {
  const [count, setCount] = useState(60 * 25);
  const [studyCount, setStudyCount] = useState(60 * 25);
  const [breakCount, setBreakCount] = useState(60 * 5);
  const [showModal, setShowModal] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [pomodoro, setPomodoro] = useState(POMODORO.STUDY);
  const [paused, setPaused] = useState(false);
  const callback = useCallback(() => setCount(
    (count) => count - 1
  ), []);
  const timer = useTimer({ delay: 1000 }, callback);
  const [tenPlay, { tenStop }] = useSound(tenSecondsSound);
  const [youPlay, { youStop }] = useSound(youPlaySound);
  const [plantPlay, { plantStop }] = useSound(plantSound);
  const [gogoPlay, { gogoStop }] = useSound(gogoSound);

  useEffect(() => {
    timer.stop();
    return () => {
      timer.stop();
    };
  }, []);

  useEffect(() => {
    if (count === 10) {
      tenPlay();
    }
    if (count === 0) {
      if (pomodoro === POMODORO.STUDY){
        setPomodoro(POMODORO.BREAK);
        setCount(breakCount);
      } else if (pomodoro === POMODORO.BREAK){
        setPomodoro(POMODORO.STUDY);
        setCount(studyCount);
        setCycles(cycles + 1);
      }
    }
  }
  , [count, tenPlay, timer]);

  useEffect(() => {
    if (count === 0) {
      if (pomodoro === POMODORO.STUDY){
        youPlay();
      } else if (pomodoro === POMODORO.BREAK){
        gogoPlay();
      }
    }
  }
  , [count, youPlay]);

  const toggleTimer = () => {
    if (paused) {
      timer.start();
      plantPlay();
    } else {
      timer.stop();
    }
    setPaused(!paused);
  }

  const closeModalHandler = () => {
    setCount(studyCount);
    setPomodoro(POMODORO.STUDY);
    timer.stop();
    setPaused(true);
    setShowModal(false);
  }

  const resetCount = () => {
    if (pomodoro === POMODORO.STUDY) {
      setCount(studyCount);
    } else if (pomodoro === POMODORO.BREAK) {
      setCount(breakCount);
    }
    timer.stop();
    setPaused(true);
  }

  if (showModal) {
    return (
      <div className="settings">
        <div className="settings__container">
          <h3 className="settings__title">Pomodoro</h3>
          <label>Study Minutes</label>
          <input className="settings__input" type="number" placeholder="Enter time in minutes" onChange={(e) => setStudyCount(e.target.value * 60)} value={studyCount/60} /><br />
          <label>Break Minutes</label>
          <input className="settings__input" type="number" placeholder="Enter time in minutes" onChange={(e) => setBreakCount(e.target.value * 60)} value={breakCount/60} />
          <button className="settings__button" onClick={() => closeModalHandler()}>Start</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="app">
        {/* <div className="app__bg">
        {
          pomodoro === POMODORO.STUDY
          ? <img src={wait} alt="wait" className="app__img" />
          : <img src={free} alt="free" className="app__img" />
        }
        </div> */}
        <div className="app__cog">
          {
            cycles > 0
            && <p className="app__description">Cycles: {cycles}</p>
          }
          <button className="app__wheel" onClick={() => setShowModal(true)}>
            <svg className="app__icon" xmlns="http://www.w3.org/2000/svg" width="800" height="800" fill="none" viewBox="0 0 24 24"><path fill="#1C274C" fill-rule="evenodd" d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.409 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353 1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453-.47.807-.704 1.21-.757 1.605-.07.526.074 1.058.4 1.479.148.192.357.353.68.555.477.297.783.803.783 1.361 0 .558-.306 1.064-.782 1.36-.324.203-.533.364-.682.556-.325.421-.469.953-.399 1.479.053.394.287.798.757 1.605.47.807.704 1.21 1.022 1.453.424.323.96.465 1.49.396.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353.015.38.051.64.145.863.204.49.596.88 1.09 1.083.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308.53.07 1.066-.073 1.49-.396.318-.242.553-.646 1.022-1.453.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555-.477-.297-.783-.803-.783-1.361 0-.558.306-1.064.782-1.36.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008 1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083ZM12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9c-1.67 0-3.023 1.343-3.023 3s1.354 3 3.023 3Z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div className="app__card">
          {
            pomodoro === POMODORO.STUDY
            ? <h1 className="app__title">Study</h1>
            : <h1 className="app__title">Break</h1>
          }
          <Clock counter={count} />
          <div className="app__action">
            <button className="app__button" onClick={() => toggleTimer()}>
              {
                paused
                ? <svg className="app__icon" xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="-0.5 0 8 8"><path fill="#000" fillRule="evenodd" d="M0 0v8l7-4z"/></svg>
                : <svg className="app__icon" xmlns="http://www.w3.org/2000/svg" width="800" height="800" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M7 1H2v14h5V1ZM14 1H9v14h5V1Z"/></svg>
              }
            </button>
            <button className="app__button" onClick={() => resetCount()}>
              Reset
            </button>
            <button className="app__button" onClick={() => setCount(count + 5 * 60)}>
              Add 5 min
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
