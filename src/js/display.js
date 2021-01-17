import * as tfjs from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { drawKeyPoints, drawSkeleton } from "./utils";
import * as poseNet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl";

import '../audio/beep.mp3';
import '../audio/buzz.mp3';
import '../audio/ding.mp3';
import handleCloseEyesPrediction from './display/closeEyes';
import { PREDICTION_POLL_DELAY } from './display/config';

import getPose from './display/stretch';

/*
 *  Callback once video is loaded
 */ 
const onVideoLoad = (video, model, predictor) => {
  return setInterval(() => predictor(model, video) , PREDICTION_POLL_DELAY);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 *  Initialize the webcam video playback.
 */
const initVideoContainer = (model, predictor) => {
  const video = document.getElementById('video-container');
  video.autoplay = true;
  video.loop = true;
  video.addEventListener('loadeddata', () => onVideoLoad(video, model, predictor), false);
  return video;
}

const main = async () => {
  const activities = [];
  chrome.storage.sync.get(['activities'], async (res) => {
    activities.push(...Object.entries(res.activities).filter(([activity, isActive]) => activity && isActive));
    const currActivity = activities[Math.floor((Math.random() * activities.length))][0];

    if (currActivity === 'stretch') {
      let header = document.getElementById('title');
      header.textContent = "Take a break for 20 seconds, stretch with your arms above your head!";
      document.getElementById('scatter-gl-container').style = 'display:none';
      let timerTag = document.getElementById('timer');
      timerTag.textContent = "0 seconds";
    } else {
      let timerTag = document.getElementById('timer');
      timerTag.textContent = "0 seconds"
    }

    const webcamStream = await window.navigator.mediaDevices.getUserMedia({ video: true });
    if (currActivity === 'stretch') {
      let posenet;
      try {
        posenet = await poseNet.load({
          architecture: "ResNet50",
          outputStride: 32,
          inputResolution: { width: 250, height: 250 },
          quantBytes: 2,
          multiplier: 1,
        });

      } catch (error) {
        throw new Error("PoseNet failed to load");
      }
      const video = initVideoContainer(posenet, getPose);
      video.srcObject = webcamStream;
      video.load();
    } else {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
      const video = initVideoContainer(model, handleCloseEyesPrediction);
      video.srcObject = webcamStream;
      video.load();
    }
  });
}

main();
