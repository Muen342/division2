import * as tfjs from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

import '../audio/beep.mp3';
import '../audio/buzz.mp3';
import '../audio/ding.mp3';
import handleCloseEyesPrediction from './display/closeEyes';
import { PREDICTION_POLL_DELAY } from './display/config';

/*
 *  Callback once video is loaded
 */ 
const onVideoLoad = (video, model) => {
  return setInterval(() => handleCloseEyesPrediction(model, video) , PREDICTION_POLL_DELAY);
}


/*
 *  Initialize the webcam video playback.
 */
const initVideoContainer = (model) => {
  const video = document.getElementById('video-container');
  video.autoplay = true;
  video.loop = true;
  video.addEventListener('loadeddata', () => onVideoLoad(video, model), false);
  return video;
}

const main = async () => {
  let timerTag = document.getElementsByTagName('p');
  timerTag[0].textContent = "Time: 0s";
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
  const webcamStream = await window.navigator.mediaDevices.getUserMedia({ video: true });
  
  const video = initVideoContainer(model);
  video.srcObject = webcamStream;
  video.load();
}

main();
