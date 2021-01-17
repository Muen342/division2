import '../audio/beep.mp3';
import '../audio/buzz.mp3';
import '../audio/ding.mp3';

import * as tfjs from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
const TOLERANCE = 3;
const PREDICTION_POLL_DELAY = 500;
const MAXTIME = 3000;
var waitTime = 0;

const calcDistance = (lower, upper) => {
    let cummulative = 0;
    for(let i=0; i<3; i++){
        cummulative += (lower[i] - upper[i]) * (lower[i] - upper[i]);
    }
    return Math.sqrt(cummulative);
}

/*
 *  Get predictions from the model.
 */
const handlePredictions = async (model, video) => {
  const facePredictions = await model.estimateFaces({ input: video });
  const lefteyeupper = facePredictions[0].annotations.leftEyeUpper0[3];
  const lefteyelower = facePredictions[0].annotations.leftEyeLower0[4];
  const righteyeupper = facePredictions[0].annotations.rightEyeUpper0[3];
  const righteyelower = facePredictions[0].annotations.rightEyeLower0[4];

  const eyes = {lefteyeupper, lefteyelower, righteyeupper, righteyelower}
  console.log('dist:', calcDistance(lefteyelower, lefteyeupper), calcDistance(righteyelower, righteyeupper))
  console.log('waittime', waitTime)
  if(calcDistance(lefteyelower, lefteyeupper) < TOLERANCE && calcDistance(righteyelower, righteyeupper) < TOLERANCE){
    waitTime += 500;
    if(waitTime % 1000 == 0 && waitTime < MAXTIME){
      var audio = new Audio('beep.mp3');
      audio.play();
    }
    console.log('NICE CLOSED EYES', eyes)
  }
  else{
    var audio = new Audio('buzz.mp3');
    audio.play();
    console.log('open', eyes)
    waitTime = 0;
  }

  if(waitTime >= MAXTIME){
    var audio = new Audio('ding.mp3');
    audio.play();
    close();
  }
}


/*
 *  Callback once video is loaded
 */ 
const onVideoLoad = (video, model) => {
  return setInterval(() => handlePredictions(model, video) , PREDICTION_POLL_DELAY);
}


/*
 *  Initialize the DOM video playback.
 */
const initVideoContainer = (model) => {
  const video = document.getElementById('recording');
  video.autoplay = true;
  video.loop = true;
  video.addEventListener('loadeddata', () => onVideoLoad(video, model), false);
  return video;
}

/*
 *  Initialize the media recorder. DEPRECATED.
 */
const initMediaRecorder = (stream, video) => {
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  mediaRecorder.ondataavailable = async (e) => {
    video.src = URL.createObjectURL(e.data);
    video.load();
  };
  return mediaRecorder;
}

const main = async () => {
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

  const webcamStream = await window.navigator.mediaDevices.getUserMedia({ video: true });
  const video = initVideoContainer(model);
  video.srcObject = webcamStream;
  video.load();
}

main();
