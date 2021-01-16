import '../img/icon-128.png'
import '../img/icon-34.png'
import * as tfjs from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

/*
 * Test function for loading tensorflow 
 */ 
const loadFaces = async () => {
  // Load the faceLandmarksDetection model assets.
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

  // Pass in a video stream to the model to obtain an array of detected faces from the MediaPipe graph.
  // For Node users, the `estimateFaces` API also accepts a `tf.Tensor3D`, or an ImageData object.
  const video = window.document.querySelector("video");
  const faces = await model.estimateFaces({ input: video });
}


// Listen for messages
chrome.runtime.onMessage.addListener(receiver);

// Callback for when a message is received
function receiver(request, sender, sendResponse) {
  if (request.message === "user clicked!") {
    // Do something!
    console.log(request.message);
  }
  if (request.message === "Alarm"){
    console.log("Alarm went off");
  }
}