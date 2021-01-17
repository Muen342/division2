import { MAXTIME, TOLERANCE, PREDICTION_POLL_DELAY } from "./config";

var waitTime = 0;


const isValid = (pose)=>{
    return true;
}
const getPose= async (posenetModel, video) => {
    if(waitTime >= MAXTIME) {
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
  
    // if(isValid(pose)){
    //     waitTime += PREDICTION_POLL_DELAY;
    //     if(waitTime % 1000 == 0 && waitTime < MAXTIME){
    //       let timerTag = document.getElementsByTagName('p');
    //       timerTag[0].textContent = "Time: " + (waitTime / 1000).toString() + 's';
    //       var audio = new Audio('beep.mp3');
    //       audio.play();
    //     }
    //     console.log('NICE CLOSED EYES', eyes)
    //   } else {
    //     if(waitTime != 0){
    //       let timerTag = document.getElementsByTagName('p');
    //       timerTag[0].textContent = "Time: 0s";
    //       var audio = new Audio('buzz.mp3');
    //       audio.play();
    //       console.log('open', eyes)
    //       waitTime = 0;
    //     }
    //   }
    
    //   if(waitTime >= MAXTIME){
    //     let timerTag = document.getElementsByTagName('p');
    //     timerTag[0].textContent = "Time: " + (MAXTIME / 1000).toString + 's';
    //     var audio = new Audio('ding.mp3');
    //     audio.play();
    //     await sleep(500);
    //     close();
    //   }
    console.log(pose);
    return pose;
  }

  export default getPose;