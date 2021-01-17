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
const getVideo = () => {
  video = document.getElementById('video-container');
};


const getPose= async () => {
  const flipHorizontal = true;

  const posenetModel = posenet;

  const findPoseDetectionFrame = async () => {
    let poses = [];

    const pose = await posenetModel.estimateSinglePose(video, {
      flipHorizontal,
    });

    poses.push(pose);

    return poses;
  };
  return await findPoseDetectionFrame();
}


const isEyeCheck = () =>{
  return false;
}

const isStretchCheck = () =>{
  return true;
}
const main = async () => {
  let timerTag = document.getElementsByTagName('p');
  timerTag[0].textContent = "Time: 0s";
  if(isEyeCheck()){
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    const webcamStream = await window.navigator.mediaDevices.getUserMedia({ video: true });
    const video = initVideoContainer(model);
    video.srcObject = webcamStream;
    video.load();
  }
  else if(isStretchCheck()){
    console.log('1')
    try {
    console.log('2')

      posenet = await poseNet.load({
        architecture: "ResNet50",
        outputStride: 32,
        inputResolution: { width: 250, height: 250 },
        quantBytes: 2,
        multiplier: 1,
      });
    console.log('3')

    } catch (error) {
      throw new Error("PoseNet failed to load");
    }
    console.log('4')
    getVideo();
    console.log('5')

    const pose = await getPose();
    
    console.log(pose)
  }
}

main();
