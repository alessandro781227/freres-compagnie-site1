const faces = document.getElementById('faces');
if (faces) {
  faces.innerHTML = '<img src="/assets/portrait-pattern.png" alt="">'.repeat(24);
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

const progress = document.getElementById('scrollProgress');
if (progress) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? 100 * window.scrollY / max : 0) + '%';
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();
}

// Navigation claire et accessible sur mobile.
const menuButton = document.querySelector('.mobile-nav-toggle');
const mainNavigation = document.getElementById('main-navigation');
if (menuButton && mainNavigation) {
  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    mainNavigation.classList.toggle('is-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mainNavigation.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => {
    if (!mainNavigation.contains(e.target) && !menuButton.contains(e.target)) setMenu(false);
  });
}

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


// Compact, accessible service cards on mobile; desktop layout unchanged.
document.querySelectorAll('#services .service-toggle').forEach(button=>{
  button.addEventListener('click',()=>{
    const card=button.closest('.card');
    const willOpen=!card.classList.contains('is-open');
    document.querySelectorAll('#services .card.is-open').forEach(openCard=>{
      openCard.classList.remove('is-open');
      openCard.querySelector('.service-toggle').setAttribute('aria-expanded','false');
    });
    if(willOpen)card.classList.add('is-open');
    button.setAttribute('aria-expanded',String(willOpen));
  });
});
