import '../audio/beep.mp3';
import '../audio/buzz.mp3';
import '../audio/ding.mp3';

import * as tfjs from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { ScatterGL } from 'scatter-gl';

const TOLERANCE = 3;
const PREDICTION_POLL_DELAY = 250;
const MAXTIME = 3000;

var waitTime = 0;

/*
 *  Calculates Euclidean distance between two 3D vectors
 */
const calcDistance = (lower, upper) => {
    let cummulative = 0;
    for(let i=0; i<3; i++){
        cummulative += (lower[i] - upper[i]) * (lower[i] - upper[i]);
    }
    return Math.sqrt(cummulative);
}

/*
 *  Handle predictions from the model.
 */
const handlePredictions = async (model, video, scatterGL) => {
  if(waitTime >= MAXTIME) {
    close();
  }
  if (MAXTIME - waitTime <= 1000) {
    var audio = new Audio('one.mp3');
    audio.play();
  }
  const facePredictions = await model.estimateFaces({ input: video });
  renderMesh(facePredictions, scatterGL);

  const lefteyeupper = facePredictions[0].annotations.leftEyeUpper0[3];
  const lefteyelower = facePredictions[0].annotations.leftEyeLower0[4];
  const righteyeupper = facePredictions[0].annotations.rightEyeUpper0[3];
  const righteyelower = facePredictions[0].annotations.rightEyeLower0[4];

  console.log('dist:', calcDistance(lefteyelower, lefteyeupper), calcDistance(righteyelower, righteyeupper))
  if(calcDistance(lefteyelower, lefteyeupper) < TOLERANCE && calcDistance(righteyelower, righteyeupper) < TOLERANCE){
    waitTime += 500;
    if(waitTime % 1000 == 0 && waitTime < MAXTIME){
      let timerTag = document.getElementsByTagName('p');
      timerTag[0].textContent = "Time: " + (waitTime / 1000).toString() + 's';
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
    timerTag[0].textContent = "Time: 20s";
    var audio = new Audio('ding.mp3');
    audio.play();
    await sleep(500);
    close();
  }
}

/*
 * Renders the prediction as a mesh
 */
const renderMesh = (predictions, scatterGL) => {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 *  Callback once video is loaded
 */ 
const onVideoLoad = (video, model, scatterGL) => {
  return setInterval(() => handlePredictions(model, video, scatterGL) , PREDICTION_POLL_DELAY);
}


/*
 *  Initialize the webcam video playback.
 */
const initVideoContainer = (model, scatterGL) => {
  const video = document.getElementById('video-container');
  video.autoplay = true;
  video.loop = true;
  video.addEventListener('loadeddata', () => onVideoLoad(video, model, scatterGL), false);
  return video;
}

/*
 *  Initialize the ScatterGL container.
 */
const initScatterGLContainer = () => {
  const scatterGLContainer = document.getElementById('scatter-gl-container');
  const scatterGL = new ScatterGL(scatterGLContainer, {'rotateOnStart': false, 'selectEnabled': false});
  return scatterGL;
}

const main = async () => {
  let timerTag = document.getElementsByTagName('p');
  timerTag[0].textContent = "Time: 0s";
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
  const webcamStream = await window.navigator.mediaDevices.getUserMedia({ video: true });
  
  const scatterGL = initScatterGLContainer();
  const video = initVideoContainer(model, scatterGL);
  video.srcObject = webcamStream;
  video.load();
}

main();
