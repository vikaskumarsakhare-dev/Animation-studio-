(()=>{
const $=s=>document.querySelector(s),TAU=Math.PI*2,V3=THREE.Vector3;
const cl=(x,a,b)=>Math.max(a,Math.min(b,x));
const la=(a,b,k)=>a+((((b-a+Math.PI)%TAU)+TAU)%TAU-Math.PI)*k;
const lT=(a,T)=>{for(let i=1;i<T.length;i++)if(a<=T[i][0]){const[a0,v0]=T[i-1],[a1,v1]=T[i];return v0+(v1-v0)*(a-a0)/(a1-a0)}return T[T.length-1][1]};
// उम्र की तालिकाएँ: [उम्र, मान]
const HT=[[5,.55],[10,.73],[15,.92],[18,.99],[22,1],[60,.99],[80,.93]]; // कद
const HR=[[5,1.4],[10,1.28],[15,1.1],[20,1]];                           // सिर का अनुपात
const LR=[[5,.82],[10,.9],[15,.97],[20,1]];                             // हाथ-पैर का अनुपात
const FQ=[[5,1.4],[12,1.25],[20,1],[50,1],[80,.7]];                     // कदमों की गति
const SP=[[5,.7],[10,.85],[15,.95],[22,1],[55,1],[65,.85],[80,.6]];     // चलने की रफ़्तार
const BN=[[5,1.8],[12,1.4],[20,1],[50,1],[80,.5]];                      // उछाल
const bandOf=a=>a<=13?'c':a<=32?'y':a<=52?'m':'o';

// ---------- नमूना कैरेक्टर शीट (कोड से बनी): पुरुष और महिला ----------
const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));return c};
const E=(g,x,y,rx,ry,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fill()};
const Rr=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
const Pl=(g,p,c)=>{g.fillStyle=c;g.beginPath();p.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.fill()};
const SK='#c88c61',SH='#1b1b24',RD='#cc1a26';
const BAND={c:{sk:'#d49a73',hr:'#2a1a10',e:7,w:0},y:{sk:'#c88c61',hr:'#1f120c',e:5.5,w:0},m:{sk:'#bf8559',hr:'#3b2f2a',e:5,w:1},o:{sk:'#b98a66',hr:'#d4d4d4',e:4.5,w:3}};
const BNAME={c:'बच्चा ~10',y:'युवा ~20',m:'अधेड़ ~45',o:'बुज़ुर्ग ~60'},VN={front:'सामने',q:'तिरछा (दाईं ओर)',side:'बगल (दाईं ओर)',back:'पीछे'};
const headD=(gn,b,v)=>g=>{const p=BAND[b],f=gn==='f',hr=p.hr,sk=p.sk,mc=f?'#b02a40':RD;
 if(v==='back'){E(g,45,45,40,42,hr);if(f)Rr(g,8,45,74,45,hr);return}
 if(f){Rr(g,6,24,15,64,hr);Rr(g,69,24,15,64,hr)}
 const dx=v==='front'?0:v==='q'?7:12;
 E(g,45+dx/2,48,v==='side'?36:38,b==='c'?38:40,sk);
 if(v==='side'){E(g,28,42,30,40,hr);if(f)Rr(g,6,40,40,50,hr);E(g,45,b==='o'&&!f?14:20,38,b==='o'&&!f?14:20,hr);E(g,84,58,6,5,sk);E(g,66,52,p.e,p.e+2,'#fff');E(g,68,53,p.e*.6,p.e*.8,'#1a0d05');E(g,70,72,6,2.5,mc)}
 else{E(g,45+dx/2,b==='o'&&!f?16:22,b==='o'&&!f?36:40,b==='o'&&!f?14:22,hr);
  const ex=v==='front'?[31,59]:[52,72];ex.forEach(x=>{E(g,x,54,p.e+1,p.e+2.5,'#fff');E(g,x+1,55,p.e*.6,p.e*.85,'#1a0d05')});
  E(g,v==='front'?45:62,72,8,3,mc);if(v==='q')E(g,82,60,4,4,sk)}
 g.strokeStyle='#00000045';g.lineWidth=1.5;
 for(let i=0;i<p.w;i++){g.beginPath();g.moveTo(24+dx,36+i*4);g.lineTo(66+dx,36+i*4);g.stroke()}
 if(p.w>1){g.beginPath();g.moveTo(34+dx,64);g.lineTo(32+dx,76);g.moveTo(56+dx,64);g.lineTo(58+dx,76);g.stroke()}};
const torsoD=(gn,v,w)=>g=>{const f=gn==='f',c=f?(v==='back'?'#15535a':'#1f6f78'):(v==='back'?'#6e2e24':'#8c3a2e');
 if(f)Pl(g,[[w*.2,12],[w*.8,12],[w*.73,80],[w*.84,140],[w*.16,140],[w*.27,80]],c);else Rr(g,w*.14,10,w*.72,130,c);
 E(g,w/2,12,w*(f?.3:.36),12,c);Rr(g,w*.41,0,w*.18,14,SK)};
const uD=(w,c)=>g=>{Rr(g,2,6,w-4,48,c);E(g,w/2,7,w/2-2,7,c);E(g,w/2,53,w/2-2,7,c)};
const fD=w=>g=>{E(g,w/2,7,w/2-2,7,SK);Rr(g,3,7,w-6,40,SK);E(g,w/2,54,w/2-2,8,SK)};
const hD=(w,c)=>g=>{E(g,w/2,8,w/2-1,8,c);Rr(g,1,8,w-2,68,c);E(g,w/2,76,w/2-1,8,c)};
const sF=(w,c)=>g=>{E(g,w/2,8,w/2-1,8,c);Rr(g,1,8,w-2,60,c);E(g,w/2,76,w/2-1,8,SH)};
const sS=(cw,c)=>g=>{E(g,22,8,cw/2,8,c);Rr(g,22-cw/2,8,cw,58,c);E(g,22,70,cw/2,6,SH);E(g,28,77,16,7,SH)};
const SL={mouth_open:['खुला मुँह (सामने)',30,22,g=>{E(g,15,11,13,9,RD);E(g,15,13,9,5,'#3a0508')}]};
['m','f'].forEach(gn=>{const f=gn==='f',k=.86,pc=f?'#4a2f5a':'#2c3e6b',sc=f?'#1f6f78':'#8c3a2e',W=n=>Math.round(n*(f?k:1));
 for(const b in BAND)for(const v in VN)SL[`${gn}_head_${b}_${v}`]=[`सिर ${BNAME[b]}: ${VN[v]}`,90,90,headD(gn,b,v)];
 [['front',100],['q',80],['side',56],['back',100]].forEach(([v,w])=>SL[`${gn}_torso_${v}`]=[`धड़: ${VN[v]}`,w,140,torsoD(gn,v,w)]);
 SL[gn+'_uarm_front']=['ऊपरी बाँह: सामने/पीछे',W(28),60,uD(W(28),sc)];SL[gn+'_uarm_side']=['ऊपरी बाँह: बगल',W(24),60,uD(W(24),sc)];
 SL[gn+'_farm_front']=['कलाई-हाथ: सामने/पीछे',W(24),62,fD(W(24))];SL[gn+'_farm_side']=['कलाई-हाथ: बगल',W(22),62,fD(W(22))];
 SL[gn+'_thigh_front']=['जाँघ: सामने/पीछे',W(36),84,hD(W(36),pc)];SL[gn+'_thigh_side']=['जाँघ: बगल',W(36),84,hD(W(36),pc)];
 SL[gn+'_shin_front']=['पिंडली-पैर: सामने/पीछे',W(28),84,sF(W(28),pc)];SL[gn+'_shin_side']=['पिंडली-पैर: बगल (पंजा दाईं ओर)',44,84,sS(f?18:20,pc)]});
const TEX={};
const setTex=(k,cv)=>{const mc=mk(cv.width,cv.height,g=>{g.translate(cv.width,0);g.scale(-1,1);g.drawImage(cv,0,0)});
 const m=c=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t};
 TEX[k]={t:m(cv),tm:m(mc),a:cv.width/cv.height,src:cv}};
for(const k in SL)setTex(k,mk(SL[k][1],SL[k][2],SL[k][3]));

// ---------- 3D दुनिया ----------
const ren=new THREE.WebGLRenderer({canvas:$('#cv'),antialias:true});
ren.outputEncoding=THREE.sRGBEncoding;ren.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.3,700);
scene.background=new THREE.Color(0x8cc7f2);scene.fog=new THREE.Fog(0x8cc7f2,60,420);
const hemi=new THREE.HemisphereLight(0xffffff,0x557744,1),sun=new THREE.DirectionalLight(0xffffff,.8);
sun.position.set(30,60,20);scene.add(hemi,sun);
const M=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o));
const add=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);scene.add(o);return o};
const gr=add(new THREE.PlaneGeometry(900,900),M(0x4c9a3a),0,0,0);gr.rotation.x=-Math.PI/2;
let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
for(let i=0;i<80;i++){let x,z;do{const a=rnd()*TAU,r=14+rnd()*110;x=Math.cos(a)*r;z=Math.sin(a)*r}while(Math.abs(x)<14&&z<-12&&z>-70);
 const s=.8+rnd()*.7;add(new THREE.CylinderGeometry(.15*s,.22*s,1.6*s,6),M(0x66431f),x,.8*s,z);add(new THREE.ConeGeometry(1.3*s,3*s,7),M(0x1f6626),x,3.1*s,z)}
for(let i=0;i<7;i++){const a=i*TAU/7,h=60+rnd()*40;add(new THREE.ConeGeometry(75,h,6),M(0x736660,{flatShading:true}),Math.cos(a)*230,h/2,Math.sin(a)*230)}
const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(16,0);sh.lineTo(16,8);
const rg=new THREE.ExtrudeGeometry(sh,{depth:6,bevelEnabled:false});rg.translate(0,0,-3);rg.rotateY(Math.PI/2);
add(rg,M(0x8a7a6a,{flatShading:true}),0,0,-22);
add(new THREE.BoxGeometry(12,8,10),M(0x7d6e60,{flatShading:true}),0,4,-43);
const bench=add(new THREE.BoxGeometry(.5,.05,.4),M(0x6b4a2b),0,0,0);bench.visible=false;
const night=n=>{const c=new THREE.Color(n?0x0a1030:0x8cc7f2);scene.background=c;scene.fog.color=c;hemi.intensity=n?.35:1;sun.intensity=n?.15:.8};

// ---------- पुतली ----------
const mkS=()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TEX.mouth_open.t,alphaTest:.4}));scene.add(s);return s};
const sp={};['head','torso','tL','sL','tR','sR','uL','fL','uR','fR','mouth'].forEach(n=>sp[n]=mkS());
let pos=new V3(0,0,8),hd=Math.PI,spd=0,auto=0,vy=0,jump=false,stunt=null,t=0,ph=0,sv=0,sit=false,talk=false,turn=false,nt=false,pm='move',dr=null,moved=false;
let gn='m',age=25,hmul=1;
const joy={x:0,y:0,m:0},cs={mode:0,yo:0,pt:.28,p:.28,d:5,orb:0,yaw:0};
const Uv=new V3(0,1,0),Rc=new V3(),Uc=new V3(),tc=new V3();
const hgt=()=>lT(age,HT)*(gn==='f'?.93:1)*hmul;
let tg;const say=s=>{const e=$('#tag');e.textContent=s;e.classList.remove('hidden');clearTimeout(tg);tg=setTimeout(()=>e.classList.add('hidden'),1300)};

const stepStunt=dt=>{const s=stunt,[A,B,ty]=s.segs[s.i],dx=B[0]-A[0],dy=B[1]-A[1],dz=B[2]-A[2],L=Math.hypot(dx,dy,dz)||1,f=ty==='fall';
 s.u+=f?dt/1.2:dt*5/L;const u=Math.min(1,s.u);
 pos.set(A[0]+dx*u,A[1]+dy*(f?u*u:u)+(f?6*u*(1-u):0),A[2]+dz*u);
 if(Math.hypot(dx,dz)>.1)hd=la(hd,Math.atan2(dx,dz),1-Math.exp(-12*dt));
 spd=f?3:5;
 if(s.u>=1){s.i++;s.u=0;if(s.i>=s.segs.length){stunt=null;spd=0;pos.y=0}}};
const startStunt=()=>{if(stunt)return;jump=false;auto=0;sit=false;
 stunt={i:0,u:0,segs:[[[pos.x,0,pos.z],[0,0,-22],'run'],[[0,0,-22],[0,8,-38],'run'],[[0,8,-38],[0,8,-47],'run'],[[0,8,-47],[0,0,-56],'fall']]};say('पहाड़ से कूद')};

const move=dt=>{
 if(stunt){stepStunt(dt);return}
 const sf=lT(age,SP);let tgt=0,ang=null;
 if(!sit){
  if(joy.m>.12){moved=true;const cx=cam.position.x-pos.x,cz=cam.position.z-pos.z,l=Math.hypot(cx,cz)||1,fx=-cx/l,fz=-cz/l,dx=-fz*joy.x+fx*-joy.y,dz=fx*joy.x+fz*-joy.y;
   ang=Math.atan2(dx,dz);tgt=(joy.m<.6?1.5:4.5)*sf}
  else if(auto)tgt=(auto===2?4.5:1.5)*sf}
 if(ang!==null)hd=la(hd,ang,1-Math.exp(-10*dt));
 spd+=(tgt-spd)*(1-Math.exp(-8*dt));
 pos.x+=Math.sin(hd)*spd*dt;pos.z+=Math.cos(hd)*spd*dt;
 if(jump){pos.y+=vy*dt;vy-=18*dt;if(pos.y<=0){pos.y=0;jump=false}}};

const camUpdate=dt=>{
 const base=cs.mode===1?hd:cs.mode===2?(cs.orb+=dt*.6):hd+Math.PI;
 cs.yaw=la(cs.yaw,base+cs.yo,1-Math.exp(-5*dt));
 cs.p+=((cs.mode===3?1.25:cs.pt)-cs.p)*(1-Math.exp(-5*dt));
 const c=Math.cos(cs.p),T=pos.clone();T.y+=.9*hgt();
 cam.position.set(T.x+Math.sin(cs.yaw)*c*cs.d,Math.max(.4,T.y+Math.sin(cs.p)*cs.d),T.z+Math.cos(cs.yaw)*c*cs.d);
 cam.lookAt(T);cam.updateMatrixWorld()};

const view=a=>{const fx=Math.sin(a),fz=Math.cos(a),vx=cam.position.x-pos.x,vz=cam.position.z-pos.z,l=Math.hypot(vx,vz)||1,c=(fx*vx+fz*vz)/l,m=fx*Rc.x+fz*Rc.z>=0?1:-1;
 return c>.9?['front',1]:c>.4?['q',m]:c>-.4?['side',m]:['back',1]};

const pose=dt=>{
 const f=gn==='f',H=hgt(),hr=lT(age,HR),lr=lT(age,LR),Lt=.42*H*lr,La=.3*H*lr,Tl=.6*H,Hh=.34*H*hr,sf=lT(age,SP),ampF=age>55?1-(age-55)/80:1;
 t+=dt;ph+=dt*(3+spd*1.8)*lT(age,FQ);sv+=((sit?1:0)-sv)*(1-Math.exp(-(age>60?3.5:6)*dt));
 Rc.setFromMatrixColumn(cam.matrixWorld,0);Uc.setFromMatrixColumn(cam.matrixWorld,1);
 tc.copy(cam.position).sub(pos).normalize();
 const air=jump||(stunt&&stunt.segs[stunt.i][2]==='fall');
 const amp=(cl(spd/(1.5*sf),0,1)*.55+cl((spd-1.5*sf)/(3*sf),0,1)*.5)*ampF*(f?.93:1);
 const F=new V3(Math.sin(hd),0,Math.cos(hd)),Rg=new V3().crossVectors(F,Uv);
 const stoop=cl((age-50)/30,0,1)*.2,lean=(spd>3*sf?.25:spd>.5*sf?.08:0)*(1-sv)+stoop*(1-sv*.5);
 const D=th=>new V3().addScaledVector(Uv,-Math.cos(th)).addScaledVector(F,Math.sin(th));
 const lb=(S0,t1,k,L,s)=>{const K=S0.clone().addScaledVector(D(t1),L);return[K,K.clone().addScaledVector(D(t1+s*k),L)]};
 const wy=2*Lt-.01*H+(air?0:Math.abs(Math.sin(ph))*.035*amp*lT(age,BN)*H+Math.sin(t*2)*.008*H);
 const hip=pos.clone().addScaledVector(Uv,wy*(1-sv)+(Lt+.05*H)*sv).addScaledVector(Rg,Math.sin(ph)*(f?.04:.025)*amp*H);
 bench.visible=sv>.5;bench.scale.setScalar(H);bench.position.copy(hip).addScaledVector(Uv,-.05*H);bench.rotation.y=hd;
 const up=new V3().addScaledVector(Uv,Math.cos(lean)).addScaledVector(F,Math.sin(lean));
 const sho=hip.clone().addScaledVector(up,Tl);
 const hy=turn?Math.sin(t*1.4)*1.2:0,vb=view(hd),vh=view(hd+hy),jobs=[];
 const lk=vb[0]==='side'?'side':'front',lm=vb[0]==='side'?vb[1]:1,K=n=>gn+'_'+n;
 const J=(s,k,S0,E0,nom,m)=>jobs.push({s,k,S0,E0,nom,m,c:S0.clone().add(E0).multiplyScalar(.5)});
 J(sp.torso,K('torso_'+vb[0]),sho,hip,Tl,vb[1]);
 J(sp.head,K('head_'+bandOf(age)+'_'+vh[0]),sho.clone().addScaledVector(up,Hh),sho,Hh,vh[1]);
 const lo=((f?.085:.1)*(1-sv)+(f?.07:.15)*sv)*H;
 [[sp.tL,sp.sL,-1],[sp.tR,sp.sR,1]].forEach(([a,b,d])=>{const fa=ph+(d>0?Math.PI:0),S0=hip.clone().addScaledVector(Rg,lo*d);
  let t1=amp*Math.sin(fa),k=.08+amp*1.3*Math.max(0,Math.cos(fa));
  if(air){t1=d<0?.9:.3;k=1.1}
  t1+=(1.5-t1)*sv;k+=(1.5-k)*sv;
  const[Kn,An]=lb(S0,t1,k,Lt,-1);J(a,K('thigh_'+lk),S0,Kn,Lt,lm);J(b,K('shin_'+lk),Kn,An,Lt,lm)});
 [[sp.uL,sp.fL,-1],[sp.uR,sp.fR,1]].forEach(([a,b,d])=>{const fa=ph+(d>0?Math.PI:0),S0=sho.clone().addScaledVector(Rg,.2*H*(f?.9:1)*d).addScaledVector(Uv,-.04*H);
  let t1=-amp*Math.sin(fa)*.8,e=.25+amp*.7;
  if(air){t1=2.6;e=.3}else if(talk&&spd<.5&&sv<.5&&d>0){t1=.9+.3*Math.sin(t*4);e=1.3+.4*Math.sin(t*7)}
  t1+=((f?.25:.5)-t1)*sv;e+=((f?1.3:.9)-e)*sv;
  const[Kn,An]=lb(S0,t1,e,La,1);J(a,K('uarm_'+lk),S0,Kn,La,lm);J(b,K('farm_'+lk),Kn,An,La,lm)});
 jobs.sort((a,b)=>b.c.distanceToSquared(cam.position)-a.c.distanceToSquared(cam.position));
 jobs.forEach((j,i)=>{const d=j.E0.clone().sub(j.S0),L=d.length()||1e-3,dx=d.dot(Rc),dy=d.dot(Uc),len=Math.hypot(dx,dy),x=TEX[j.k];
  j.s.position.copy(j.c).addScaledVector(tc,i*.012*H);j.s.material.map=j.m<0?x.tm:x.t;
  j.s.material.rotation=len>1e-3?Math.atan2(dx,-dy):0;
  j.s.scale.set(j.nom*x.a,L*(.3+.7*Math.min(1,len/L)),1)});
 const mo=talk&&vh[0]==='front'&&Math.sin(t*14)>0;sp.mouth.visible=mo;
 if(mo){sp.mouth.material.map=TEX.mouth_open.t;sp.mouth.position.copy(sp.head.position).addScaledVector(Uc,-.22*Hh).addScaledVector(tc,.03);sp.mouth.scale.set(.32*Hh,.2*Hh,1)}};

// ---------- पीछे / आगे ----------
const snap=()=>({x:pos.x,z:pos.z,h:hd,au:auto,si:sit,ta:talk,tu:turn,cm:cs.mode,n:nt,g:gn,a:age,hm:hmul});
let hist=[snap()],hi=0;
const commit=()=>{hist=hist.slice(0,hi+1);hist.push(snap());if(hist.length>60)hist.shift();hi=hist.length-1};
let sb;
const sync=()=>{$('[data-a=talk]').classList.toggle('on',talk);$('[data-a=turn]').classList.toggle('on',turn);sb.innerHTML=`<b>🪑</b>${sit?'उठना':'बैठना'}`;
 document.querySelectorAll('.chip[data-g]').forEach(c=>c.classList.toggle('on',c.dataset.g===gn));
 $('#ag').value=age;$('#av').textContent=age;$('#hg').value=Math.round(hmul*100);$('#hv').textContent=Math.round(hmul*100)};
const restore=o=>{pos.set(o.x,0,o.z);hd=o.h;auto=o.au;sit=o.si;talk=o.ta;turn=o.tu;cs.mode=o.cm;nt=o.n;night(nt);gn=o.g;age=o.a;hmul=o.hm;stunt=null;jump=false;spd=0;sync()};
$('#bu').onclick=()=>{if(hi>0){restore(hist[--hi]);say('पीछे (Undo)')}};
$('#br').onclick=()=>{if(hi<hist.length-1){restore(hist[++hi]);say('आगे (Redo)')}};

// ---------- बटन, पैड, किरदार पट्टी, शीट ----------
const doJump=()=>{if(!jump&&!stunt&&!sit){jump=true;vy=6.5}};
const CN=['पीछे से','सामने से','घूमता हुआ','ऊपर से'];
const items=[['⏹','रुकना',()=>{auto=0}],['🚶','चलना',()=>{auto=1;sit=false}],['🏃','दौड़ना',()=>{auto=2;sit=false}],['🪑','बैठना',()=>{sit=!sit;auto=0;stunt=null}],
 ['⛰','पहाड़ से कूद',startStunt],['🎥','कैमरा',()=>{cs.mode=(cs.mode+1)%4;cs.yo=0;say('कैमरा: '+CN[cs.mode])}],['🌙','दिन / रात',()=>{nt=!nt;night(nt)}]];
items.forEach(([i,l,f])=>{const b=document.createElement('button');b.innerHTML=`<b>${i}</b>${l}`;b.onclick=()=>{f();sync();commit()};$('#menu').appendChild(b);if(l==='बैठना')sb=b});
document.querySelectorAll('.pb[data-m]').forEach(b=>b.onclick=()=>{pm=b.dataset.m;document.querySelectorAll('.pb[data-m]').forEach(x=>x.classList.toggle('on',x===b))});
document.querySelectorAll('.pb[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='jump')doJump();else{if(a==='talk')talk=!talk;else turn=!turn;sync();commit()}});
const sf_=$('#surf'),kn=$('#kn');
const mv=e=>{if(pm==='move'){let x=(e.clientX-dr.cx)/dr.R,y=(e.clientY-dr.cy)/dr.R,m=Math.hypot(x,y);if(m>1){x/=m;y/=m;m=1}joy.x=x;joy.y=y;joy.m=m;
  const r=sf_.getBoundingClientRect();kn.style.left=(dr.cx-r.left+x*dr.R)+'px';kn.style.top=(dr.cy-r.top+y*dr.R)+'px'}
 else{const dx=e.clientX-dr.x,dy=e.clientY-dr.y;dr.x=e.clientX;dr.y=e.clientY;if(pm==='orbit'){cs.yo-=dx*.012;cs.pt=cl(cs.pt+dy*.008,.05,1.3)}else cs.d=cl(cs.d+dy*.03,2,14)}};
sf_.onpointerdown=e=>{sf_.setPointerCapture(e.pointerId);const r=sf_.getBoundingClientRect();moved=false;dr={x:e.clientX,y:e.clientY,cx:r.left+r.width/2,cy:r.top+r.height/2,R:Math.min(r.width,r.height)/2-10};kn.style.display=pm==='move'?'block':'none';mv(e)};
sf_.onpointermove=e=>{if(dr)mv(e)};
sf_.onpointerup=sf_.onpointercancel=()=>{dr=null;joy.m=0;kn.style.display='none';if(moved){moved=false;commit()}};

// किरदार पट्टी: पुरुष/महिला, उम्र, ऊँचाई
$('#bp').onclick=()=>{sync();$('#ov2').classList.remove('hidden')};
$('#b2').onclick=()=>$('#ov2').classList.add('hidden');
document.querySelectorAll('.chip[data-g]').forEach(c=>c.onclick=()=>{gn=c.dataset.g;sync();commit()});
document.querySelectorAll('.chip[data-ag]').forEach(c=>c.onclick=()=>{age=+c.dataset.ag;sync();commit()});
$('#ag').oninput=e=>{age=+e.target.value;$('#av').textContent=age};$('#ag').onchange=()=>{sync();commit()};
$('#hg').oninput=e=>{hmul=+e.target.value/100;$('#hv').textContent=e.target.value};$('#hg').onchange=commit;

// इमेज शीट (चुना हुआ किरदार)
let fs=null;const fi=$('#fi');
const rg2=()=>{$('#gh').textContent='कैरेक्टर शीट: '+(gn==='f'?'महिला':'पुरुष');
 $('#sl').innerHTML=Object.keys(SL).filter(k=>k.startsWith(gn+'_')||k==='mouth_open').map(k=>`<div class="sc" data-k="${k}"><img src="${TEX[k].src.toDataURL()}"><b>${SL[k][0]}</b><small>${SL[k][1]}×${SL[k][2]} px (यही अनुपात)</small><u>इमेज चुनें</u></div>`).join('')};
$('#bg').onclick=()=>{rg2();$('#ov').classList.remove('hidden')};
$('#bc').onclick=()=>$('#ov').classList.add('hidden');
$('#sl').onclick=e=>{const c=e.target.closest('.sc');if(c){fs=c.dataset.k;fi.value='';fi.click()}};
fi.onchange=()=>{const f=fi.files[0];if(!f||!fs)return;const u=URL.createObjectURL(f),im=new Image();
 im.onload=()=>{const k=Math.min(1,512/Math.max(im.width,im.height)),w=Math.round(im.width*k),h=Math.round(im.height*k);
  setTex(fs,mk(w,h,g=>g.drawImage(im,0,0,w,h)));URL.revokeObjectURL(u);rg2();say('इमेज लग गई')};im.src=u};

new ResizeObserver(()=>{const s=$('#stage'),w=s.clientWidth,h=s.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}).observe($('#stage'));
sync();
let last=performance.now();
ren.setAnimationLoop(()=>{const n=performance.now(),dt=Math.min(.05,(n-last)/1000);last=n;move(dt);camUpdate(dt);pose(dt);ren.render(scene,cam)});
})();
