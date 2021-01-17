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

    console.log(pose);
    return pose;
  }

  export default getPose;