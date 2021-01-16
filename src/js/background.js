import '../img/icon-128.png';
import '../img/icon-34.png';

chrome.alarms.onAlarm.addListener(buttonClicked);

function buttonClicked(alarm){
    alert("Beep");
}
