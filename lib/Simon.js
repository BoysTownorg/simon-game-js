import { Color } from "./Color.js";

function lightUpAndPlay(presenter, audioPlayer, color) {
  switch (color) {
    case Color.red:
      presenter.lightUpRed();
      audioPlayer.playRed();
      break;
    case Color.green:
      presenter.lightUpGreen();
      audioPlayer.playGreen();
      break;
    case Color.yellow:
      presenter.lightUpYellow();
      audioPlayer.playYellow();
      break;
    default:
      presenter.lightUpBlue();
      audioPlayer.playBlue();
  }
}

function lightUpAndPlayShiftedColorThenScheduleNotificationAfterMillisecondsIfMoreColors(
  presenter,
  audioPlayer,
  colors,
  timer,
  x
) {
  lightUpAndPlay(presenter, audioPlayer, colors.shift());
  if (colors.length > 0) timer.scheduleNotificationAfterMilliseconds(x);
}

export class Simon {
  constructor(presenter, audioPlayer, timer) {
    this.presenter = presenter;
    this.audioPlayer = audioPlayer;
    this.timer = timer;
    this.timer.subscribe(this);
  }

  notify() {
    lightUpAndPlayShiftedColorThenScheduleNotificationAfterMillisecondsIfMoreColors(
      this.presenter,
      this.audioPlayer,
      this.colors,
      this.timer,
      this.scheduledNotificationTimeMilliseconds_
    );
  }

  say(colors) {
    this.colors = colors;
    this.audioPlayer.play(
      this.colors.slice(),
      this.longToneDurationMilliseconds,
      this.toneOffsetToNextOnsetDurationMilliseconds
    );
    lightUpAndPlayShiftedColorThenScheduleNotificationAfterMillisecondsIfMoreColors(
      this.presenter,
      this.audioPlayer,
      this.colors,
      this.timer,
      this.scheduledNotificationTimeMilliseconds_
    );
  }

  setScheduleNotifactionTimeMilliseconds(x) {
    this.scheduledNotificationTimeMilliseconds_ = x;
  }

  enterYellow() {
    lightUpAndPlay(this.presenter, this.audioPlayer, Color.yellow);
  }

  enterRed() {
    lightUpAndPlay(this.presenter, this.audioPlayer, Color.red);
  }

  enterGreen() {
    lightUpAndPlay(this.presenter, this.audioPlayer, Color.green);
  }

  enterBlue() {
    lightUpAndPlay(this.presenter, this.audioPlayer, Color.blue);
  }

  setLongToneDurationMilliseconds(x) {
    this.longToneDurationMilliseconds = x;
  }

  setToneOffsetToNextOnsetDurationMilliseconds(x) {
    this.toneOffsetToNextOnsetDurationMilliseconds = x;
  }
}