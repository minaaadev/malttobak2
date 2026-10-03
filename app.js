const DEFAULT_SETTINGS = {
  nickname: '',
  enabledModules: ['breath','articulation','rate','phrases'],
  sessionLength: 'standard',
  ttsRate: 0.75,
  customPhrases: [],
  largeText: false,
  simpleMode: false
};

const modules = {
  breath: {
    label:'호흡·발성',
    steps:[
      {id:'breath-slow',title:'편안한 호흡 준비',hint:'호흡',instruction:'허리를 편안히 세우고 천천히 들이쉰 뒤 힘주지 말고 내쉽니다. 숨을 오래 참거나 최대한 세게 내쉬지 마세요.',cue:'breath'},
      {id:'phonation-a',title:'편안한 “아—”',hint:'발성',instruction:'편하게 숨을 들이쉰 뒤 목에 힘을 주지 않고 편안한 크기로 “아—”를 이어 말합니다. 지속시간은 경쟁하지 않습니다.',text:'아——',speak:'아',tool:'phonation'},
      {id:'phrase-breath',title:'한 호흡에 편한 구절',hint:'호흡-발성 협응',instruction:'문장을 무리해서 한 번에 끝내기보다 편안한 길이로 나누어 말합니다.',text:'오늘은 / 날씨가 좋습니다.',speak:'오늘은, 날씨가 좋습니다.'},
      {id:'easy-voice',title:'편안한 목소리 시작',hint:'발성',instruction:'숨을 들이쉰 직후 힘으로 밀어내지 말고 편안하게 소리를 시작해봅니다.',text:'아 / 안녕하세요',speak:'아, 안녕하세요'}
    ]
  },
  articulation: {
    label:'조음',
    steps:[
      {id:'lip-syllables',title:'입술 소리 또렷하게',hint:'입술',instruction:'빠르게 반복하기보다 입술 모양을 크게 만들고 각 음절을 분명하게 말합니다.',text:'바 · 파 · 마',speak:'바, 파, 마'},
      {id:'tongue-tip',title:'혀끝 소리 또렷하게',hint:'혀끝',instruction:'혀끝 위치와 움직임을 의식하면서 천천히 말합니다.',text:'다 · 타 · 나 · 라',speak:'다, 타, 나, 라'},
      {id:'clear-words',title:'분명한 단어',hint:'명료한 말',instruction:'자음을 조금 더 분명하게, 입모양을 충분히 사용해 말합니다.',text:'바다 / 토마토 / 라디오',speak:'바다, 토마토, 라디오'},
      {id:'clear-sentence',title:'분명한 문장',hint:'명료한 말',instruction:'단어 사이를 조금 여유 있게 두고 중요한 자음을 분명하게 말합니다.',text:'따뜻한 물을 한 잔 주세요.',speak:'따뜻한 물을 한 잔 주세요.'}
    ]
  },
  rate: {
    label:'말속도·운율',
    steps:[
      {id:'pacing-count',title:'박자에 맞춰 세기',hint:'페이싱',instruction:'한 박자에 한 단어를 맞추며 일정한 속도로 말합니다. 메트로놈 속도는 편안하게 조절하세요.',text:'하나 · 둘 · 셋 · 넷 · 다섯',speak:'하나, 둘, 셋, 넷, 다섯',cue:'pacing',tool:'metronome'},
      {id:'pacing-syllable',title:'음절을 분명하게',hint:'페이싱',instruction:'빨라지지 않도록 각 음절을 의식하며 말합니다. 너무 기계적으로 끊지 않아도 됩니다.',text:'안 · 녕 · 하 · 세 · 요',speak:'안녕하세요',cue:'pacing',tool:'metronome'},
      {id:'phrase-grouping',title:'구절에서 잠깐 쉬기',hint:'구절 나누기',instruction:'슬래시에서 짧게 쉬고 다음 구절을 시작합니다.',text:'저는 오늘 / 병원에 갑니다.',speak:'저는 오늘, 병원에 갑니다.'},
      {id:'key-word',title:'중요한 단어 강조',hint:'운율',instruction:'중요한 단어를 조금 더 천천히 또는 분명하게 말해 의미를 전달해봅니다.',text:'저는 “물”이 필요해요.',speak:'저는 물이 필요해요.'}
    ]
  },
  phrases: {
    label:'생활 문장',
    steps:[
      {id:'help',title:'도움 요청',hint:'기능 문장',instruction:'중요한 단어를 분명하게 말합니다. 필요하면 상대에게 가까이 와 달라고 요청해도 좋습니다.',text:'도와주세요.',speak:'도와주세요.'},
      {id:'water',title:'필요 표현',hint:'기능 문장',instruction:'편한 속도로 한 번 말한 뒤, 필요하면 같은 문장을 다시 반복합니다.',text:'물을 조금 주세요.',speak:'물을 조금 주세요.'},
      {id:'repeat',title:'대화 조절',hint:'기능 문장',instruction:'상대의 말을 이해하기 어렵다면 천천히 다시 말해 달라고 요청합니다.',text:'천천히 다시 말씀해 주세요.',speak:'천천히 다시 말씀해 주세요.'},
      {id:'repair',title:'내 말 다시 전달하기',hint:'의사소통 전략',instruction:'상대가 알아듣지 못했을 때 더 빨리 말하지 말고, 핵심 단어를 분명히 다시 말해봅니다.',text:'제가 다시 천천히 말할게요.',speak:'제가 다시 천천히 말할게요.'}
    ]
  }
};

const AAC_DEFAULTS = [
  ['도와주세요','도움 요청'],['물을 주세요','기본 필요'],['화장실에 가고 싶어요','기본 필요'],['잠시 쉬고 싶어요','휴식'],
  ['아파요','불편 표현'],['잘 못 들었어요','대화 조절'],['천천히 말씀해 주세요','대화 조절'],['제가 다시 말할게요','대화 조절']
];

let settings = loadSettings();
let activePlan = [], stepIndex = 0, rating = null, startedAt = null, completedItems = [];
let mediaRecorder = null, mediaStream = null, chunks = [], installPrompt = null;
let audioContext = null, analyser = null, meterFrame = null;
let phonationTimer = null, phonationStart = null, phonationValue = null;
let metroTimer = null, metroOn = false;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const views = $$('.view');

function show(id){
  stopAllTools();
  views.forEach(v=>v.classList.toggle('active',v.id===id));
  $$('.bottom-nav button').forEach(b=>b.classList.remove('active'));
  if(id==='home') $('.bottom-nav [data-go-home]').classList.add('active');
  if(id==='history') $('#historyBtn').classList.add('active');
  if(id==='settings') $('#settingsBtn').classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function todayKey(d=new Date()){return d.toLocaleDateString('sv-SE');}
function escapeHTML(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function loadSettings(){try{return {...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem('malttobakSettings')||'{}')}}catch{return {...DEFAULT_SETTINGS}}}
function saveSettings(){localStorage.setItem('malttobakSettings',JSON.stringify(settings));}
function getHistory(){try{return JSON.parse(localStorage.getItem('malttobakHistory')||'[]')}catch{return []}}
function saveHistory(h){localStorage.setItem('malttobakHistory',JSON.stringify(h));}

function applySettings(){
  document.body.classList.toggle('large-text',!!settings.largeText);
  document.body.classList.toggle('simple-training',!!settings.simpleMode && $('#training').classList.contains('active'));
  $('#welcomeTitle').textContent=settings.nickname?`${settings.nickname}님, 오늘도 편안하게`:'천천히, 분명하게, 편안하게';
  const labels=settings.enabledModules.map(k=>modules[k]?.label).filter(Boolean);
  $('#planSummary').textContent=labels.length?`${labels.join(' · ')} 영역을 ${lengthLabel(settings.sessionLength)} 구성으로 연습합니다.`:'맞춤설정에서 오늘 훈련 영역을 선택해 주세요.';
}
function lengthLabel(v){return v==='short'?'짧게':v==='extended'?'충분히':'기본';}

function lastNDaysHistory(n=7){
  const cutoff=new Date(); cutoff.setHours(0,0,0,0); cutoff.setDate(cutoff.getDate()-(n-1));
  return getHistory().filter(x=>Number(x.timestamp||0)>=cutoff.getTime());
}
function updateStats(){
  const h=getHistory(), week=lastNDaysHistory(7);
  $('#weekSessions').textContent=`${week.length}회`;
  $('#weekMinutes').textContent=`${Math.round(week.reduce((a,b)=>a+(Number(b.seconds)||0),0)/60)}분`;
  let streak=0,d=new Date(); d.setHours(0,0,0,0);
  for(let i=0;i<365;i++){
    const k=todayKey(d);
    if(h.some(x=>x.date===k)){streak++;d.setDate(d.getDate()-1)}
    else if(i===0){d.setDate(d.getDate()-1)} else break;
  }
  $('#streak').textContent=`${streak}일`;
}

function customPhraseSteps(){
  return (settings.customPhrases||[]).map((p,i)=>({id:`custom-${i}`,title:'나만의 생활 문장',hint:'맞춤 문장',instruction:'실제 상황을 떠올리며 편한 속도로 말해봅니다. 상대가 알아듣기 어렵다면 핵심 단어를 더 분명히 말합니다.',text:p,speak:p,custom:true}));
}
function moduleSteps(name){
  const base=modules[name]?.steps||[];
  return name==='phrases'?[...base,...customPhraseSteps()]:base;
}
function buildDailyPlan(){
  const enabled=settings.enabledModules.filter(m=>modules[m]);
  if(!enabled.length) return [];
  const limit=settings.sessionLength==='short'?5:settings.sessionLength==='extended'?12:8;
  const seed=Number(todayKey().replaceAll('-',''));
  const queues=enabled.map((m,idx)=>{
    const steps=moduleSteps(m);
    if(!steps.length)return [];
    const offset=(seed+idx)%steps.length;
    return [...steps.slice(offset),...steps.slice(0,offset)].map((step,i)=>({m,step,index:i}));
  });
  const plan=[];
  let round=0;
  while(plan.length<limit && queues.some(q=>q.length)){
    for(const q of queues){if(q[round] && plan.length<limit)plan.push(q[round]);}
    round++;
    if(round>20)break;
  }
  return plan;
}
function startModule(name){activePlan=moduleSteps(name).map(step=>({m:name,step}));startPlan();}
function startDaily(){
  activePlan=buildDailyPlan();
  if(!activePlan.length){show('settings');alert('오늘 훈련에 포함할 영역을 하나 이상 선택해 주세요.');return;}
  startPlan();
}
function startPlan(){stepIndex=0;startedAt=Date.now();rating=null;completedItems=[];show('training');applySettings();renderStep();}
function current(){return activePlan[stepIndex];}

function renderStep(){
  stopAllTools(); rating=null; phonationValue=null;
  $$('#ratingRow button').forEach(b=>b.classList.remove('selected'));
  $('#fatigueCheck').checked=false; $('#restNotice').classList.add('hidden'); $('#nextBtn').disabled=true;
  $('#playback').classList.add('hidden'); $('#playback').removeAttribute('src'); $('#recognitionBox').classList.add('hidden'); $('#recognizedText').textContent='-';
  const {m,step}=current();
  $('#moduleLabel').textContent=modules[m].label; $('#exerciseHint').textContent=step.hint||''; $('#exerciseTitle').textContent=step.title;
  $('#exerciseInstruction').textContent=step.instruction||''; $('#targetText').textContent=step.text||'';
  if(step.cue==='breath') $('#visualCue').innerHTML='<div class="breath-circle">편안히<br>호흡</div>';
  else if(step.cue==='pacing') $('#visualCue').innerHTML='<div class="pacing-board"><i></i><i></i><i></i><i></i><i></i></div>';
  else $('#visualCue').textContent='🗣️';
  $('#listenBtn').classList.toggle('hidden',!step.speak);
  $('#phonationPanel').classList.toggle('hidden',step.tool!=='phonation');
  $('#metronomePanel').classList.toggle('hidden',step.tool!=='metronome');
  $('#phonationTime').textContent='0.0'; $('#phonationStartBtn').disabled=false; $('#phonationStopBtn').disabled=true;
  $('#stepCounter').textContent=`${stepIndex+1}/${activePlan.length}`;
  $('#progressBar').style.width=`${(stepIndex/activePlan.length)*100}%`;
  $('#nextBtn').textContent=stepIndex===activePlan.length-1?'훈련 마치기':'다음 과제';
  document.body.classList.toggle('simple-training',!!settings.simpleMode);
}

function speak(text){
  if(!('speechSynthesis' in window)){alert('이 브라우저는 음성 예시 재생을 지원하지 않습니다.');return;}
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=Number(settings.ttsRate)||0.75;speechSynthesis.speak(u);
}

async function startRecording(){
  if(!navigator.mediaDevices?.getUserMedia){alert('이 브라우저에서는 마이크 녹음을 사용할 수 없습니다.');return;}
  try{
    mediaStream=await navigator.mediaDevices.getUserMedia({audio:true}); chunks=[];
    mediaRecorder=new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    mediaRecorder.onstop=()=>{
      const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'}); $('#playback').src=URL.createObjectURL(blob);$('#playback').classList.remove('hidden');
      stopMicMeter();mediaStream?.getTracks().forEach(t=>t.stop());mediaStream=null;
    };
    mediaRecorder.start(); $('#recordBtn').classList.add('hidden');$('#stopBtn').classList.remove('hidden');
    startMicMeter(mediaStream); tryRecognition();
  }catch(e){alert('마이크 권한을 허용하면 내 목소리 녹음 기능을 사용할 수 있습니다.');}
}
function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop();$('#stopBtn').classList.add('hidden');$('#recordBtn').classList.remove('hidden');}
function startMicMeter(stream){
  try{
    audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)(); analyser=audioContext.createAnalyser(); analyser.fftSize=512;
    const source=audioContext.createMediaStreamSource(stream);source.connect(analyser); const data=new Uint8Array(analyser.frequencyBinCount);$('#micPanel').classList.remove('hidden');
    const tick=()=>{analyser.getByteTimeDomainData(data);let sum=0;for(const v of data){const x=(v-128)/128;sum+=x*x}const rms=Math.sqrt(sum/data.length);$('#meterBar').style.width=`${Math.min(100,rms*450)}%`;meterFrame=requestAnimationFrame(tick)};tick();
  }catch{}
}
function stopMicMeter(){if(meterFrame)cancelAnimationFrame(meterFrame);meterFrame=null;$('#meterBar').style.width='0%';$('#micPanel').classList.add('hidden');}
function tryRecognition(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  const r=new SR();r.lang='ko-KR';r.interimResults=false;r.maxAlternatives=1;
  r.onresult=e=>{$('#recognizedText').textContent=e.results[0][0].transcript;$('#recognitionBox').classList.remove('hidden')};
  try{r.start()}catch{}
}

function startPhonation(){
  phonationStart=performance.now();phonationValue=null;$('#phonationStartBtn').disabled=true;$('#phonationStopBtn').disabled=false;
  clearInterval(phonationTimer);phonationTimer=setInterval(()=>{$('#phonationTime').textContent=((performance.now()-phonationStart)/1000).toFixed(1)},100);
}
function stopPhonation(){
  if(!phonationStart)return;phonationValue=(performance.now()-phonationStart)/1000;clearInterval(phonationTimer);phonationTimer=null;phonationStart=null;
  $('#phonationTime').textContent=phonationValue.toFixed(1);$('#phonationStartBtn').disabled=false;$('#phonationStopBtn').disabled=true;
}
function beep(){
  try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=700;g.gain.value=.05;o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.045);const dot=$('#beatDot');dot.classList.add('active');setTimeout(()=>dot.classList.remove('active'),110)}catch{}
}
function toggleMetronome(forceOff=false){
  if(forceOff||metroOn){clearInterval(metroTimer);metroTimer=null;metroOn=false;$('#metroBtn').textContent='▶ 시작';$('#beatDot').classList.remove('active');return;}
  const bpm=Number($('#bpmSelect').value)||60;metroOn=true;$('#metroBtn').textContent='■ 멈춤';beep();metroTimer=setInterval(beep,60000/bpm);
}
function stopAllTools(){
  if(mediaRecorder&&mediaRecorder.state!=='inactive')stopRecording();
  if(phonationTimer||phonationStart)stopPhonation();
  toggleMetronome(true);stopMicMeter();
  if('speechSynthesis'in window)speechSynthesis.cancel();
}

function recordCurrentAndAdvance(){
  const {m,step}=current();
  completedItems.push({module:m,stepId:step.id,rating,phonationSeconds:phonationValue?Number(phonationValue.toFixed(1)):null});
  if(stepIndex<activePlan.length-1){stepIndex++;renderStep()}else finish(false);
}
function finish(early=false){
  stopAllTools();
  const seconds=Math.max(1,Math.round((Date.now()-startedAt)/1000));
  const ratings=completedItems.map(x=>x.rating).filter(Boolean); const avg=ratings.length?ratings.reduce((a,b)=>a+b,0)/ratings.length:null;
  const moduleSet=[...new Set(completedItems.map(x=>x.module))];
  const h=getHistory();h.push({version:2,date:todayKey(),timestamp:Date.now(),seconds,items:completedItems.length,plannedItems:activePlan.length,avgRating:avg,modules:moduleSet,early,details:completedItems});saveHistory(h);
  $('#summaryText').textContent=early?'피로를 고려해 여기까지 연습한 것도 충분한 기록입니다.':'오늘 계획한 훈련을 완료했습니다. 다음 훈련 전까지 목소리와 몸을 편안하게 쉬어주세요.';
  $('#completionStats').innerHTML=`<div><span>완료 과제</span><b>${completedItems.length}개</b></div><div><span>훈련 시간</span><b>${Math.max(1,Math.round(seconds/60))}분</b></div><div><span>평균 체감</span><b>${avg?avg.toFixed(1)+'/5':'-'}</b></div>`;
  $('#progressBar').style.width='100%';show('complete');updateStats();
}

function renderHistory(){
  const h=getHistory().slice().reverse(),week=lastNDaysHistory(7);const ratings=week.map(x=>Number(x.avgRating)).filter(x=>x>0);
  $('#historyWeekSessions').textContent=week.length;$('#historyWeekMinutes').textContent=`${Math.round(week.reduce((a,b)=>a+(Number(b.seconds)||0),0)/60)}분`;$('#historyWeekRating').textContent=ratings.length?(ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1)+'/5':'-';
  $('#historyList').innerHTML=h.length?h.slice(0,30).map(x=>{
    const mods=(x.modules||[]).map(m=>modules[m]?.label||m).join(' · ');
    return `<div class="item"><div class="item-head"><b>${escapeHTML(x.date||'')}</b><span>${Math.max(1,Math.round((Number(x.seconds)||0)/60))}분</span></div><div>${Number(x.items)||0}개 과제${x.avgRating?` · 체감 ${Number(x.avgRating).toFixed(1)}/5`:''}${x.early?' · 조기 종료':''}</div>${mods?`<small>${escapeHTML(mods)}</small>`:''}</div>`
  }).join(''):'<p>아직 저장된 훈련 기록이 없습니다.</p>';
}
function exportCSV(){
  const h=getHistory();if(!h.length){alert('내보낼 훈련 기록이 없습니다.');return;}
  const rows=[['날짜','시간(분)','완료과제','계획과제','평균체감(1-5)','영역','조기종료']];
  h.forEach(x=>rows.push([x.date,Math.round((Number(x.seconds)||0)/60),x.items||0,x.plannedItems||x.items||0,x.avgRating?Number(x.avgRating).toFixed(2):'',(x.modules||[]).map(m=>modules[m]?.label||m).join('|'),x.early?'예':'아니오']));
  const csv='\uFEFF'+rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=`말또박_훈련기록_${todayKey()}.csv`;a.click();URL.revokeObjectURL(a.href);
}

function renderSettings(){
  $('#nicknameInput').value=settings.nickname||'';$$('[data-module-toggle]').forEach(el=>el.checked=settings.enabledModules.includes(el.dataset.moduleToggle));
  $$('#sessionLengthGroup button').forEach(b=>b.classList.toggle('selected',b.dataset.length===settings.sessionLength));
  $('#ttsRateInput').value=settings.ttsRate;$('#ttsRateLabel').textContent=`${Number(settings.ttsRate).toFixed(2)}배`;$('#largeTextToggle').checked=!!settings.largeText;$('#simpleModeToggle').checked=!!settings.simpleMode;renderCustomPhrases();
}
function renderCustomPhrases(){
  const list=settings.customPhrases||[];$('#customPhraseList').innerHTML=list.length?list.map((p,i)=>`<div class="phrase-chip"><span>${escapeHTML(p)}</span><button data-delete-phrase="${i}" aria-label="문장 삭제">삭제</button></div>`).join(''):'<p class="help">아직 추가한 문장이 없습니다.</p>';
}
function addCustomPhrase(){
  const v=$('#customPhraseInput').value.trim();if(!v)return;if((settings.customPhrases||[]).length>=12){alert('맞춤 문장은 최대 12개까지 저장할 수 있습니다.');return;}
  settings.customPhrases=[...(settings.customPhrases||[]),v];$('#customPhraseInput').value='';renderCustomPhrases();
}
function saveSettingsFromUI(){
  const enabled=$$('[data-module-toggle]:checked').map(x=>x.dataset.moduleToggle);if(!enabled.length){alert('훈련 영역을 하나 이상 선택해 주세요.');return;}
  settings={...settings,nickname:$('#nicknameInput').value.trim(),enabledModules:enabled,ttsRate:Number($('#ttsRateInput').value),largeText:$('#largeTextToggle').checked,simpleMode:$('#simpleModeToggle').checked};saveSettings();applySettings();show('home');
}
function resetSettings(){if(!confirm('맞춤 설정과 나만의 문장을 초기값으로 되돌릴까요? 훈련 기록은 삭제하지 않습니다.'))return;settings={...DEFAULT_SETTINGS,enabledModules:[...DEFAULT_SETTINGS.enabledModules],customPhrases:[]};saveSettings();applySettings();renderSettings();}

function renderAAC(){
  const custom=(settings.customPhrases||[]).map(p=>[p,'나만의 문장']);const all=[...custom,...AAC_DEFAULTS];
  $('#aacGrid').innerHTML=all.map(([p,c])=>`<button class="aac-card" data-aac="${escapeHTML(p)}">${escapeHTML(p)}<small>${escapeHTML(c)}</small></button>`).join('');
}

$('#listenBtn').onclick=()=>{const step=current()?.step;if(step?.speak)speak(step.speak)};
$('#recordBtn').onclick=startRecording;$('#stopBtn').onclick=stopRecording;
$('#phonationStartBtn').onclick=startPhonation;$('#phonationStopBtn').onclick=stopPhonation;$('#metroBtn').onclick=()=>toggleMetronome(false);$('#bpmSelect').onchange=()=>{if(metroOn){toggleMetronome(true);toggleMetronome(false)}};
$('#ratingRow').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;rating=Number(b.dataset.rating);$$('#ratingRow button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#nextBtn').disabled=false;});
$('#fatigueCheck').onchange=e=>$('#restNotice').classList.toggle('hidden',!e.target.checked);
$('#nextBtn').onclick=recordCurrentAndAdvance;
$('#backBtn').onclick=()=>{if(!confirm('현재 훈련을 종료할까요? 완료한 과제가 있으면 그 내용까지만 저장할 수 있습니다.'))return;if(completedItems.length){finish(true)}else{show('home')}};
$('#homeBtn').onclick=()=>show('home');$$('[data-go-home]').forEach(b=>b.onclick=()=>show('home'));$$('[data-module]').forEach(b=>b.onclick=()=>startModule(b.dataset.module));$$('[data-start-session]').forEach(b=>b.onclick=startDaily);
$('#historyBtn').onclick=()=>{renderHistory();show('history')};$('#settingsBtn').onclick=()=>{renderSettings();show('settings')};$('#openAACBtn').onclick=()=>{renderAAC();show('aac')};
$('#exportBtn').onclick=exportCSV;$('#addPhraseBtn').onclick=addCustomPhrase;$('#customPhraseInput').addEventListener('keydown',e=>{if(e.key==='Enter')addCustomPhrase()});
$('#customPhraseList').addEventListener('click',e=>{const b=e.target.closest('[data-delete-phrase]');if(!b)return;settings.customPhrases.splice(Number(b.dataset.deletePhrase),1);renderCustomPhrases()});
$('#sessionLengthGroup').addEventListener('click',e=>{const b=e.target.closest('[data-length]');if(!b)return;settings.sessionLength=b.dataset.length;$$('#sessionLengthGroup button').forEach(x=>x.classList.toggle('selected',x===b))});
$('#ttsRateInput').oninput=e=>$('#ttsRateLabel').textContent=`${Number(e.target.value).toFixed(2)}배`;$('#saveSettingsBtn').onclick=saveSettingsFromUI;$('#resetSettingsBtn').onclick=resetSettings;
$('#largeTextToggle').onchange=e=>document.body.classList.toggle('large-text',e.target.checked);
$('#textSizeBtn').onclick=()=>{settings.largeText=!settings.largeText;saveSettings();applySettings()};
$('#aacGrid').addEventListener('click',e=>{const b=e.target.closest('[data-aac]');if(b)speak(b.dataset.aac)});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#installBtn').classList.remove('hidden')});
$('#installBtn').onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installBtn').classList.add('hidden')};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');

applySettings();updateStats();
