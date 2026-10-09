(function(){
  [].forEach.call(document.querySelectorAll('.slider'),function(s){
    var track=s.querySelector('.slides'),p=s.querySelector('.prev'),n=s.querySelector('.next');
    function upd(){p.disabled=track.scrollLeft<8;n.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-8;}
    function go(d){var w=track.querySelector('.slide').getBoundingClientRect().width+20;track.scrollBy({left:d*w,behavior:'smooth'});}
    p._wired=n._wired=true;p.addEventListener('click',function(){go(-1)});n.addEventListener('click',function(){go(1)});
    track.addEventListener('scroll',upd,{passive:true});upd();
  });
  var q=document.getElementById('mn-q'),cnt=document.getElementById('mn-n'),none=document.getElementById('mn-none'),
      secs=[].slice.call(document.querySelectorAll('.ch')),chips=[].slice.call(document.querySelectorAll('.chip')),ban=document.querySelector('.packban');
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  secs.forEach(function(s){s._t=norm(s.textContent)});
  q.addEventListener('input',function(){
    var w=norm(q.value).split(/\s+/).filter(Boolean),hit=0;
    secs.forEach(function(s){var ok=w.every(function(x){return s._t.indexOf(x)>-1});s.hidden=!ok;if(ok)hit++;});
    chips.forEach(function(c){var s=document.getElementById(c.dataset.id);c.hidden=!!(w.length&&s&&s.hidden);});
    if(ban)ban.hidden=w.length>0;
    cnt.textContent=w.length?hit+(hit===1?' chapter':' chapters'):'';
    none.style.display=w.length&&!hit?'block':'none';
  });
  chips.forEach(function(c){c.addEventListener('click',function(e){
    e.preventDefault(); if(q.value){q.value='';q.dispatchEvent(new Event('input'));}
    var s=document.getElementById(c.dataset.id); if(s) s.scrollIntoView({behavior:'smooth',block:'start'});
    history.replaceState(null,'','#'+c.dataset.id);
  });});
  if('IntersectionObserver' in window){
    var bar=document.querySelector('.chips');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){chips.forEach(function(c){var on=c.dataset.id===e.target.id;c.classList.toggle('on',on);if(on&&bar)bar.scrollTo({left:c.offsetLeft-bar.clientWidth/2+c.offsetWidth/2,behavior:'smooth'});});}});},{rootMargin:'-40% 0px -55% 0px'});
    secs.forEach(function(s){io.observe(s)});
  }
})();
/* 2 Oct 2026: live Diamond screens for the manual. Each .lv[data-scene] plays a loop while it is on screen;
   with reduced motion it shows one still frame. Screens follow output/diamond-brief/UI; battery always 100 % (guide rule). */
(function(){
  var BOLT='<svg viewBox="0 0 10 14"><path d="M6 0 0 8h4l-1 6 7-9H6l1-5z"/></svg>';
  var HINT={turn:['Turn','<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M13 8a5 5 0 1 1-1.6-3.7"/><path d="M12 1.5v3.2H8.8"/></svg>'],
    click:['Click','<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.2" fill="currentColor"/><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".5"/></svg>'],
    click2:['Click twice','<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="4.6" cy="8" r="2.6"/><circle cx="11.4" cy="8" r="2.6"/></svg>'],
    hold:['Hold 3 seconds','<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="28 40"/></svg>'],
    slow:['Turn slowly','<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M13 8a5 5 0 1 1-1.6-3.7"/><path d="M12 1.5v3.2H8.8"/></svg>'],
    fast:['Turn fast','<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M13 8a5 5 0 1 1-1.6-3.7"/><path d="M12 1.5v3.2H8.8"/><path d="M3 13l2-2"/></svg>'],
    click4:['Click four times','<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="4.5" cy="4.5" r="2.2"/><circle cx="11.5" cy="4.5" r="2.2"/><circle cx="4.5" cy="11.5" r="2.2"/><circle cx="11.5" cy="11.5" r="2.2"/></svg>'],
    click5:['Click five times','<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.9"/><circle cx="8" cy="8" r="1.9"/><circle cx="13" cy="8" r="1.9"/><circle cx="5.5" cy="3.5" r="1.9"/><circle cx="10.5" cy="3.5" r="1.9"/></svg>'],
    save:['Click to save','<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.2" fill="currentColor"/><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".5"/></svg>']};
  var SCR={
    start:'<div class="lv__bat">'+BOLT+'100%</div><i class="arr l"></i><i class="arr r2"></i><div class="t-start">Start<br>Pre-heat</div>',
    timer:'<div class="t-cap mono r" style="margin:0">Pre-heat timer</div><div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#2a2a2e" stroke-width="3.2"/><circle class="arc" cx="50" cy="50" r="46" fill="none" stroke="#e2614c" stroke-width="3.2" stroke-linecap="round" pathLength="100" stroke-dasharray="53 100"/></svg><b data-k="tm">08:00</b></div><div class="t-cap mono" style="color:#f0e8d8;letter-spacing:.12em;margin:0">mm:ss</div>',
    pre:'<div class="lv__bat">'+BOLT+'100%</div><div class="t-lbl">Pre-heating</div><div class="t-big" data-k="pt">3:30</div><div class="t-mid" data-k="pc">275°C</div><div class="t-cap">Remaining</div>',
    adj:'<div class="lv__bat">'+BOLT+'100%</div><div class="t-huge" data-k="at">275<sup>°</sup></div><div class="t-cap" style="margin-top:6cqw">Adjust temp</div>',
    ses:'<div class="lv__bat">'+BOLT+'100%</div><div class="t-huge" data-k="st">280<sup>°</sup></div><div class="t-time" data-k="sm">18:42</div><div class="t-cap mono">Running</div>',
    /* 3 Oct, Vadim: once the dial is locked a small lock stays next to the battery until four clicks unlock it */
    sesl:'<div class="lv__bat"><svg class="lk" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'+BOLT+'100%</div><div class="t-huge" data-k="st">280<sup>°</sup></div><div class="t-time" data-k="sm">18:42</div><div class="t-cap mono">Running</div>',
    ver:'<div class="t-cap">Software</div><div class="t-mid" style="color:#f0e8d8;margin-top:2cqw">1 Oct 2026</div>',
    off:'',
    menu:'<div class="lv__bat">'+BOLT+'100%</div><i class="arr l"></i><i class="arr r2"></i><svg viewBox="0 0 24 24" style="width:11cqw;height:11cqw;fill:none;stroke:#f0e8d8;stroke-width:1.8;margin-bottom:2cqw"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg><div class="t-start">Menu</div>',
    lock:'<div class="lv__bat">'+BOLT+'100%</div><svg viewBox="0 0 24 24" style="width:16cqw;height:16cqw;fill:none;stroke:#f0e8d8;stroke-width:1.6"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><div class="t-lbl">Dial locked</div>',
    bat:'<svg viewBox="0 0 60 30" style="width:24cqw;height:12cqw"><rect x="1.5" y="1.5" width="51" height="27" rx="5" fill="none" stroke="#f0e8d8" stroke-width="3"/><rect x="55" y="9" width="4" height="12" rx="1.5" fill="#f0e8d8"/><rect x="6" y="6" width="42" height="18" rx="2" fill="#7eae82"/></svg><div class="t-big" style="margin-top:3cqw">100%</div><div class="t-cap">Battery</div>',
    qt:'<div class="lv__bat">'+BOLT+'100%</div><i class="arr l"></i><i class="arr r2"></i><div class="t-start">Pre-heat<br>Timer</div><div class="t-mid" style="color:#f0e8d8;margin-top:2cqw" data-k="qtm">07:00</div>',
    can:'<div class="lv__bat">'+BOLT+'100%</div><div class="t-q">Cancel<br>Pre-heat?</div><div class="pills"><span class="pill" data-k="no">No</span><span class="pill" data-k="yes">Yes</span></div>'
  };
  function mmss(s){var m=Math.floor(s/60),x=s%60;return m+':'+(x<10?'0':'')+x}
  function mm2(s){var m=Math.floor(s/60),x=s%60;return(m<10?'0':'')+m+':'+(x<10?'0':'')+x}
  // a step: [screen, values, ms, hint, press]
  var SCENES={
    timer:function(){return[['qt',{},1300],['qt',{},500,'click',1],['timer',{tm:420},900],['timer',{tm:480},700,'turn'],['timer',{tm:540},700,'turn'],['timer',{tm:600},900,'turn'],['timer',{tm:600},700,'save',1],['start',{},1300]]},
    start:function(){var a=[['start',{},1400],['start',{},420,'click',1]];for(var s=420;s>=408;s--)a.push(['pre',{pt:s,pc:275},s===420?700:260]);return a},
    temp:function(){var a=[['pre',{pt:210,pc:275},1100],['pre',{pt:209,pc:275},700]];for(var c=276;c<=285;c++)a.push(['adj',{at:c},150,'turn']);a.push(['adj',{at:285},900]);for(var s=208;s>=204;s--)a.push(['pre',{pt:s,pc:285},s===208?900:500]);return a},
    session:function(){var a=[];for(var m=1122;m<=1124;m++)a.push(['ses',{st:280,sm:m},900]);for(var c=275;c>=265;c-=5)a.push(['adj',{at:c},380,'turn']);a.push(['adj',{at:265},800]);for(m=1126;m<=1128;m++)a.push(['ses',{st:265,sm:m},900]);return a},
    stop:function(){return[['pre',{pt:200,pc:275},1100],['pre',{pt:199,pc:275},260,'click2',1],['pre',{pt:199,pc:275},180,'click2'],['pre',{pt:199,pc:275},260,'click2',1],['can',{sel:'no'},1300],['can',{sel:'yes'},1100,'turn'],['can',{sel:'yes'},600,'click',1],['start',{},1500]]},
    /* 3 Oct, Vadim: the quick start in one clip: set 7 minutes, start, then turn to your heat */
    /* 3 Oct, Vadim: Start Pre-heat runs straight away on the Default, 7 minutes at 275 °C; the time is set from its own item */
    qstart:function(){var a=[['start',{},1400],['start',{},380,'click',1]];for(var s=420;s>=417;s--)a.push(['pre',{pt:s,pc:275},700]);
      for(var c=274;c>=260;c--)a.push(['adj',{at:c},110,'turn']);a.push(['adj',{at:260},900]);for(s=415;s>=413;s--)a.push(['pre',{pt:s,pc:260},700]);return a},
    qtimer:function(){return[['qt',{},1400],['qt',{},500,'click',1],['timer',{tm:420},900],['timer',{tm:480},700,'turn'],['timer',{tm:540},900,'turn'],['timer',{tm:540},700,'save',1],['start',{},1400]]},
    quick:function(){var a=[['start',{},1200],['timer',{tm:480},900,'turn']];for(var t=420;t>=420;t-=60)a.push(['timer',{tm:t},420,'turn']);
      a.push(['timer',{tm:420},700,'save',1]);a.push(['start',{},900]);a.push(['start',{},420,'click',1]);
      for(var s=420;s>=416;s--)a.push(['pre',{pt:s,pc:275},450]);for(var c=274;c>=255;c--)a.push(['adj',{at:c},110,'turn']);
      a.push(['adj',{at:255},900]);for(s=414;s>=411;s--)a.push(['pre',{pt:s,pc:255},450]);return a},
    /* 3 Oct, Vadim: the dial, one gesture at a time */
    hold:function(){return[['off',{},1300],['off',{},900,'hold',1],['off',{},900,'hold',1],['off',{},900,'hold',1],['start',{},2200]]},
    slow:function(){var a=[['adj',{at:275},900]];for(var c=276;c<=281;c++)a.push(['adj',{at:c},520,'slow']);a.push(['adj',{at:281},1400]);return a},
    fast:function(){var a=[['adj',{at:275},900]];for(var c=280;c<=310;c+=5)a.push(['adj',{at:c},160,'fast']);a.push(['adj',{at:310},1400]);return a},
    click:function(){return[['ses',{st:275,sm:600},1300],['ses',{st:275,sm:601},300,'click',1],['menu',{},2200]]},
    click2:function(){return[['pre',{pt:300,pc:275},1300],['pre',{pt:299,pc:275},220,'click2',1],['pre',{pt:299,pc:275},140,'click2'],['pre',{pt:299,pc:275},220,'click2',1],['can',{sel:'no'},2200]]},
    click4:function(){var a=[['ses',{st:275,sm:600},1200]],i;for(i=0;i<4;i++){a.push(['ses',{st:275,sm:600},170,'click4',1]);a.push(['ses',{st:275,sm:600},110,'click4'])}a.push(['lock',{},1800]);
      a.push(['sesl',{st:275,sm:601},1000]);a.push(['sesl',{st:275,sm:602},900,'turn']);a.push(['sesl',{st:275,sm:603},900,'turn']);a.push(['sesl',{st:275,sm:604},1000]);
      for(i=0;i<4;i++){a.push(['sesl',{st:275,sm:605},170,'click4',1]);a.push(['sesl',{st:275,sm:605},110,'click4'])}a.push(['ses',{st:275,sm:606},1000]);a.push(['ses',{st:280,sm:607},1600,'turn']);return a},
    ver:function(){var a=[['off',{},1200]];for(var i=0;i<5;i++){a.push(['off',{},170,'click5',1]);a.push(['off',{},110,'click5'])}a.push(['ver',{},2600]);return a},
    level:function(){return[['off',{},1300],['off',{},300,'click',1],['bat',{},2400]]},
    brk:function(){var a=[['ses',{st:260,sm:1500},1200]];for(var c=255;c>=180;c-=5)a.push(['adj',{at:c},110,'fast']);a.push(['adj',{at:180},900]);
      for(var m=1501;m<=1504;m++)a.push(['ses',{st:180,sm:m},800]);return a},
    up:function(){var a=[['ses',{st:180,sm:1500},1200]];for(var c=185;c<=265;c+=5)a.push(['adj',{at:c},110,'fast']);a.push(['adj',{at:265},900]);a.push(['ses',{st:265,sm:1501},1300]);return a},
    down:function(){var a=[['ses',{st:265,sm:1500},1300]];for(var c=264;c>=245;c--)a.push(['adj',{at:c},110,'turn']);a.push(['adj',{at:245},900]);a.push(['ses',{st:245,sm:1501},1300]);return a},
    steps:function(){return[['ses',{st:290,sm:30},1300,'',0,'s290'],['ses',{st:290,sm:600},900,'',0,'s290'],['adj',{at:280},300,'turn'],['adj',{at:270},700,'turn'],['ses',{st:270,sm:1500},1400,'',0,'s270'],['adj',{at:260},300,'turn'],['adj',{at:250},700,'turn'],['ses',{st:250,sm:2700},1600,'',0,'s250']]}
  };
  window.LVsetup=setup;
  function setup(el){
    var name=el.dataset.scene,steps=SCENES[name]&&SCENES[name]();if(!steps)return;
    var used={};steps.forEach(function(s){used[s[0]]=1});
    el.innerHTML=Object.keys(used).map(function(k){return'<div class="lv__s" data-s="'+k+'">'+SCR[k]+'</div>'}).join('');
    var host=el.closest('.ts__pic,.mac,.qs__mac,.pic,.tdemo')||el.parentNode,hint=document.createElement('span');hint.className='lv-hint';host.appendChild(hint);
    var linked=el.dataset.link?document.querySelectorAll(el.dataset.link):[];
    function show(st){
      var k=st[0],v=st[1]||{};
      [].forEach.call(el.children,function(c){c.classList.toggle('on',c.dataset.s===k)});
      var q=function(x){return el.querySelector('[data-s="'+k+'"] [data-k="'+x+'"]')};
      if(k==='timer'){q('tm').textContent=mm2(v.tm);el.querySelector('.arc').setAttribute('stroke-dasharray',(v.tm/900*100).toFixed(1)+' 100')}
      if(k==='pre'){q('pt').textContent=mmss(v.pt);q('pc').textContent=v.pc+'°C'}
      if(k==='adj')q('at').innerHTML=v.at+'<sup>°</sup>';
      if(k==='ses'||k==='sesl'){q('st').innerHTML=v.st+'<sup>°</sup>';q('sm').textContent=mmss(v.sm)}
      if(k==='can'){q('no').classList.toggle('sel',v.sel==='no');q('yes').classList.toggle('sel',v.sel==='yes')}
      var h=st[3]&&HINT[st[3]];if(h)hint.innerHTML=h[1]+h[0];hint.classList.toggle('on',!!h);
      var tv=v.at||v.tm||v.pt||0,tk=/^(turn|slow|fast)$/.test(st[3]||'');
      if(tk){var dir=(el._lt!==undefined&&tv<el._lt&&k===el._lk)?'tr-ccw':'tr-cw';var now=Date.now();if(!el._arcT||now-el._arcT>900||!el.classList.contains(dir)){el.classList.remove('tr-cw','tr-ccw');void el.offsetWidth;el.classList.add(dir);el._arcT=now}}el._lt=tv;el._lk=k;
      el.classList.toggle('press',!!st[4]);var fg=host.querySelector('.finger');if(fg)fg.classList.toggle('on',!!st[4]||(st[3]==='hold'));
      if(st[5])[].forEach.call(linked,function(x){x.classList.toggle('on',x.dataset.k===st[5])});
    }
    var still=+(el.dataset.still||0);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){show(steps[still]);return}
    var i=0,timer=null,vis=false;el._stop=function(){clearTimeout(timer);vis=true};
    function tick(){show(steps[i]);var d=steps[i][2];i=(i+1)%steps.length;timer=setTimeout(tick,i===0?d+500:d)}
    show(steps[still]);
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting&&!vis){vis=true;i=0;tick()}else if(!e.isIntersecting&&vis){vis=false;clearTimeout(timer)}})},{threshold:.35}).observe(el)}
    else tick();
  }
  [].forEach.call(document.querySelectorAll('.lv[data-scene]'),setup);
})();
/* 2 Oct: the mesh cards are tabs; the chosen method opens right below */
(function(){
  var cards=[].slice.call(document.querySelectorAll('.mpick__c[data-mesh]'));
  cards.forEach(function(c){c.addEventListener('click',function(){
    var open=!c.classList.contains('on');
    cards.forEach(function(x){var on=open&&x===c;x.classList.toggle('on',on);x.setAttribute('aria-expanded',on);var p=document.getElementById('pack-'+x.dataset.mesh);if(p)p.classList.toggle('on',on);});
    if(open)setTimeout(function(){var r=c.getBoundingClientRect();if(r.top<0||r.top>innerHeight*.5)scrollTo({top:r.top+scrollY-90,behavior:'smooth'})},60);
  });});
})();
/* 2 Oct, Vadim: show that the steps can be swiped: the first slider nudges once, with a "Swipe" line under every slider on phones */
(function(){
  var sl=[].slice.call(document.querySelectorAll('.tslider'));
  sl.forEach(function(s){var t=s.querySelector('.slides'),n=t?t.children.length:0;
    if(n>1){var d=document.createElement('div');d.className='tsdots';d.innerHTML=new Array(n+1).join('<i></i>');s.appendChild(d);
      var dots=d.querySelectorAll('i');dots[0].classList.add('on');
      t.addEventListener('scroll',function(){var w=t.children[0].getBoundingClientRect().width+16,i=Math.round(t.scrollLeft/w);[].forEach.call(dots,function(x,j){x.classList.toggle('on',j===i)})},{passive:true});
      var h=document.createElement('p');h.className='swipehint';h.innerHTML='<b>‹</b> Swipe for the next step';s.appendChild(h);
      t.addEventListener('scroll',function(){h.style.display='none'},{passive:true,once:true});}});
  if(!sl.length||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var first=sl[0].querySelector('.slides');
  new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){o.disconnect();setTimeout(function(){first.classList.add('nudge');setTimeout(function(){first.classList.remove('nudge')},1200)},400)}})},{threshold:.6}).observe(first);
})();
/* 3 Oct, Vadim: scrolling up normally brings back only the chapter bar; the site menu comes back only on a strong
   scroll up (a long way, or a fast flick) or near the top. One class on <html> decides; no per-frame fighting with the theme. */
(function(){
  var f=document.querySelector('.finder');if(!f)return;
  var root=document.documentElement,hdr=document.querySelector('.site-header'),last=scrollY,up=0,tick=false;
  if(hdr)root.style.setProperty('--hdr-h',hdr.offsetHeight+'px');
  function apply(){var y=scrollY,d=y-last;
    if(d>4){up=0;if(y>400)f.classList.add('away')}else if(d<-4){up-=d;if(up>140)f.classList.remove('away')}   /* 3 Oct: a little scroll first */
    var show=y<220||up>900||d<-120;
    root.classList.toggle('hdr-hide',!show&&y>120);root.classList.toggle('hdr-show',show&&y>=220);
    document.body.classList.toggle('bar-on',!f.classList.contains('away')&&y>300);
    last=y;tick=false}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(apply)}},{passive:true});
})();
/* 3 Oct, Vadim: the dial in coals, played on a real Diamond; and the heat finder. Session heat (Vadim, 3 Oct):
   Virginia: basket 245–255 °C, flat 220–240 °C. Dark leaf the same difference, about 20 °C up. Flat runs cooler than basket. */
(function(){
  var COALS=[[1,180,215],[2,215,250],[3,250,285],[4,285,321]];
  function coals(t){for(var i=0;i<COALS.length;i++)if(t<COALS[i][2])return COALS[i][0];return 4}
  function scr(el){el.innerHTML='<div class="lv__s on"><div class="lv__bat"><svg viewBox="0 0 10 14"><path d="M6 0 0 8h4l-1 6 7-9H6l1-5z"/></svg>100%</div><div class="t-huge" data-k="t">275<sup>°</sup></div><div class="t-cap" data-k="c">Adjust temp</div></div>';return{t:el.querySelector('[data-k="t"]'),c:el.querySelector('[data-k="c"]')}}
  function lightRow(row,n,lab){[].forEach.call(row.querySelectorAll('i'),function(x,i){x.classList.toggle('lit',i<n)});if(lab)lab.textContent=n+(n>1?' coals':' coal')}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* manual: 180 → 320 and back, coals light up as it climbs */
  [].forEach.call(document.querySelectorAll('.dialplay'),function(d){
    var s=scr(d.querySelector('.lv')),row=d.querySelector('.coalrow'),lab=d.querySelector('.coalrow+p'),t=180,dir=1,timer;
    function step(){s.t.innerHTML=t+'<sup>°</sup>';lightRow(row,coals(t),lab);t+=dir*5;if(t>=320||t<=180)dir=-dir;timer=setTimeout(step,t%35===0?700:90)}
    if(reduce){t=275;s.t.innerHTML='275<sup>°</sup>';lightRow(row,coals(275),lab);return}
    new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!timer)step()}else{clearTimeout(timer);timer=null}})},{threshold:.3}).observe(d);
  });
  /* packing guide: pick leaf, mesh, taste: the dial turns to your heat */
  var H={virginia:{basket:[245,255],flat:[220,240],pre:'Pre-heat 7 minutes at 255–275 °C.'},dark:{basket:[265,275],flat:[240,260],pre:'Pre-heat a little longer; the strongest like up to 290 °C.'}};
  [].forEach.call(document.querySelectorAll('.hf-old'),function(f){
    var s=scr(f.querySelector('.lv')),row=f.querySelector('.coalrow'),lab=f.querySelector('.coalrow+p'),st={leaf:'virginia',mesh:'basket',taste:'soft'},cur=275,anim;
    s.c.textContent='Smoke at';
    function go(){var r=H[st.leaf][st.mesh],tgt=st.taste==='soft'?r[0]:r[1];
      f.querySelector('.hf__out strong').textContent='Smoke at '+tgt+' °C';
      f.querySelector('.hf__out span').textContent=H[st.leaf].pre+' Then turn the dial to '+tgt+' °C. '+(st.mesh==='flat'?'The flat screen holds more heat: stay low and step up only if the smoke is thin.':'The basket lets air through: if the smoke is thin, go up 5 °C at a time.');
      clearInterval(anim);if(reduce){cur=tgt;s.t.innerHTML=cur+'<sup>°</sup>';lightRow(row,coals(cur),lab);return}
      anim=setInterval(function(){cur+=cur<tgt?1:-1;s.t.innerHTML=cur+'<sup>°</sup>';lightRow(row,coals(cur),lab);if(cur===tgt)clearInterval(anim)},18)}
    [].forEach.call(f.querySelectorAll('[data-hf]'),function(b){b.addEventListener('click',function(){var k=b.dataset.hf,v=b.dataset.v;st[k]=v;
      [].forEach.call(f.querySelectorAll('[data-hf="'+k+'"]'),function(x){x.setAttribute('aria-pressed',x===b)});go()})});
    go();
  });
})();

/* 3 Oct, Vadim: the dial lab: pick a gesture, watch it on the real screen */
(function(){
  [].forEach.call(document.querySelectorAll('.dlab'),function(lab){
    var btns=[].slice.call(lab.querySelectorAll('[data-g]')),cap=lab.querySelector('.dlab__cap');
    function play(b){btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      var old=lab.querySelector('.lv');if(old&&old._stop)old._stop();var h=lab.querySelector('.lv-hint');if(h)h.remove();
      var n=document.createElement('div');n.className='lv';n.dataset.scene=b.dataset.g;n.setAttribute('role','img');n.setAttribute('aria-label',b.textContent);
      old.replaceWith(n);if(window.LVsetup)window.LVsetup(n);cap.innerHTML='<b>'+b.querySelector('b').textContent+'</b> '+b.dataset.d}
    btns.forEach(function(b){b.addEventListener('click',function(){play(b)})});
    if(btns[0])play(btns[0]);
  });
})();

/* 3 Oct, Vadim: the heat finder: tobacco, strength, flavour. No mesh, no coals. Rules from Vadim (3 Oct):
   Virginia about 255 °C, minty or perfumed blends lower (about 235 °C) with a longer pre-heat; dark leaf higher, the strongest
   like a pre-heat up to 290 °C; desserts and nuts a little lower. Default pre-heat 7 min at 275 °C. Numbers between are Claude's. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BASE={virginia:252,dark:270,mix:262},PROF={virginia:'Phoenix',dark:'Wraith',mix:'Default'};
  function calc(st){var t=BASE[st.leaf]+(st.str==='strong'?5:-5),pre='7 minutes at 275 °C (Default)',prof=PROF[st.leaf];
    if(st.leaf==='dark'&&st.str==='strong'){pre='7 minutes at 290 °C';prof='Oracle'}
    else if(st.leaf==='dark'){pre='7 minutes at 280 °C'}
    if(st.fl==='dessert')t-=10;
    if(st.fl==='mint'){t=st.leaf==='virginia'?235:t-12;pre='7 minutes at 255 °C, gentler'}
    return{t:Math.round(t/5)*5,pre:pre,prof:prof}}
  [].forEach.call(document.querySelectorAll('.hf2'),function(f){
    var lv=f.querySelector('.lv');lv.innerHTML='<div class="lv__s on"><div class="lv__bat"><svg viewBox="0 0 10 14"><path d="M6 0 0 8h4l-1 6 7-9H6l1-5z"/></svg>100%</div><div class="t-huge" data-k="t">275<sup>°</sup></div><div class="t-cap">Session heat</div></div>';
    var tEl=lv.querySelector('[data-k="t"]'),st={leaf:'virginia',str:'soft',fl:'fruit'},cur=275,anim;
    function go(){var r=calc(st);
      f.querySelector('.hf2__t').textContent=r.t+' °C';
      f.querySelector('.hf2__pre').textContent=r.pre;
      f.querySelector('.hf2__prof').textContent=r.prof;
      clearInterval(anim);lv.classList.add('press');setTimeout(function(){lv.classList.remove('press')},250);
      if(reduce){cur=r.t;tEl.innerHTML=cur+'<sup>°</sup>';return}
      anim=setInterval(function(){cur+=cur<r.t?1:-1;tEl.innerHTML=cur+'<sup>°</sup>';if(cur===r.t)clearInterval(anim)},20)}
    [].forEach.call(f.querySelectorAll('[data-hf]'),function(b){b.addEventListener('click',function(){st[b.dataset.hf]=b.dataset.v;
      [].forEach.call(f.querySelectorAll('[data-hf="'+b.dataset.hf+'"]'),function(x){x.setAttribute('aria-pressed',x===b)});go()})});
    go();
  });
})();
/* 4 Oct: slider arrows on pages without the manual's own script (cleaning, quick start) */
(function(){
  [].forEach.call(document.querySelectorAll('.slider'),function(s){
    var t=s.querySelector('.slides'),p=s.querySelector('.prev'),n=s.querySelector('.next');
    if(!t||!p||!n||p._wired)return;p._wired=n._wired=true;
    function u(){p.disabled=t.scrollLeft<8;n.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-8}
    function g(d){var w=t.querySelector('.slide').getBoundingClientRect().width+20;t.scrollBy({left:d*w,behavior:'smooth'})}
    p.addEventListener('click',function(){g(-1)});n.addEventListener('click',function(){g(1)});t.addEventListener('scroll',u,{passive:true});u();
  });
})();
/* 3 Oct, Vadim: Out of the box: tap a part to see what it is; its line in the list lights up, and the other way round */
(function(){
  [].forEach.call(document.querySelectorAll('.box__img'),function(b){
    var cap=b.querySelector('.box__cap'),list=b.parentNode.querySelector('.boxlist'),tiles=[].slice.call(b.querySelectorAll('.bx[data-tile]')),
        rows=list?[].slice.call(list.querySelectorAll('li[data-tile]')):[];
    function pick(k,fromList){tiles.forEach(function(t){t.classList.toggle('on',t.dataset.tile===k)});
      var hit=rows.filter(function(r){return r.dataset.tile===k});rows.forEach(function(r){r.classList.toggle('on',hit.indexOf(r)>-1)});
      var t=tiles.filter(function(x){return x.dataset.tile===k})[0];
      if(cap&&t){var r=hit[0];cap.innerHTML='<b>'+t.getAttribute('aria-label')+'</b>'+(r?' '+r.querySelector('span').textContent:'');cap.classList.add('on')}
      if(!fromList&&hit[0]){var y=hit[0].getBoundingClientRect();if(y.top<b.getBoundingClientRect().bottom+8||y.bottom>innerHeight)scrollTo({top:scrollY+y.top-b.getBoundingClientRect().bottom-16,behavior:'smooth'})}}
    tiles.forEach(function(t){t.addEventListener('click',function(){pick(t.dataset.tile)});t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(t.dataset.tile)}})});
    rows.forEach(function(r){r.addEventListener('click',function(){pick(r.dataset.tile,true)})});
  });
})();
/* 3 Oct, Vadim: in a slider every picture sits at the same height, however long the text above it */
(function(){
  function eq(){[].forEach.call(document.querySelectorAll('.tslider'),function(s){var tx=[].slice.call(s.querySelectorAll('.ts__tx'));
    tx.forEach(function(t){t.style.minHeight=''});var m=0;tx.forEach(function(t){m=Math.max(m,t.getBoundingClientRect().height)});
    if(m)tx.forEach(function(t){t.style.minHeight=m+'px'})})}
  eq();addEventListener('load',eq);var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(eq,150)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(eq);
  [].forEach.call(document.querySelectorAll('.mpick__c'),function(c){c.addEventListener('click',function(){setTimeout(eq,30)})});
})();
/* 3 Oct, Vadim: a guide always starts at step one: no slider keeps an old position after a reload or a back navigation */
(function(){
  function reset(){[].forEach.call(document.querySelectorAll('.slides,.qs__track,.bs__list'),function(t){t.scrollLeft=0});
    [].forEach.call(document.querySelectorAll('.tsdots'),function(d){[].forEach.call(d.children,function(x,i){x.classList.toggle('on',i===0)})})}
  reset();addEventListener('pageshow',reset);addEventListener('load',function(){setTimeout(reset,0)});
})();
/* Smooth FAQ accordion */
(function(){
  [].forEach.call(document.querySelectorAll('.faq details'),function(d){
    var s=d.querySelector('summary');
    if(!s)return;
    /* wrap all non-summary children for height animation */
    var wrap=document.createElement('div');
    wrap.className='faq__wrap';
    [].slice.call(d.children).forEach(function(c){if(c!==s)wrap.appendChild(c);});
    d.appendChild(wrap);
    s.addEventListener('click',function(e){
      e.preventDefault();
      if(d.open){
        wrap.style.height=wrap.scrollHeight+'px';
        requestAnimationFrame(function(){wrap.style.height='0';});
        wrap.addEventListener('transitionend',function(){d.removeAttribute('open');wrap.style.height='';},{once:true});
      }else{
        d.setAttribute('open','');
        wrap.style.height='0';
        requestAnimationFrame(function(){requestAnimationFrame(function(){
          wrap.style.height=wrap.scrollHeight+'px';
          wrap.addEventListener('transitionend',function(){wrap.style.height='';},{once:true});
        });});
      }
    });
  });
})();