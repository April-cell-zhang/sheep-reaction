export const names=['拇指','食指','中指','无名指','小指'];
const angle=(l,a,b,c)=>{const u=['x','y','z'].map(k=>l[a][k]-l[b][k]),v=['x','y','z'].map(k=>l[c][k]-l[b][k]);return Math.acos(Math.max(-1,Math.min(1,u.reduce((s,x,i)=>s+x*v[i],0)/(Math.hypot(...u)*Math.hypot(...v)||1))));};
export function fingers(l){return [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]].reduce((mask,[a,b,c,d],i)=>{let straight=angle(l,a,b,c)>2.55&&angle(l,b,c,d)>2.55; if(i===0){const dist=(a,b)=>Math.hypot(l[a].x-l[b].x,l[a].y-l[b].y,l[a].z-l[b].z);straight=straight&&dist(4,17)>dist(3,17)*1.08;} return mask|(straight?1<<i:0);},0);}
export function handFeatures(l){const dist=(a,b)=>Math.hypot(l[a].x-l[b].x,l[a].y-l[b].y,l[a].z-l[b].z),scale=Math.max(.00001,dist(5,17));return [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]].map(([a,b,c,d],i)=>[angle(l,a,b,c)/Math.PI,angle(l,b,c,d)/Math.PI,dist(d,0)/scale*.3, i===0?dist(4,17)/scale*.5:0]);}
export function learnHand(closed,opened){const avg=frames=>frames[0].map((_,i)=>frames[0][i].map((_,j)=>frames.reduce((sum,f)=>sum+f[i][j],0)/frames.length));if(closed.length<8||opened.length<8)throw Error('采样不足，请保持整只手入镜后重试');const c=avg(closed),o=avg(opened);for(let i=0;i<5;i++)if(o[i].reduce((v,x,j)=>v+(x-c[i][j])**2,0)<.025)throw Error(names[i]+'开合差异不足，请重新校准');return {closed:c,opened:o};}
// Per-finger hysteresis: keep a finger's state through small angle fluctuations.
export class FingerFilter {
 constructor(){this.templates=null;this.reset();}
 reset(){this.mask=0;this.candidates=Array(5).fill(false);this.since=Array(5).fill(0);}
 update(l,now){const chains=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]];
 const dist=(a,b)=>Math.hypot(l[a].x-l[b].x,l[a].y-l[b].y,l[a].z-l[b].z);
 const features=this.templates?handFeatures(l):null;chains.forEach(([a,b,c,d],i)=>{const was=!!(this.mask&(1<<i));const bend=(angle(l,a,b,c)+angle(l,b,c,d))/2;let next=bend>(was?2.12:2.48);
 // Thumb base naturally bends sideways: use its IP joint, not the saddle joint average.
 if(i===0)next=angle(l,2,3,4)>(was?2.05:2.42)&&dist(4,17)/Math.max(.00001,dist(3,17))>(was?1.00:1.055);
 if(this.templates){const c=this.templates.closed[i],o=this.templates.opened[i],axis=o.map((x,j)=>x-c[j]),den=axis.reduce((v,x)=>v+x*x,0);const progress=features[i].reduce((v,x,j)=>v+(x-c[j])*axis[j],0)/den;next=progress>(i===0?(was?.28:.62):(was?.42:.58));}
 if(next!==this.candidates[i]){this.candidates[i]=next;this.since[i]=now;}
 if(now-this.since[i]>=(i===0?(next?40:80):65)){if(next)this.mask|=1<<i;else this.mask&=~(1<<i);}});return this.mask;}
}
export function petalPose(phase,target,mask,i){const playing=phase!=='idle';return {lit:playing&&!!(target&(1<<i)),angle:mask===null?.65:(mask&(1<<i)?1.38:.3)};}
export const STAGES=[{name:'初级',title:'六十老伯慢悠悠',limit:3000,max:1},{name:'中级',title:'上班迟到小青年',limit:1800,max:2},{name:'高级',title:'羊都没你手快',limit:1100,max:5}];
export class Challenge{
 constructor(random=Math.random){this.random=random;this.stageIndex=0;this.totalQuestions=10;this.phase='idle';this.mask=null;this.changed=0;this.score=0;this.round=0;this.correct=0;this.totalRT=0;this.target=0;this.message='开启摄像头后，点击开始挑战';}
 selectStage(index){if(!Number.isInteger(index)||index<0||index>=STAGES.length)throw Error("无效关卡");this.stageIndex=index;this.phase="idle";this.target=0;this.round=0;this.correct=0;this.score=0;this.totalRT=0;this.history=[];this.message="选择完成，点击开始挑战";}
 nextStage(now){if(this.phase!=="finished"||this.stageIndex>=2)return false;this.stageIndex++;this.start(now);return true;}
 start(now){this.questionBag=[];this.bagLevel=0;this.previousTarget=null;this.level=1;this.score=0;this.round=0;this.correct=0;this.totalRT=0;this.history=[];this.prepare(now);}
 drawTarget(){const max=STAGES[this.stageIndex].max;if(this.bagLevel!==this.level||!this.questionBag?.length){this.bagLevel=this.level;this.questionBag=Array.from({length:31},(_,i)=>i+1).filter(mask=>mask.toString(2).replaceAll('0','').length<=max);}
 const desired=this.stageIndex===0?1:this.stageIndex===1?1+(this.round%2):[1,2,3,4,5][(Math.max(1,this.round)-1)%5];let choices=this.questionBag.filter(mask=>mask!==this.previousTarget&&mask.toString(2).replaceAll('0','').length===desired);if(!choices.length)choices=Array.from({length:31},(_,i)=>i+1).filter(mask=>mask!==this.previousTarget&&mask.toString(2).replaceAll('0','').length===desired);const pool=choices.length?choices:this.questionBag;const target=pool[Math.min(pool.length-1,Math.floor(this.random()*pool.length))];const idx=this.questionBag.indexOf(target);if(idx>=0)this.questionBag.splice(idx,1);this.previousTarget=target;return target;}
 prepare(now){this.phase='ready';this.target=0;this.zeroSince=null;this.mask=null;this.changed=now;this.message='请握拳准备，等金色目标亮起';}
 input(mask,now){if(mask!==this.mask){this.mask=mask;this.changed=now;}this.tick(now);}
 tick(now){if(['idle','finished'].includes(this.phase))return;
 if(this.phase==='feedback'){if(now>=this.nextAt){if(this.round>=this.totalQuestions){this.phase='finished';this.target=0;this.message=this.stageIndex<2?'本关完成！查看成绩或进入下一关':'高级关完成！可以重玩本关或选择其他关卡';}else this.prepare(now);}return;}
 const fresh=this.lastSeen!==undefined&&now-this.lastSeen<350;
 const stable=fresh&&this.mask!==null&&now-this.changed>=100;
 if(!fresh){this.mask=null;this.changed=now;this.zeroSince=null;if(this.phase==='ready')this.message='未识别到整只手，请将手放回画面';if(this.phase==='wait'){this.phase='ready';this.message='手离开画面，请重新握拳准备';}if(this.phase==='active'&&now>=this.deadline)this.finish(false,now,'超时：手未在画面中');return;}
 if(this.phase==='ready'){if(this.mask!==0){this.zeroSince=null;this.message=this.mask===null?'请将整只手放入画面':'请收起 '+names.filter((_,i)=>this.mask&(1<<i)).join('、')+'，握拳准备';return;}if(stable){this.zeroSince??=now;if(now-this.zeroSince>=500){this.phase='wait';this.goAt=now+700+this.random()*1000;this.message='保持握拳，准备…';}}}
 else if(this.phase==='wait'){if(stable&&this.mask!==0){this.prepare(now);this.message='提前伸指！请重新握拳';}else if(this.mask===0&&stable&&now>=this.goAt){this.round++;this.level=this.stageIndex+1;this.target=this.drawTarget();this.phase='active';this.onset=now;this.limit=STAGES[this.stageIndex].limit;this.deadline=now+this.limit;this.message='请伸出金色目标对应的手指';}}
 else if(this.phase==='active'){const onTime=this.mask===this.target&&this.changed<this.deadline;const confirming=onTime&&now<=this.deadline+100;if(stable&&onTime&&now<=this.deadline+100)this.finish(true,now);else if(now>=this.deadline&&!confirming)this.finish(false,now,this.mask===this.target?'超时：正确手势出现得太晚':'超时：尚未识别到完整正确组合');else if(confirming&&now>=this.deadline)this.message='已在时限内匹配，正在确认手势';else if(stable&&this.mask!==0)this.message='手指不匹配：只伸出亮起的组合，还可调整';}
 else if(this.phase==='feedback'&&now>=this.nextAt){if(this.round>=this.totalQuestions){this.phase='finished';this.target=0;this.message=this.stageIndex<2?'本关完成！查看成绩或进入下一关':'高级关完成！可以重玩本关或选择其他关卡';}else this.prepare(now);}}
 seen(mask,now){this.lastSeen=now;this.input(mask,now);}
 lost(now){this.tick(now);}
 finish(ok,now,message){const before=this.score;const rt=Math.max(0,this.changed-this.onset);this.phase='feedback';this.nextAt=now+1300;if(ok){this.correct++;this.totalRT+=rt;const points=1;this.score+=points;this.message=`第 ${this.round} 题答对，+1 分。反应 ${(rt/1000).toFixed(2)} 秒`;}else this.message=message;this.history.push({round:this.round,target:this.target,ok,rt:ok?rt:null,points:this.score-before,answerMask:this.mask});}
}
