import * as simon from "../lib/Simon.js";
import * as simon from "../lib/AudioPlayer.js";
import * as simon from "../lib/ScreenPresenter.js";
import * as simon from "../lib/ScreenResponder.js";
import * as simon from "../lib/Color.js";

function audioGain() {
  return 0;
}

function addClickEventListener(button, f) {
  button.addEventListener("mousedown", f);
}

function element() {
  return document.createElement("div");
}

function pixelsString(a) {
  return a + "px";
}

function borderedCircleButton() {
  const button = element();
  const diameterPixels = 300;
  const borderWidthPixels = 4;
  button.style.height = pixelsString(diameterPixels);
  button.style.width = pixelsString(diameterPixels);
  button.style.borderRadius = pixelsString(
    diameterPixels / 2 + borderWidthPixels
  );
  button.style.border = pixelsString(borderWidthPixels) + " solid black";
  button.style.margin = pixelsString(20);
  return button;
}

function adopt(parent, child) {
  parent.append(child);
}

function setBackgroundColor(button, color) {
  button.style.backgroundColor = color;
}

function clearBackgroundColor(button) {
  setBackgroundColor(button, "");
}

function darken(button) {
  setBackgroundColor(button, "black");
}

function setBlueBackground(button) {
  setBackgroundColor(button, "blue");
}

function setGreenBackground(button) {
  setBackgroundColor(button, "green");
}

function setYellowBackground(button) {
  setBackgroundColor(button, "yellow");
}

function setRedBackground(button) {
  setBackgroundColor(button, "red");
}

function clear(parent) {
  // https://stackoverflow.com/a/3955238
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

class JsPsychTrial {
  conclude(result) {
    jsPsych.finishTrial(result);
  }
}

class CognitionScreen {
  constructor(parent, colorOrderMap) {
    this.parent = parent;
    this.greenButton = borderedCircleButton();
    this.redButton = borderedCircleButton();
    this.blueButton = borderedCircleButton();
    this.yellowButton = borderedCircleButton();
    const colorButtons = new Array(4);
    colorButtons[colorOrderMap.get(simon.Color.red)] = this.redButton;
    colorButtons[colorOrderMap.get(simon.Color.green)] = this.greenButton;
    colorButtons[colorOrderMap.get(simon.Color.yellow)] = this.yellowButton;
    colorButtons[colorOrderMap.get(simon.Color.blue)] = this.blueButton;
    this.doneButton = element();
    this.doneButton.style.border = "solid";
    this.doneButton.textContent = "Done";
    this.doneButton.style.display = "none";
    const topRow = element();
    topRow.style.display = "inline-flex";
    adopt(parent, topRow);
    adopt(topRow, colorButtons[0]);
    const middleRow = element();
    middleRow.style.display = "flex";
    adopt(parent, middleRow);
    adopt(middleRow, colorButtons[1]);
    const gap = element();
    gap.style.height = "200px";
    gap.style.width = "400px";
    adopt(middleRow, gap);
    adopt(middleRow, colorButtons[2]);
    const bottomRow = element();
    bottomRow.style.display = "inline-flex";
    adopt(parent, bottomRow);
    adopt(bottomRow, colorButtons[3]);
    adopt(parent, this.doneButton);
    addClickEventListener(this.greenButton, (_e) => {
      this.listener.notifyThatGreenWasClicked();
    });
    addClickEventListener(this.redButton, (_e) => {
      this.listener.notifyThatRedWasClicked();
    });
    addClickEventListener(this.blueButton, (_e) => {
      this.listener.notifyThatBlueWasClicked();
    });
    addClickEventListener(this.yellowButton, (_e) => {
      this.listener.notifyThatYellowWasClicked();
    });
    addClickEventListener(this.doneButton, (_e) => {
      this.listener.notifyThatDoneWasClicked();
    });
  }

  subscribe(e) {
    this.listener = e;
  }

  turnOnRedButtonLight() {
    setRedBackground(this.redButton);
  }

  turnOffRedButtonLight() {
    clearBackgroundColor(this.redButton);
  }

  turnOnGreenButtonLight() {
    setGreenBackground(this.greenButton);
  }

  turnOffGreenButtonLight() {
    clearBackgroundColor(this.greenButton);
  }

  turnOnBlueButtonLight() {
    setBlueBackground(this.blueButton);
  }

  turnOffBlueButtonLight() {
    clearBackgroundColor(this.blueButton);
  }

  turnOnYellowButtonLight() {
    setYellowBackground(this.yellowButton);
  }

  turnOffYellowButtonLight() {
    clearBackgroundColor(this.yellowButton);
  }

  darkenBlueButton() {
    darken(this.blueButton);
  }

  undarkenBlueButton() {
    setBlueBackground(this.blueButton);
  }

  darkenRedButton() {
    darken(this.redButton);
  }

  undarkenRedButton() {
    setRedBackground(this.redButton);
  }

  darkenGreenButton() {
    darken(this.greenButton);
  }

  undarkenGreenButton() {
    setGreenBackground(this.greenButton);
  }

  darkenYellowButton() {
    darken(this.yellowButton);
  }

  undarkenYellowButton() {
    setYellowBackground(this.yellowButton);
  }

  showDoneButton() {
    this.doneButton.style.display = "block";
  }

  clear() {
    clear(this.parent);
  }
}

class WebAudioContext {
  constructor() {
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
  }

  currentTimeSeconds() {
    return this.audioContext.currentTime;
  }

  scheduleTone(startTimeSeconds, stopTimeSeconds, frequencyHz, onEnd) {
    // https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.value = frequencyHz;
    oscillator.onended = onEnd;
    const gain = this.audioContext.createGain();
    gain.gain.value = audioGain();
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(startTimeSeconds);
    oscillator.stop(stopTimeSeconds);
  }
}

function toneFrequenciesHz() {
  return new Map([
    [simon.Color.green, 391.995],
    [simon.Color.red, 329.628],
    [simon.Color.yellow, 261.626],
    [simon.Color.blue, 195.998],
  ]);
}

function incorrectToneFrequencyHz() {
  return 48.9994;
}

export function plugin(colorOrderMap) {
  let plugin = {};
  plugin.info = {
    parameters: {
      colors: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        array: true,
      },
    },
  };
  const audioPlayer = new simon.AudioPlayer(
    new WebAudioContext(),
    toneFrequenciesHz(),
    incorrectToneFrequencyHz()
  );
  audioPlayer.setPlayDelaySeconds(0.003);
  const simon = new simon.Simon(audioPlayer, new JsPsychTrial());
  simon.setLongToneDurationMilliseconds(700);
  simon.setShortToneDurationMilliseconds(100);
  simon.setToneOffsetToNextOnsetDurationMilliseconds(700);
  plugin.trial = function (display_element, trial) {
    clear(display_element);
    const screen = new CognitionScreen(display_element, colorOrderMap);
    new simon.ScreenResponder(screen, simon);
    const presenter = new simon.ScreenPresenter(screen);
    audioPlayer.subscribe(presenter);
    simon.subscribe(presenter);
    simon.say(trial.colors);
  };
  return plugin;
}
