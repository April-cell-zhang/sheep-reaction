import {names,STAGES} from './game.mjs';
export function gameView(g,now){
 const done=g.history?.length||0,last=g.history?.at(-1);const accuracy=done?`${Math.round(g.correct/done*100)}%`:'尚未答题';
 let round='尚未开始',message=g.message,timer='';
 if(g.phase==='ready'){round=`第 ${g.round+1} 题 · 准备中`;timer=g.mask===0&&g.zeroSince!==null?`握拳确认 ${Math.min(100,Math.round((now-g.zeroSince)/500*100))}%`:'先握拳，五指都收起后才会出题';}
 if(g.phase==='wait'){round=`第 ${g.round+1} 题 · 马上出题`;message='准备好了！保持握拳';timer='等小羊跳起再伸指，提前伸指会重新准备';}
 if(g.phase==='active'){message=`第 ${g.round} 题开始！`+(g.message.includes('不匹配')?'手指不匹配，还可调整':'哪只羊跳起，就伸对应的手指');round=`第 ${g.round} / ${g.totalQuestions||10} 题 · 请回答`;timer=`还剩 ${Math.max(0,(g.deadline-now)/1000).toFixed(1)} 秒`;}
 if(g.phase==='feedback'){message=`第 ${g.round} 题结束 · ${last?.ok?'答对 +'+last.points+' 分':'超时 +0 分'}`;round=`第 ${g.round} / ${g.totalQuestions||10} 题 · ${last?.ok?'答对了':'未得分'}`;timer='本题已记录，稍后握拳进入下一题';}
 if(g.phase==='finished'){round=`${STAGES[g.stageIndex||0].name} · 10 题已完成`;timer='点击“重玩本关”可再试一次，也可选择其他关卡';}
 const result=last?`第 ${last.round} 题：${last.ok?`答对，+1 分 · 反应 ${(last.rt/1000).toFixed(2)} 秒`:'超时，0 分'}。已答对 ${g.correct} 题。`:'答对一题得 1 分，超时 0 分。';
 return {score:`${g.score} 分`,round,message,timer,result,stats:done?`已答对 ${g.correct} 题 · 准确率 ${accuracy} · 平均反应 ${g.correct?(g.totalRT/g.correct/1000).toFixed(2)+' 秒':'暂无（答对后显示）'}`:'已答对 0 题 · 准确率：尚未答题 · 平均反应：暂无'};
}
export function mountTargets(root){root.innerHTML=names.map((name,i)=>`<div class="target" id="target-${i}"><div class="letter">${'ABCDE'[i]}</div><div class="finger-name">${name}</div><em>未识别</em></div>`).join('');}
export function fingerFeedback(phase,target,mask,i){const up=mask!==null&&!!(mask&(1<<i)),required=!!(target&(1<<i)),answering=['active','feedback'].includes(phase);if(mask===null)return {kind:'unknown',text:'未识别'};if(!answering)return {kind:up?'detected':'neutral',text:up?'你：已伸出':'你：已收起'};if(up&&!required)return {kind:'wrong',text:'伸错了 · 请收起'};if(up&&required)return {kind:'matched',text:'伸对了'};if(required)return {kind:'missing',text:'请伸出'};return {kind:'neutral',text:'你：已收起'};}
export class WrongCue{
 constructor(){this.round=-1;this.latched=false;this.lastAt=-Infinity;}
 update(g,mask,now){if(g.round!==this.round){this.round=g.round;this.latched=false;}const wrong=g.phase==='active'&&mask!==null&&(mask&~g.target)!==0;if(!wrong){this.latched=false;return false;}if(this.latched||now-g.changed<100||now-this.lastAt<900)return false;this.latched=true;this.lastAt=now;return true;}
}
export function renderGame(g,mask,now,doc=document){const v=gameView(g,now);for(const [id,key]of [['score','score'],['round','round'],['game-message','message'],['timer','timer'],['stats','stats'],['last-result','result']]){const el=doc.getElementById(id);if(el.textContent!==v[key])el.textContent=v[key];}
 const stageEl=doc.getElementById('stage-title');if(stageEl)stageEl.textContent=STAGES[g.stageIndex||0].name+' · '+STAGES[g.stageIndex||0].title+' · 每题 '+STAGES[g.stageIndex||0].limit/1000+' 秒';
 const shownMask=g.phase==='feedback'?(g.history?.at(-1)?.answerMask??mask):mask;
 for(let i=0;i<5;i++){const el=doc.getElementById('target-'+i),lit=['active','feedback'].includes(g.phase)&&!!(g.target&(1<<i));const feedback=fingerFeedback(g.phase,g.target,shownMask,i);el.className='target'+(lit?' lit':'')+' '+feedback.kind;el.querySelector('em').textContent=feedback.text;}
}

export function finalSummary(g){const done=g.history?.length||0,correct=g.correct||0,accuracy=done?correct/done:0,seconds=correct?g.totalRT/correct/1000:null;
 let title,joke;
 if(correct<3){title='手指还在热身';joke='这局手指可能还没收到开工通知。先把对应关系练熟，再来一局！';}
 else if(accuracy>=.8&&seconds<=.7){title='反应高手';joke='又快又准，这局发挥很出色！';}
 else if(accuracy<.5&&seconds<=.7){title='手速先到，准头还在路上';joke='手指冲得很快，下次记得带上正确答案一起出发。';}
 else if(seconds>1.3){title='六十岁淡定老伯';joke=accuracy>=.8?'恭喜老伯！手指开启了六十岁慢生活模式，但答题依然稳得很。':'恭喜老伯！手指先喝了口茶才出发。下局茶晚点喝，答案早点到。';}
 else if(accuracy>=.8){title='稳准型选手';joke='准确率很漂亮，再快一点就更出色了！';}
 else{title='正在提速的牧羊选手';joke='有些答案抢到了，有些还在路上。再练一局，让五根手指配合得更默契。';}
 return {title,joke,score:`${correct} / ${g.totalQuestions||10} 分`,stats:`答对 ${correct} / ${done} 题 · 准确率 ${Math.round(accuracy*100)}%`,reaction:seconds===null?'平均反应：暂无（本局没有答对）':`平均反应：${seconds.toFixed(2)} 秒`,note:'平均反应只统计答对的题；称号仅为游戏趣味评价，不代表真实年龄。'};
}
let reportDismissed=false;
export function renderSummary(g,doc=document){const panel=doc.getElementById('summary');if(!panel)return;if(g.phase!=='finished'){panel.hidden=true;reportDismissed=false;return;}const next=doc.getElementById('summary-next');if(next){next.hidden=g.stageIndex>=2;next.textContent='进入'+(STAGES[g.stageIndex+1]?.name||'下一关');}panel.hidden=reportDismissed;if(reportDismissed)return;const report=finalSummary(g);for(const key of ['title','joke','score','stats','reaction','note']){const el=doc.getElementById('summary-'+key);if(el.textContent!==report[key])el.textContent=report[key];}doc.getElementById('summary-close').onclick=()=>{reportDismissed=true;panel.hidden=true;};}
