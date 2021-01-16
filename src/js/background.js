
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