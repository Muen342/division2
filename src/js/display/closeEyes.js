import { ScatterGL } from 'scatter-gl';
import { MAXTIME, TOLERANCE, PREDICTION_POLL_DELAY } from "./config";

const scatterGL = new ScatterGL(
  document.getElementById('scatter-gl-container'),
  {'rotateOnStart': false, 'selectEnabled': false}
);

var waitTime = 0;

/*
 *  Calculates Euclidean distance between two 3D vectors.
 */
const calcDistance = (lower, upper) => {
  let cummulative = 0;
  for(let i=0; i<3; i++){
      cummulative += (lower[i] - upper[i]) * (lower[i] - upper[i]);
  }
  return Math.sqrt(cummulative);
}

/*
 *  Handle predictions from the face landmarks model.
 */
const handlePredictions = async (model, video) => {
  if(waitTime >= MAXTIME) {
    close();
  }
  if (MAXTIME - waitTime <= 1000) {
    var audio = new Audio('one.mp3');
    audio.play();
  }
  const facePredictions = await model.estimateFaces({ input: video });
  renderScatterGLMesh(facePredictions);

  const lefteyeupper = facePredictions[0].annotations.leftEyeUpper0[3];
  const lefteyelower = facePredictions[0].annotations.leftEyeLower0[4];
  const righteyeupper = facePredictions[0].annotations.rightEyeUpper0[3];
  const righteyelower = facePredictions[0].annotations.rightEyeLower0[4];

  console.log('dist:', calcDistance(lefteyelower, lefteyeupper), calcDistance(righteyelower, righteyeupper))
  if(calcDistance(lefteyelower, lefteyeupper) < TOLERANCE && calcDistance(righteyelower, righteyeupper) < TOLERANCE){
    waitTime += PREDICTION_POLL_DELAY;
    if(waitTime % 1000 == 0 && waitTime < MAXTIME){
      let timerTag = document.getElementById('timer');
      timerTag.textContent = (waitTime / 1000).toString() + " seconds";
      var audio = new Audio('beep.mp3');
      audio.play();
    }
    console.log('NICE CLOSED EYES', eyes)
  } else {
    if(waitTime != 0){
      let timerTag = document.getElementsByTagName('p');
      timerTag[0].textContent = "Time: 0s";
      var audio = new Audio('buzz.mp3');
      audio.play();
      console.log('open', eyes)
      waitTime = 0;
    }
  }

  if(waitTime >= MAXTIME){
    let timerTag = document.getElementsByTagName('p');
    timerTag[0].textContent = "Time: " + (MAXTIME / 1000).toString + 's';
    var audio = new Audio('ding.mp3');
    audio.play();
    await sleep(500);
    close();
  }
}

/*
 * Renders the prediction as a mesh
 */
const renderScatterGLMesh = (predictions) => {
  const pointsData = predictions.map(prediction => {
    let scaledMesh = prediction.scaledMesh;
    return scaledMesh.map(point => ([-point[0], -point[1], -point[2]]));
  });

  let flattenedPointsData = [];
  for (let i = 0; i < pointsData.length; i++) {
    flattenedPointsData = flattenedPointsData.concat(pointsData[i]);
  }
  const dataset = new ScatterGL.Dataset(flattenedPointsData);
  scatterGL.render(dataset);
}

export default handlePredictions;
