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

let posenet;
let video;
let canvas;

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


const isEyeCheck = () =>{
  return false;
}

const isStretchCheck = () =>{
  return true;
}




const main = async () => {
  if(isStretchCheck()){
    let header = document.getElementsByTagName('h1');
    header[0].textContent = "Take a break for 20 seconds, stretch with your arms above your head!";
    document.getElementById('scatter-gl-container').style = 'display:none';
    let timerTag = document.getElementsByTagName('p');
    timerTag[0].textContent = "Time: 0s";
  }
  else{
    let timerTag = document.getElementsByTagName('p');
    timerTag[0].textContent = "Time: 0s";
  }
  
  const webcamStream = await window.navigator.mediaDevices.getUserMedia({ video: true });
  if(isEyeCheck()){
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    const video = initVideoContainer(model, handleCloseEyesPrediction);
    video.srcObject = webcamStream;
    video.load();
  }
  else if(isStretchCheck()){
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
    let counter = 0;
    let waitTime = 0;
    while(counter < 24){
      if(counter < 4){
        await sleep(1000);
        counter++;
        continue;
      }
      else{
        await sleep(1000);
        var audio = new Audio('beep.mp3');
        audio.play();
        waitTime++;
        counter++;
        let timerTag = document.getElementsByTagName('p');
        timerTag[0].textContent = waitTime.toString() + " seconds";
      }
    }
    var audio = new Audio('ding.mp3');
    audio.play();
    await sleep(500);
    close();
  }
}

main();
