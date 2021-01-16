import * as tfjs from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const PREDICTION_POLL_DELAY = 500;

/*
 *  Get predictions from the model.
 */
const getPredictions = async (model, video) => {
  const facePredictions = await model.estimateFaces({ input: video });
  console.log(facePredictions);
  return facePredictions;
}


/*
 *  Callback once video is loaded
 */ 
const onVideoLoad = (video, model) => {
  return setInterval(() => getPredictions(model, video) , PREDICTION_POLL_DELAY);
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
