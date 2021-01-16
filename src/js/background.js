import '../img/icon-128.png';
import '../img/icon-34.png';
import * as tfjs from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const loadFaces = async () => {
  // Load the faceLandmarksDetection model assets.
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

  // Pass in a video stream to the model to obtain an array of detected faces from the MediaPipe graph.
  // For Node users, the `estimateFaces` API also accepts a `tf.Tensor3D`, or an ImageData object.
  const video = window.document.querySelector("video");
  const faces = await model.estimateFaces({ input: video });
}

loadFaces();

chrome.alarms.onAlarm.addListener(buttonClicked);

// chrome.alarms.onAlarm.addListener(function(alarm) {
//   //alert("Beep");
//   console.log("hello");
// });


function buttonClicked(alarm){
    alert("Beep");
}
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, msg);
// }

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"});
// });
