/**
 * Inline script for <head>: runs before first paint, independent of the React bundle.
 * 1. Adds `js` to <html>, which is the only thing that lets scroll-reveal content start hidden.
 * 2. Watches every [data-reveal] element (including ones added later by client navigation)
 *    and marks it [data-shown] the first time it enters the view.
 * 3. Safety net, independent of IntersectionObserver: on scroll (at most once per frame), anything
 *    that has reached the reveal line or been scrolled past is shown. This catches elements a very
 *    fast scroll skips over, and any browser whose observer treats a target differently.
 *    It stops listening once everything has been revealed.
 * 4. Decides, before anything is drawn, whether the homepage intro plays (components/home/IntroOverlay.tsx):
 *    only on the homepage of either language, once per browser tab, and never with reduced motion.
 */
export const revealScript = `(function(){
  var d=document.documentElement; d.classList.add('js');
  try{var p=location.pathname;if((p==='/'||p==='/ar'||p==='/ar/')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('me-intro')){d.classList.add('intro');sessionStorage.setItem('me-intro','1');}}catch(e){}
  if(!('IntersectionObserver' in window)){d.classList.remove('js');return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-shown','');io.unobserve(e.target);}});},{rootMargin:'0px 0px -12% 0px'});
  function watch(n){if(n.nodeType!==1)return; if(n.matches('[data-reveal]:not([data-shown])'))io.observe(n); n.querySelectorAll('[data-reveal]:not([data-shown])').forEach(function(el){io.observe(el);});}
  new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(watch);});}).observe(d,{childList:true,subtree:true});
  var ticking=false;
  function sweep(){ticking=false;var lim=innerHeight*0.88,els=d.querySelectorAll('[data-reveal]:not([data-shown])'),left=0;
    for(var i=0;i<els.length;i++){if(els[i].getBoundingClientRect().top<lim){els[i].setAttribute('data-shown','');io.unobserve(els[i]);}else left++;}
    if(!left&&d.readyState==='complete')removeEventListener('scroll',onScroll);}
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(sweep);}}
  addEventListener('scroll',onScroll,{passive:true});
})();`;
