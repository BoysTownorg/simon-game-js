import * as simonJsPsychPlugins from "../plugin.js";
import * as jsPsychUtility from "../utility.js";
import * as coloredCircles from "../colored-circles.js";

const simonPluginId = "simon-game-colored-circles";
jsPsych.plugins[simonPluginId] = simonJsPsychPlugins.coloredCircles(
  coloredCircles.orderMap()
);
const timeline = [];
jsPsychUtility.pushSingleInput(
  timeline,
  "Participant ID number: ",
  "participant_id"
);
jsPsychUtility.pushContinueButtonResponse(timeline, [
  "You will see patterns of colored circles shown on the screen in different places, one at a time. After watching each pattern, you must correctly copy it by pressing the place/color where you saw it.",
  'When you finish copying each pattern, press the "Done" button and then the next pattern will be shown.',
  'For example, if you see the pattern BLUE-RED-GREEN, then you should press the colors blue, red, green in that order, and then press "Done" at the bottom.',
  "If you don't know or can't remember what a pattern was, just make your best guess. Once you make a response, you cannot go back and correct it, so take your time in choosing the correct colors.",
  "Watch me!",
]);
const firstTrial = {
  type: simonPluginId,
  colors: coloredCircles.firstTrialSequence(),
};
timeline.push(firstTrial);
jsPsychUtility.pushConditionalTrial(
  timeline,
  firstTrial,
  jsPsychUtility.lastTrialIncorrect
);
jsPsychUtility.pushConditionalContinueButtonResponse(
  timeline,
  ["Now it's your turn!"],
  jsPsychUtility.lastTrialCorrect
);
const secondTrial = {
  type: simonPluginId,
  colors: coloredCircles.secondTrialSequence(),
};
jsPsychUtility.pushConditionalTrial(
  timeline,
  secondTrial,
  jsPsychUtility.allEvaluatedTrialsCorrect
);
jsPsychUtility.pushConditionalContinueButtonResponse(
  timeline,
  ["Good job!", "Do you have any questions?"],
  jsPsychUtility.allEvaluatedTrialsCorrect
);
jsPsychUtility.pushBlockTrials(timeline, simonPluginId);
fetch("final-screen-text.txt")
  .then((p) => p.text())
  .then((text) => {
    jsPsychUtility.pushContinueButtonResponse(timeline, [text]);
    jsPsych.init({
      timeline: timeline,
    });
  });
