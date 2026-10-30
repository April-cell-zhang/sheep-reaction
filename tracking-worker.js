(async()=>{
const {HandLandmarker,FilesetResolver}=await import('./vendor/vision_bundle.mjs');
let detector;
try{
 const files=await FilesetResolver.forVisionTasks('./vendor/wasm');
 detector=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'./vendor/hand_landmarker.task'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.55,minTrackingConfidence:.55});
 self.postMessage({type:'ready'});
}catch(e){self.postMessage({type:'error',message:e.message});}
self.onmessage=({data})=>{try{const result=detector.detectForVideo(data.bitmap,data.now);self.postMessage({type:'result',result:{landmarks:result.landmarks,worldLandmarks:result.worldLandmarks},generation:data.generation});}catch(e){self.postMessage({type:'error',message:e.message});}finally{data.bitmap.close();}};

})();