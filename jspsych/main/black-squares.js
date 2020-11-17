import * as simon from "../../lib/index.js";
import * as simonJsPsychPlugins from "../plugin.js";
import * as jsPsychUtility from "../utility.js";
import * as feedback from "../feedback.js";
import * as blackSquares from "../black-squares.js";

const simonPluginId = "simon-game-black-squares";
jsPsych.plugins[simonPluginId] = simonJsPsychPlugins.blackSquares(
  new Map([
    [simon.Color.red, 0],
    [simon.Color.green, 1],
    [simon.Color.blue, 2],
    [simon.Color.yellow, 3],
  ])
);
const timeline = [];
jsPsychUtility.pushParticipantIdForm(timeline);
jsPsychUtility.pushSpacebarResponse(timeline, [
  blackSquares.instruction11,
  blackSquares.instruction12,
  blackSquares.instruction13,
  blackSquares.instruction14,
  blackSquares.instruction15,
]);
const firstTrial = {
  type: simonPluginId,
  colors: [simon.Color.red, simon.Color.blue, simon.Color.blue],
};
timeline.push(firstTrial);
jsPsychUtility.pushConditionalTrial(
  timeline,
  firstTrial,
  jsPsychUtility.lastTrialIncorrect
);
jsPsychUtility.pushConditionalSpacebarResponse(
  timeline,
  [feedback.afterFirstTrial11, feedback.afterFirstTrial12],
  jsPsychUtility.lastTrialCorrect
);
const secondTrial = {
  type: simonPluginId,
  colors: [simon.Color.green, simon.Color.yellow, simon.Color.green],
};
jsPsychUtility.pushConditionalTrial(
  timeline,
  secondTrial,
  jsPsychUtility.allEvaluatedTrialsCorrect
);
jsPsychUtility.pushConditionalSpacebarResponse(
  timeline,
  [
    feedback.afterSecondTrial1,
    feedback.afterSecondTrial2,
    feedback.afterSecondTrial3,
  ],
  jsPsychUtility.allEvaluatedTrialsCorrect
);
jsPsychUtility.pushBlockTrials(timeline, simonPluginId);
fetch("final-screen-text.txt")
  .then((p) => p.text())
  .then((text) => {
    jsPsychUtility.pushAnyKeyResponse(timeline, [
      text,
      "Press any key to close.",
    ]);
    jsPsych.init({
      timeline,
    });
  });
