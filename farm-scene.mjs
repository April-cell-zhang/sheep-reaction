const INK='#5b5142';
export function farmPose(g,mask,now,i,demo=false){const target=g.phase==='active'&&!!(g.target&(1<<i)),demoTarget=demo&&Math.floor(now/1000)%5===i,up=mask!==null&&!!(mask&(1<<i));return {jumping:target||demoTarget,wrong:g.phase==='active'&&up&&!(g.target&(1<<i)),matched:g.phase==='active'&&up&&!!(g.target&(1<<i)),celebrate:g.phase==='feedback'&&g.history?.at(-1)?.ok&&!!(g.target&(1<<i)),up};}
function ellipse(c,x,y,rx,ry,fill,stroke=null){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=3;c.stroke();}}
function line(c,points,color=INK,width=4){c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
function cloud(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);for(const [a,b,r]of [[0,0,23],[25,-13,29],[53,0,25],[22,9,26]])ellipse(c,a,b,r,r,'#fff9e8');c.restore();}
// Cached soft wool sprites avoid repainting hundreds of fibres every frame.
const woolCache=new Map();
function wool(i){if(woolCache.has(i))return woolCache.get(i);const cv=document.createElement('canvas');cv.width=280;cv.height=280;const c=cv.getContext('2d');const r=86+i%3*3;let seed=719+i*341;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};c.translate(140,140);const shade=c.createRadialGradient(-25,-35,8,0,0,105);shade.addColorStop(0,'#ffffff');shade.addColorStop(.65,'#fffefd');shade.addColorStop(1,'#d6dfea');ellipse(c,0,0,r,r*.97,shade);for(let j=0;j<2200;j++){const t=rand()*Math.PI*2,rr=Math.sqrt(rand())*r,x=Math.cos(t)*rr,y=Math.sin(t)*rr*.97;ellipse(c,x,y,1+rand()*3,1+rand()*3,j%4?'#ffffff55':'#cbd6e422');}for(let j=0;j<180;j++){const t=rand()*Math.PI*2,rr=r-1+rand()*3;ellipse(c,Math.cos(t)*rr,Math.sin(t)*rr*.97,1+rand()*2,1+rand()*2,'#ffffff99');}woolCache.set(i,cv);return cv;}
function soft(c,x,y,rx,ry,light,dark){const gr=c.createRadialGradient(x-rx*.3,y-ry*.4,1,x,y,Math.max(rx,ry));gr.addColorStop(0,light);gr.addColorStop(1,dark);ellipse(c,x,y,rx,ry,gr);}
function sheep(c,x,y,size,i,pose,now){const jumping=pose.jumping?Math.abs(Math.sin(now/1000*Math.PI*1.9))*60:pose.celebrate?Math.abs(Math.sin(now/150))*12:0;ellipse(c,x,y+30*size,48*size*(1-jumping/180),10*size,'#668c6330');c.save();c.translate(x,y-jumping);c.scale(size,size);c.rotate(pose.wrong?Math.sin(now/70)*.035:Math.sin(now/650+i)*.025);const kick=pose.jumping?10*Math.sin(now/150):0;
 soft(c,-26-kick,12,13,24,'#ffe1cd','#eeb9a9');soft(c,26+kick,12,13,24,'#ffe1cd','#eeb9a9');soft(c,-70,-69,12,21,'#ffe5d3','#edb6a8');soft(c,70,-72,12,21,'#ffe5d3','#edb6a8');
 c.drawImage(wool(i),-125,-193,250,250);
 soft(c,-58,-141,12,24,'#ffe6d8','#efaeb1');soft(c,57,-145,12,24,'#ffe6d8','#efaeb1');
 soft(c,0,-79,58,45,'#ffe6d5','#f5c0b9');
 // A cloud fringe, tiny eyes and five distinct personalities.
 for(let k=0;k<5;k++)soft(c,-44+k*22,-117-Math.sin(k)*5,18,16,'#fff','#edf1f3');
 const eyeY=-83;ellipse(c,-21,eyeY,5,8,'#493e3c');ellipse(c,21,eyeY+(i===1?4:0),5,8,'#493e3c');ellipse(c,-22,eyeY-3,1.5,2,'#fff');ellipse(c,20,eyeY-3,1.5,2,'#fff');
 ellipse(c,-35,-64,11,6,pose.wrong?'#ef9e9e88':'#f1aab15c');ellipse(c,35,-64,11,6,'#f1aab15c');soft(c,0,-70,6,5,'#ffbfc0','#ec8997');
 c.beginPath();c.moveTo(-14,-58);c.quadraticCurveTo(0,i===2?-35:-43,16,-60);c.strokeStyle='#cf7c8b';c.lineWidth=3;c.lineCap='round';c.stroke();if(i===1||i===4)ellipse(c,10,-48,5,7,'#ef9ba6');if(i===3)line(c,[[13,-99],[28,-104]],'#967166',2);
 const colors=['#f2b6c6','#9acbdf','#baa6df','#b3ce91','#f2cf81'];soft(c,0,-21,14,15,colors[i],'#ffffff');c.fillStyle='#657078';c.font='bold 15px system-ui';c.textAlign='center';c.fillText('ABCDE'[i],0,-16);
 if(i===0){ellipse(c,-36,-144,10,7,'#edb0c5');ellipse(c,-21,-144,10,7,'#edb0c5');ellipse(c,-29,-144,4,5,'#d58eaa');}
 if(i===1){ellipse(c,25,-145,7,5,'#f2d589');line(c,[[25,-144],[35,-149]],'#97b376',3);}
 if(i===2){line(c,[[-10,-159],[-3,-174],[3,-158]],'#d1c0eb',5);}
 if(i===3){ellipse(c,37,-135,8,8,'#fff0a3');ellipse(c,37,-135,3,3,'#e7b86b');}
 if(i===4){c.fillStyle='#bbd8e3';c.beginPath();c.roundRect(-29,-157,58,12,6);c.fill();}
 if(pose.jumping){c.fillStyle='#fff9e8';c.strokeStyle='#d9caa7';c.lineWidth=1;c.beginPath();c.roundRect(-45,-228,90,26,12);c.fill();c.stroke();c.fillStyle='#7b8276';c.font='bold 12px system-ui';c.fillText(['到我啦','咩？就我！','起飞～','嘿嘿','跟上呀'][i],0,-211);}
 if(pose.wrong){c.strokeStyle='#e7969a';c.lineWidth=3;c.beginPath();c.ellipse(0,-80,98,95,0,0,Math.PI*2);c.stroke();c.fillStyle='#ba626d';c.font='bold 12px system-ui';c.fillText('不是这只哦',0,28);}
 if(pose.matched){c.fillStyle='#477b62';c.font='bold 13px system-ui';c.fillText('✓ 对啦',0,28);}c.restore();}
export function drawFarm(canvas,g,mask,now,demo=false){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';}const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
 const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#bfe7f5');sky.addColorStop(.7,'#edf6e9');c.fillStyle=sky;c.fillRect(0,0,w,h);cloud(c,w*.16,h*.33,1);cloud(c,w*.65,h*.30,.8);soft(c,w*.83,h*.32,28,28,'#fff2bd','#ffe3a2');
 c.fillStyle='#c9dfbd';c.beginPath();c.moveTo(0,h*.64);c.quadraticCurveTo(w*.2,h*.42,w*.5,h*.62);c.quadraticCurveTo(w*.8,h*.42,w,h*.6);c.lineTo(w,h);c.lineTo(0,h);c.fill();const grass=c.createLinearGradient(0,h*.6,0,h);grass.addColorStop(0,'#c5ddb2');grass.addColorStop(1,'#e0edca');c.fillStyle=grass;c.beginPath();c.moveTo(0,h*.72);c.quadraticCurveTo(w*.5,h*.51,w,h*.69);c.lineTo(w,h);c.lineTo(0,h);c.fill();
 const fy=h*.72;c.globalAlpha=.6;for(let x=-20;x<w;x+=100){c.fillStyle='#fef9e6';c.beginPath();c.roundRect(x,fy-38,9,58,4);c.fill();}c.fillStyle='#fef9e6';c.fillRect(0,fy-23,w,7);c.fillRect(0,fy-2,w,7);c.globalAlpha=1;
 for(let i=0;i<38;i++){const x=i*173.71%w,y=fy+25+(i*43.7)%Math.max(20,h-fy-30);line(c,[[x-3,y-4],[x,y],[x+4,y-5]],'#a6c193',1);if(i%5===0){ellipse(c,x,y-9,3,3,'#fffbeb');ellipse(c,x+3,y-7,3,3,'#fffbeb');ellipse(c,x+1,y-7,1.5,1.5,'#e8cc8e');}}
 const size=Math.min(w/1100,1.02),base=h*.76;for(let i=0;i<5;i++)sheep(c,w*(.11+i*.195),base,size,i,farmPose(g,mask,now,i,demo),now);
}
