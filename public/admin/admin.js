(function(){
var L,D,saved,ICONS=[],HIST=[],tab='settings',$=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function api(a,body){return fetch('/api/admin?a='+a,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-TB':'1'},body:body?JSON.stringify(body):undefined,credentials:'same-origin'}).then(function(r){return r.json().then(function(j){if(j.error)throw new Error(j.error);return j})})}
function snap(){return JSON.stringify(D)}
function get(p){return p.split('.').reduce(function(o,k){return o==null?o:o[k]},D)}
function set(p,v){var k=p.split('.'),last=k.pop(),o=k.reduce(function(o,x){return o[x]},D);o[last]=v}
function status(){var el=$('st'),dirty=snap()!==saved,diff=JSON.stringify(D)!==JSON.stringify(L);
 el.className='chip '+(dirty?'u':diff?'d':'l');el.textContent=dirty?'Unsaved changes':diff?'Draft saved, not published':'Live, no pending changes'}
function f(p,label,type,hint){var v=get(p);if(type==='lines')v=(v||[]).join('\n');var a=' data-p="'+p+'" data-t="'+(type||'text')+'"';
 return '<label>'+label+'</label>'+((type==='area'||type==='lines')?'<textarea'+a+'>'+esc(v)+'</textarea>':'<input'+a+' value="'+esc(v)+'">')+(hint?'<small>'+hint+'</small>':'')}
function btns(p,i){return '<span class="row"><button class="mini" data-act="up" data-p="'+p+'" data-i="'+i+'">Up</button><button class="mini" data-act="down" data-p="'+p+'" data-i="'+i+'">Down</button><button class="mini x" data-act="del" data-p="'+p+'" data-i="'+i+'">Delete</button></span>'}
var TABS={settings:'Business details',home:'Homepage',services:'Services (pages)',projects:'Projects',accreds:'Accreditations',gallery:'Gallery',seo:'Search (SEO)',more:'Earlier versions'};
function view(){
 $('tabs').innerHTML=Object.keys(TABS).map(function(k){return '<button data-tab="'+k+'" class="'+(k===tab?'on':'')+'">'+TABS[k]+'</button>'}).join('');
 var h='';
 if(tab==='settings')h='<h2>Business details</h2>'+f('settings.legal','Legal company name')+f('settings.name','Brand name (logo text)')+f('settings.reg','Registration number')+f('settings.phone','Phone number')+f('settings.wa','WhatsApp number (digits only, with country code)','text','Example: 27730194559')+f('settings.email','Email')+f('settings.address','Address')+f('settings.areas','Areas served','area','Comma separated list of towns and districts.');
 if(tab==='home')h='<h2>Homepage</h2>'+f('settings.tagline','Small tag above heading')+f('settings.heroTitle','Main heading')+f('settings.heroText','Intro text','area')+f('settings.about','About us text','area')+f('settings.equip','Equipment text','area')+'<h3 style="margin-top:20px">Statistics bar</h3>'+D.stats.map(function(s,i){return '<div class="sub2">'+f('stats.'+i+'.n','Number or word')+f('stats.'+i+'.l','Label')+btns('stats',i)+'</div>'}).join('')+'<p class="row"><button class="mini" data-act="add" data-p="stats">Add statistic</button></p>';
 if(tab==='services')h='<h2>Services</h2><p class="sub">Each service is its own page on the website. Add a service to create a new page. Delete one to remove its page.</p>'+D.services.map(function(v,i){var p='services.'+i,isNew=!L.services.some(function(x){return x.slug===v.slug});
  return '<details><summary><b>'+esc(v.name||'(new service)')+'</b></summary>'+f(p+'.name','Service name')+f(p+'.h1','Page heading','text','Include the service and the area, for example "Plumber in Winburg & the Free State".')+f(p+'.short','Short description (shown on cards)','area')+f(p+'.intro','Main text','area')+f(p+'.bullets','What we offer (one per line)','lines')+f(p+'.metaDesc','Google description','area','About 150 characters.')
  +'<label>Icon</label><select data-p="'+p+'.icon" data-t="text">'+ICONS.map(function(k){return '<option'+(k===v.icon?' selected':'')+'>'+k+'</option>'}).join('')+'</select>'
  +(isNew?f(p+'.slug','Web address','text','Letters and dashes only. Cannot be changed after publishing.'):'<small>Web address: services/'+esc(v.slug)+'.html</small>')
  +'<h4 style="margin-top:14px">Questions and answers (FAQ)</h4>'+v.faq.map(function(q,j){return '<div class="sub2">'+f(p+'.faq.'+j+'.q','Question')+f(p+'.faq.'+j+'.a','Answer','area')+'<span class="row"><button class="mini x" data-act="delfaq" data-p="'+p+'.faq" data-i="'+j+'">Delete question</button></span></div>'}).join('')+'<p class="row"><button class="mini" data-act="addfaq" data-p="'+p+'.faq">Add question</button></p>'+btns('services',i)+'</details>'}).join('')+'<p class="row"><button class="mini" data-act="add" data-p="services">Add new service</button></p>';
 if(tab==='projects')h='<h2>Completed projects</h2>'+D.projects.map(function(s,i){return '<div class="sub2">'+f('projects.'+i+'.t','Project')+f('projects.'+i+'.w','Client or location')+btns('projects',i)+'</div>'}).join('')+'<p class="row"><button class="mini" data-act="add" data-p="projects">Add project</button></p>';
 if(tab==='accreds')h='<h2>Accreditations</h2>'+D.accreds.map(function(s,i){return '<div class="sub2">'+f('accreds.'+i+'.t','Title')+f('accreds.'+i+'.d','Details')+btns('accreds',i)+'</div>'}).join('')+'<p class="row"><button class="mini" data-act="add" data-p="accreds">Add accreditation</button></p>';
 if(tab==='gallery')h='<h2>Gallery ('+D.gallery.length+' photos)</h2><p class="sub">Paste direct links to your photos, one per line. A direct link ends in .jpg, .jpeg, .png or .webp. Links from Google Drive, Google Photos, Facebook, Instagram or WhatsApp usually stop working, so host photos on Cloudinary or a similar image host first.</p><label>Paste image links (one per line)</label><textarea id="bulk" placeholder="https://example.com/photo1.jpg"></textarea><p class="row"><button class="mini" data-act="bulkadd">Add these photos</button></p>'+D.gallery.map(function(g,i){var bad=/drive\.google|photos\.google|photos\.app\.goo|facebook|fbcdn|instagram|whatsapp/i.test(g.url);return '<div class="sub2"><img src="'+esc(g.url)+'" alt="" loading="lazy" referrerpolicy="no-referrer" style="float:right;width:96px;height:72px;object-fit:cover;border-radius:6px;border:1px solid var(--line)">'+f('gallery.'+i+'.url','Photo link')+(bad?'<small style="color:#b5001a">This kind of link usually stops working. Use a direct image link instead.</small>':'')+f('gallery.'+i+'.caption','Caption (shown on the photo)')+f('gallery.'+i+'.tag','Category','text','For example Plumbing, Painting, Paving. Photos with the same category can be filtered.')+f('gallery.'+i+'.alt','Description for Google','text','Short description of what the photo shows.')+btns('gallery',i)+'</div>'}).join('');
 if(tab==='seo')h='<h2>Search engine settings</h2>'+f('settings.domain','Website address','text','Your real domain, for example https://www.yourdomain.co.za (used in Google links and the sitemap).')+f('settings.metaTitle','Homepage title for Google')+f('settings.metaDesc','Homepage description for Google','area','Keep it about 150 characters and include your main services and Winburg / Free State.')+'<p class="sub">Each service page has its own heading and Google description under Services.</p>';
 if(tab==='more')h='<h2>Earlier versions</h2><p class="sub">Every time you publish, the previous live version is kept. Restoring loads it as a draft that you still need to approve.</p>'+(HIST.length?HIST.map(function(x){return '<p class="row"><span>'+esc(x.replace('content-','').replace('.json',''))+'</span><button class="mini" data-act="restore" data-f="'+esc(x)+'">Load as draft</button></p>'}).join(''):'<p>No earlier versions yet.</p>')+'<p class="row"><button class="mini x" data-act="discard">Discard unpublished draft</button></p>';
 $('pane').innerHTML=h;status()}
function msg(t){$('st').textContent=t}
function save(){return api('save',{content:D}).then(function(r){D=r.draft;saved=snap();status();return r})}
document.addEventListener('input',function(e){var t=e.target,p=t.dataset&&t.dataset.p;if(!p)return;var v=t.value;if(t.dataset.t==='lines')v=v.split('\n');set(p,v);status()});
document.addEventListener('change',function(e){var t=e.target;if(t.tagName==='SELECT'&&t.dataset.p){set(t.dataset.p,t.value);status()}});
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(b.dataset.tab){tab=b.dataset.tab;view();return}
 var a=b.dataset.act;if(!a)return;var arr=b.dataset.p&&get(b.dataset.p),i=+b.dataset.i;
 var blank={stats:{n:'',l:''},services:{slug:'',icon:'construction',name:'New service',h1:'',short:'',intro:'',bullets:[],faq:[],metaDesc:''},projects:{t:'',w:''},gallery:{url:'',caption:'',alt:'',tag:''},accreds:{t:'',d:''}};
 if(a==='add'){arr.push(JSON.parse(JSON.stringify(blank[b.dataset.p])));view()}
 else if(a==='del'){if(confirm('Delete this item?')){arr.splice(i,1);view()}}
 else if(a==='up'&&i>0){arr.splice(i-1,0,arr.splice(i,1)[0]);view()}
 else if(a==='down'&&i<arr.length-1){arr.splice(i+1,0,arr.splice(i,1)[0]);view()}
 else if(a==='bulkadd'){var ls=($('bulk').value||'').split(/\s+/).filter(function(x){return /^https?:\/\//i.test(x)});if(!ls.length){alert('Paste links that start with https://');return}ls.forEach(function(u){if(D.gallery.length<200)D.gallery.push({url:u,caption:'',alt:'',tag:''})});view()}
 else if(a==='addfaq'){arr.push({q:'',a:''});view()}
 else if(a==='delfaq'){arr.splice(i,1);view()}
 else if(a==='discard'){if(confirm('Throw away all unpublished changes?'))api('discard',{}).then(function(r){L=r.live;D=JSON.parse(JSON.stringify(L));saved=snap();view()})}
 else if(a==='restore'){api('restore',{file:b.dataset.f}).then(function(r){D=r.draft;saved=snap();tab='settings';view();alert('Loaded as a draft. Review it, then press Approve & Publish.')}).catch(function(x){alert(x.message)})}
});
$('bs').onclick=function(){msg('Saving...');save().catch(function(x){alert(x.message);status()})};
$('bp').onclick=function(e){if(snap()!==saved){e.preventDefault();msg('Saving...');save().then(function(){window.open('/?preview=1','_blank')}).catch(function(x){alert(x.message)})}};
function changes(){var o=[],S=['settings','stats','projects','accreds','gallery'];L.gallery=L.gallery||[];S.forEach(function(k){if(JSON.stringify(L[k])!==JSON.stringify(D[k]))o.push('Updated: '+TABS[k==='stats'?'home':k==='settings'?'settings':k])});
 var ls={};L.services.forEach(function(v){ls[v.slug]=v});var ds={};D.services.forEach(function(v){ds[v.slug]=v;if(!ls[v.slug])o.push('New service page: '+v.name);else if(JSON.stringify(ls[v.slug])!==JSON.stringify(v))o.push('Edited service: '+v.name)});
 L.services.forEach(function(v){if(!ds[v.slug])o.push('REMOVED service page: '+v.name)});return o}
$('bu').onclick=function(){msg('Saving...');save().then(function(){var c=changes();$('mc').innerHTML=c.length?'<p>These changes will go live for all visitors:</p><ul class="ck">'+c.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'<p>There are no changes to publish.</p>';$('mok').hidden=!c.length;$('modal').hidden=false}).catch(function(x){alert(x.message)})};
$('mno').onclick=function(){$('modal').hidden=true};
$('mok').onclick=function(){$('mok').disabled=true;api('publish',{}).then(function(r){L=r.live;D=JSON.parse(JSON.stringify(L));saved=snap();HIST=r.history;$('modal').hidden=true;$('mok').disabled=false;view();alert('Published. The changes are now live.')}).catch(function(x){$('mok').disabled=false;alert(x.message)})};
window.addEventListener('beforeunload',function(e){if(snap()!==saved){e.preventDefault();e.returnValue=''}});
function boot(){api('load').then(function(r){L=r.live;D=r.draft;ICONS=r.icons;HIST=r.history;saved=snap();$('login').hidden=true;$('main').hidden=false;view()}).catch(function(x){$('pane').textContent='Could not load: '+x.message})}
$('bl').onclick=function(){api('logout',{}).then(function(){location.reload()})};
$('lg').onclick=function(){api('login',{password:$('lp').value}).then(boot).catch(function(x){$('le').textContent=x.message})};
$('lp').onkeydown=function(e){if(e.key==='Enter')$('lg').click()};
api('me').then(function(r){if(!r.configured){$('le').textContent='Admin password is not set yet. Add ADMIN_PASSWORD in Netlify (see setup steps).'}if(r.in)boot()});
})();
