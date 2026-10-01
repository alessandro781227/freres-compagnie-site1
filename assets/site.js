const faces = document.getElementById('faces');
if (faces) {
  faces.innerHTML = '<img src="/assets/portrait-pattern.png" alt="">'.repeat(56);
}

const animated=document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const delay=Number(entry.target.dataset.delay||0);
      setTimeout(()=>entry.target.classList.add('in-view'),delay);
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -4% 0px'});
animated.forEach(el=>observer.observe(el));

document.querySelectorAll('.section-line').forEach(line=>{
  const o=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in-view');o.unobserve(e.target)}
    });
  },{threshold:.45});
  o.observe(line);
});

fetch('/data/site.json', {cache:'no-store'})
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(data => {
    const applyPhoto = (selector, path) => {
      if (!path || typeof path !== 'string') return;
      const el = document.querySelector(selector);
      if (!el) return;
      const safe = path.replace(/["'()\\]/g, '');
      el.style.backgroundImage =
        `linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.16)),url("${safe}")`;
    };
    applyPhoto('.facade-photo', data.facade);
    applyPhoto('.interieur-photo', data.interieur);
    applyPhoto('.finitions-photo', data.finitions);
  })
  .catch(() => {});

const progress=document.getElementById('scrollProgress');
const counterJourney=document.getElementById('counterJourney');
const counterFill=document.getElementById('counterFill');
const m2Count=document.getElementById('m2Count');
const phaseText=document.getElementById('phaseText');
const phases=[document.getElementById('phase1'),document.getElementById('phase2'),document.getElementById('phase3')];

const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));

function setActivePhase(index){
  phases.forEach((el,i)=>el.classList.toggle('active',i===index));
}

function updateFX(){
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(max>0?(scrollY/max)*100:0)+'%';

  const jr=counterJourney.getBoundingClientRect();
  const total=jr.height-innerHeight;
  const p=total>0?clamp((-jr.top)/total,0,1):0;

  const value=Math.round(p*5320);
  m2Count.textContent=value;
  counterFill.style.setProperty('--fill',(p*100)+'%');

  if(p<0.34){
    setActivePhase(0);
    phaseText.textContent='Préparation des supports';
  } else if(p<0.68){
    setActivePhase(1);
    phaseText.textContent='Application en cours';
  } else {
    setActivePhase(2);
    phaseText.textContent='Finition et contrôle';
  }
}

addEventListener('scroll',updateFX,{passive:true});
addEventListener('resize',updateFX);
updateFX();

document.querySelectorAll('.work-slider').forEach(slider=>{
  const track=slider.querySelector('.work-track');
  const slides=[...slider.querySelectorAll('.work-slide')];
  const prev=slider.querySelector('.work-prev');
  const next=slider.querySelector('.work-next');
  const count=slider.querySelector('.work-count span');
  const dots=slider.querySelector('.work-dots');
  slides.forEach((_,i)=>{const d=document.createElement('span');d.className='work-dot'+(i===0?' active':'');dots.appendChild(d)});
  const dotEls=[...dots.children];
  const current=()=>Math.round(track.scrollLeft/Math.max(1,track.clientWidth));
  const go=i=>track.scrollTo({left:Math.max(0,Math.min(slides.length-1,i))*track.clientWidth,behavior:'smooth'});
  prev.addEventListener('click',()=>go(current()-1));
  next.addEventListener('click',()=>go(current()+1));
  track.addEventListener('scroll',()=>requestAnimationFrame(()=>{const i=Math.max(0,Math.min(slides.length-1,current()));count.textContent=String(i+1);dotEls.forEach((d,n)=>d.classList.toggle('active',n===i))}),{passive:true});
});
