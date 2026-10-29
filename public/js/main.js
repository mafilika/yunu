(function(){
var C=window.SITE_CONTENT||{},$=function(s,r){return(r||document).querySelectorAll(s)};
function wa(){return (C.wa||'27730194559').replace(/\D/g,'')}
// content overrides from admin (js/content.js)
$('[data-k]').forEach(function(el){var k=el.dataset.k;
 if(k==='phonelink'&&C.phone)el.href='tel:'+C.phone.replace(/\s/g,'');
 else if(k==='emaillink'&&C.email)el.href='mailto:'+C.email;
 else if(C[k]&&k!=='phonelink'&&k!=='emaillink')el.textContent=C[k]});
$('[data-wa]').forEach(function(a){a.href='https://wa.me/'+wa()+'?text='+encodeURIComponent(a.dataset.msg||'Hello Tumza Bonny, I would like a quote.')});
var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
var mb=document.getElementById('mb'),nv=document.getElementById('nv');
if(mb)mb.onclick=function(){nv.classList.toggle('o')};
$('nav a').forEach(function(a){a.onclick=function(){nv.classList.remove('o')}});
var qf=document.getElementById('qf');
if(qf)qf.onsubmit=function(e){e.preventDefault();var wn=qf.dataset.wa||'';var m='Hello '+(qf.dataset.name||'')+'. I am '+qn.value+' ('+qp.value+'). Service: '+qs.value+'. '+qm.value;window.open('https://wa.me/'+wn+'?text='+encodeURIComponent(m),'_blank')};
function count(b){var m=b.dataset.n&&b.dataset.n.match(/^(\d+)(.*)$/);if(!m)return;var n=0,e=+m[1],s=m[2],i=setInterval(function(){n+=Math.ceil(e/30);if(n>=e){n=e;clearInterval(i)}b.textContent=n+s},40)}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');var b=x.target.querySelector('b[data-n]');if(b)count(b);io.unobserve(x.target)}})},{threshold:.12});
 $('.rv').forEach(function(e){io.observe(e)})}else $('.rv').forEach(function(e){e.classList.add('on')});
})();

(function(){
var all=[].slice.call(document.querySelectorAll('.gal a[data-full]'));if(!all.length)return;
all.forEach(function(a){var im=a.querySelector('img');function bad(){a.style.display='none'}im.addEventListener('error',bad);if(im.complete&&im.naturalWidth===0&&im.src)setTimeout(function(){if(im.naturalWidth===0)bad()},3000)});
var cur=0,lb;function vis(){return all.filter(function(a){return a.style.display!=='none'&&!a.hidden})}
function show(i){var v=vis();if(!v.length)return;cur=(i+v.length)%v.length;var a=v[cur];lb.querySelector('img').src=a.dataset.full;lb.querySelector('p').textContent=(a.dataset.cap||'')+' ('+(cur+1)+'/'+v.length+')'}
function close(){if(lb){lb.remove();lb=null;document.removeEventListener('keydown',key)}}
function key(e){if(e.key==='Escape')close();if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)}
function open(a){lb=document.createElement('div');lb.id='lb';lb.innerHTML='<button class="x" aria-label="Close">&times;</button><button class="p" aria-label="Previous">&#8249;</button><img alt=""><button class="n" aria-label="Next">&#8250;</button><p></p>';document.body.appendChild(lb);
lb.onclick=function(e){if(e.target===lb||e.target.className==='x')close()};lb.querySelector('.p').onclick=function(){show(cur-1)};lb.querySelector('.n').onclick=function(){show(cur+1)};document.addEventListener('keydown',key);show(vis().indexOf(a))}
all.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open(a)})});
[].slice.call(document.querySelectorAll('.flt button')).forEach(function(b){b.onclick=function(){[].slice.call(document.querySelectorAll('.flt button')).forEach(function(x){x.classList.remove('on')});b.classList.add('on');all.forEach(function(a){a.hidden=!!b.dataset.tag&&a.dataset.tag!==b.dataset.tag})}});
})();
