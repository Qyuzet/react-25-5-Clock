import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500, // 25 minutes in seconds
      timerLabel: "Session",
      isRunning: false,
      intervalId: null,
    };

    this.audioRef = React.createRef();
  }

  componentWillUnmount() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
  }

  handleReset = () => {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }

    this.audioRef.current.pause();
    this.audioRef.current.currentTime = 0;

    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      timerLabel: "Session",
      isRunning: false,
      intervalId: null,
    });
  };

  handleStartStop = () => {
    if (!this.state.isRunning) {
      const intervalId = setInterval(this.decrementTimer, 1000);
      this.setState({ isRunning: true, intervalId });
    } else {
      clearInterval(this.state.intervalId);
      this.setState({ isRunning: false, intervalId: null });
    }
  };

  decrementTimer = () => {
    this.setState((prevState) => {
      const newTimeLeft = prevState.timeLeft - 1;

      if (newTimeLeft >= 0) {
        return { timeLeft: newTimeLeft };
      }

      // Play audio when timer reaches 00:00
      this.audioRef.current.play();

      // Transition to next phase
      const newLabel = prevState.timerLabel === "Session" ? "Break" : "Session";
      const newTime =
        prevState.timerLabel === "Session"
          ? prevState.breakLength * 60
          : prevState.sessionLength * 60;

      return {
        timeLeft: newTime,
        timerLabel: newLabel,
      };
    });
  };

  handleLengthChange = (type, change) => {
    if (this.state.isRunning) return;

    const lengthKey = `${type}Length`;
    const currentValue = this.state[lengthKey];
    const newValue = currentValue + change;

    if (newValue > 0 && newValue <= 60) {
      this.setState((prevState) => ({
        [lengthKey]: newValue,
        timeLeft: type === "session" ? newValue * 60 : prevState.timeLeft,
      }));
    }
  };

  formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  render() {
    const { breakLength, sessionLength, timeLeft, timerLabel, isRunning } =
      this.state;

    return (
      <div className="clock-container">
        <h1>25 + 5 Clock</h1>

        <div className="length-controls">
          <div className="break-controls">
            <h2 id="break-label">Break Length</h2>
            <button
              id="break-decrement"
              onClick={() => this.handleLengthChange("break", -1)}
            >
              ↓
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-increment"
              onClick={() => this.handleLengthChange("break", 1)}
            >
              ↑
            </button>
          </div>

          <div className="session-controls">
            <h2 id="session-label">Session Length</h2>
            <button
              id="session-decrement"
              onClick={() => this.handleLengthChange("session", -1)}
            >
              ↓
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              id="session-increment"
              onClick={() => this.handleLengthChange("session", 1)}
            >
              ↑
            </button>
          </div>
        </div>

        <div className="timer">
          <h2 id="timer-label">{timerLabel}</h2>
          <div id="time-left">{this.formatTime(timeLeft)}</div>
        </div>

        <div className="timer-controls">
          <button id="start_stop" onClick={this.handleStartStop}>
            {isRunning ? "⏸" : "▶"}
          </button>
          <button id="reset" onClick={this.handleReset}>
            ⟳
          </button>
        </div>

        <audio
          id="beep"
          ref={this.audioRef}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

//React Parent Component
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Clock />
      </>
    );
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
