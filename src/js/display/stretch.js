import { MAXTIME, TOLERANCE, PREDICTION_POLL_DELAY } from "./config";

var waitTime = 0;


const getPose= async (posenetModel, video) => {
  if(waitTime >= MAXTIME){
    let timerTag = document.getElementById('timer');
    timerTag.textContent = (MAXTIME / 1000).toString() + ' seconds';
    var audio = new Audio('ding.mp3');
    audio.play();
    close();
  }
    const flipHorizontal = true;
  
    const findPoseDetectionFrame = async () => {
      let poses = [];
  
      const pose = await posenetModel.estimateSinglePose(video, {
        flipHorizontal,
      });
  
      poses.push(pose);
  
      return poses;
    };
    let pose = await findPoseDetectionFrame();
    if(pose[0].keypoints[9].score >0.5 && pose[0].keypoints[10].score > 0.5){
      waitTime += PREDICTION_POLL_DELAY;
      if(waitTime % 1000 == 0 && waitTime < MAXTIME){
        let timerTag = document.getElementById('timer');
        if ((waitTime/1000).toString() == '1'){
          timerTag.textContent = (waitTime / 1000).toString() + " second";
        }
        else{
          timerTag.textContent = (waitTime / 1000).toString() + " seconds";
        }
        var audio = new Audio('beep.mp3');
        audio.play();
      }
    } else {
      if(waitTime != 0){
        waitTime = 0;
        let timerTag = document.getElementById('timer');
        timerTag.textContent = "0 seconds";
        var audio = new Audio('buzz.mp3');
        audio.play();
      }
    }
    console.log(pose);
    return pose;
  }

  export default getPose;