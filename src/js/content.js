import '../img/icon-128.png'
import '../img/icon-34.png'

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