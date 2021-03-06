import * as simon from "./Color.js";

class YellowToneResponder {
  playCorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playCorrectYellowTone(durationMilliseconds);
  }

  playIncorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playIncorrectYellowTone(durationMilliseconds);
  }
}

class GreenToneResponder {
  playCorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playCorrectGreenTone(durationMilliseconds);
  }

  playIncorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playIncorrectGreenTone(durationMilliseconds);
  }
}

class RedToneResponder {
  playCorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playCorrectRedTone(durationMilliseconds);
  }

  playIncorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playIncorrectRedTone(durationMilliseconds);
  }
}

class BlueToneResponder {
  playCorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playCorrectBlueTone(durationMilliseconds);
  }

  playIncorrectTone(audioPlayer, durationMilliseconds) {
    audioPlayer.playIncorrectBlueTone(durationMilliseconds);
  }
}

class NothingToneResponder {
  playCorrectTone(audioPlayer, durationMilliseconds) {}

  playIncorrectTone(audioPlayer, durationMilliseconds) {}
}

function toneResponder(color) {
  switch (color) {
    case simon.Color.red:
      return new RedToneResponder();
    case simon.Color.blue:
      return new BlueToneResponder();
    case simon.Color.green:
      return new GreenToneResponder();
    case simon.Color.yellow:
      return new YellowToneResponder();
    default:
      return new NothingToneResponder();
  }
}

function pushTimedEvent(a, timer, id) {
  a.push({
    milliseconds: timer.milliseconds(),
    id,
  });
}

function playNextEvaluatedTone(
  audioPlayer,
  timer,
  durationMilliseconds,
  correctColors,
  color,
  trialEvaluation
) {
  if (audioPlayer.playing()) {
    return;
  }
  pushTimedEvent(trialEvaluation.responses, timer, color);
  if (correctColors.shift() === color) {
    toneResponder(color).playCorrectTone(audioPlayer, durationMilliseconds);
  } else {
    toneResponder(color).playIncorrectTone(audioPlayer, durationMilliseconds);
    trialEvaluation.correct = false;
  }
}

function turnOnRedButtonLight(screen) {
  screen.turnOnRedButtonLight();
}

function turnOnGreenButtonLight(screen) {
  screen.turnOnGreenButtonLight();
}

function turnOnBlueButtonLight(screen) {
  screen.turnOnBlueButtonLight();
}

function turnOnYellowButtonLight(screen) {
  screen.turnOnYellowButtonLight();
}

function darkenBlueButton(screen) {
  screen.darkenBlueButton();
}

function darkenYellowButton(screen) {
  screen.darkenYellowButton();
}

function darkenGreenButton(screen) {
  screen.darkenGreenButton();
}

function darkenRedButton(screen) {
  screen.darkenRedButton();
}

function undarkenBlueButton(screen) {
  screen.undarkenBlueButton();
}

function undarkenYellowButton(screen) {
  screen.undarkenYellowButton();
}

function undarkenGreenButton(screen) {
  screen.undarkenGreenButton();
}

function undarkenRedButton(screen) {
  screen.undarkenRedButton();
}

function pushSimonToneToTrialEvaluation(trialEvaluation, timer, color) {
  pushTimedEvent(trialEvaluation.simon, timer, color);
}

export class Simon {
  constructor(audioPlayer, screen, trial, timer) {
    this.audioPlayer = audioPlayer;
    this.screen = screen;
    this.trial = trial;
    this.timer = timer;
    this.trialEvaluation = { correct: false, responses: [], simon: [] };
    this.colors = [];
    this.audioPlayer.subscribe(this);
  }

  say(colors) {
    this.colors = colors;
    this.trialEvaluation.correct = true;
    this.audioPlayer.play(
      this.colors.slice(),
      this.longToneDurationMilliseconds,
      this.toneOffsetToNextOnsetDurationMilliseconds
    );
  }

  enterYellow() {
    playNextEvaluatedTone(
      this.audioPlayer,
      this.timer,
      this.shortToneDurationMilliseconds,
      this.colors,
      simon.Color.yellow,
      this.trialEvaluation
    );
  }

  enterRed() {
    playNextEvaluatedTone(
      this.audioPlayer,
      this.timer,
      this.shortToneDurationMilliseconds,
      this.colors,
      simon.Color.red,
      this.trialEvaluation
    );
  }

  enterGreen() {
    playNextEvaluatedTone(
      this.audioPlayer,
      this.timer,
      this.shortToneDurationMilliseconds,
      this.colors,
      simon.Color.green,
      this.trialEvaluation
    );
  }

  enterBlue() {
    playNextEvaluatedTone(
      this.audioPlayer,
      this.timer,
      this.shortToneDurationMilliseconds,
      this.colors,
      simon.Color.blue,
      this.trialEvaluation
    );
  }

  setLongToneDurationMilliseconds(x) {
    this.longToneDurationMilliseconds = x;
  }

  setToneOffsetToNextOnsetDurationMilliseconds(x) {
    this.toneOffsetToNextOnsetDurationMilliseconds = x;
  }

  setShortToneDurationMilliseconds(x) {
    this.shortToneDurationMilliseconds = x;
  }

  submit() {
    this.screen.clear();
    if (this.colors.length !== 0) {
      this.trialEvaluation.correct = false;
    }
    this.trial.conclude(this.trialEvaluation);
    this.trialEvaluation.responses = [];
    this.trialEvaluation.simon = [];
  }

  notifyThatRedToneStarted() {
    turnOnRedButtonLight(this.screen);
    pushSimonToneToTrialEvaluation(
      this.trialEvaluation,
      this.timer,
      simon.Color.red
    );
  }

  notifyThatRedToneEnded() {
    this.screen.turnOffRedButtonLight();
  }

  notifyThatGreenToneStarted() {
    turnOnGreenButtonLight(this.screen);
    pushSimonToneToTrialEvaluation(
      this.trialEvaluation,
      this.timer,
      simon.Color.green
    );
  }

  notifyThatGreenToneEnded() {
    this.screen.turnOffGreenButtonLight();
  }

  notifyThatBlueToneStarted() {
    turnOnBlueButtonLight(this.screen);
    pushSimonToneToTrialEvaluation(
      this.trialEvaluation,
      this.timer,
      simon.Color.blue
    );
  }

  notifyThatBlueToneEnded() {
    this.screen.turnOffBlueButtonLight();
  }

  notifyThatYellowToneStarted() {
    turnOnYellowButtonLight(this.screen);
    pushSimonToneToTrialEvaluation(
      this.trialEvaluation,
      this.timer,
      simon.Color.yellow
    );
  }

  notifyThatYellowToneEnded() {
    this.screen.turnOffYellowButtonLight();
  }

  notifyThatToneSeriesEnded() {
    turnOnBlueButtonLight(this.screen);
    turnOnGreenButtonLight(this.screen);
    turnOnRedButtonLight(this.screen);
    turnOnYellowButtonLight(this.screen);
    this.screen.showDoneButton();
  }

  notifyThatCorrectBlueToneStarted() {
    darkenBlueButton(this.screen);
  }

  notifyThatCorrectBlueToneEnded() {
    undarkenBlueButton(this.screen);
  }

  notifyThatCorrectRedToneStarted() {
    darkenRedButton(this.screen);
  }

  notifyThatCorrectRedToneEnded() {
    undarkenRedButton(this.screen);
  }

  notifyThatCorrectGreenToneStarted() {
    darkenGreenButton(this.screen);
  }

  notifyThatCorrectGreenToneEnded() {
    undarkenGreenButton(this.screen);
  }

  notifyThatCorrectYellowToneStarted() {
    darkenYellowButton(this.screen);
  }

  notifyThatCorrectYellowToneEnded() {
    undarkenYellowButton(this.screen);
  }

  notifyThatIncorrectBlueToneStarted() {
    darkenBlueButton(this.screen);
  }

  notifyThatIncorrectBlueToneEnded() {
    undarkenBlueButton(this.screen);
  }

  notifyThatIncorrectRedToneStarted() {
    darkenRedButton(this.screen);
  }

  notifyThatIncorrectRedToneEnded() {
    undarkenRedButton(this.screen);
  }

  notifyThatIncorrectGreenToneStarted() {
    darkenGreenButton(this.screen);
  }

  notifyThatIncorrectGreenToneEnded() {
    undarkenGreenButton(this.screen);
  }

  notifyThatIncorrectYellowToneStarted() {
    darkenYellowButton(this.screen);
  }

  notifyThatIncorrectYellowToneEnded() {
    undarkenYellowButton(this.screen);
  }

  notifyThatTrialHasCompleted() {
    this.screen.clear();
  }
}
