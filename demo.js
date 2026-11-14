'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const demo = document.body.dataset.demo;
  let timer;
  const notify = message => { $('#demo-toast').textContent = message; clearTimeout(timer); timer = setTimeout(() => { $('#demo-toast').textContent = ''; }, 2800); };
  const currency = number => '$' + number.toLocaleString('en-US');
  $$('.dialog-x').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('dialog').forEach(dialog => dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); }));

  if (demo === 'aether') {
    let tone = 'Professional';
    function draft() {
      const name = $('#product-name').value.trim();
      const purpose = $('#product-purpose').value.trim().replace(/[.!?]+$/, '');
      if (!name || !purpose) return;
      const versions = {
        Professional: `Introducing ${name}\n\nA more thoughtful way to ${purpose}.\n\n${name} starts with a simple idea: the tools you use should help you focus on what matters. Clearer steps, a calmer experience, and less getting in the way.\n\nExplore what’s possible with ${name}.`,
        Friendly: `Meet ${name}. Your next good idea starts here.\n\nEver wished you could ${purpose}? That’s what ${name} is here for.\n\nWe’re keeping it simple, thoughtful, and built around the way you work. Have a look around and make yourself at home.\n\nLet’s see what you can do with ${name}.`,
        Concise: `${name}. A clearer way forward.\n\n${name} helps you ${purpose}.\n\nLess friction. More focus. A useful place to start.\n\nDiscover ${name}.`
      };
      $('#draft-output').textContent = versions[tone];
    }
    $$('[data-tone]').forEach(button => button.addEventListener('click', () => { tone = button.dataset.tone; $$('[data-tone]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); draft(); }));
    $('#writing-form').addEventListener('submit', event => { event.preventDefault(); draft(); notify('Your draft is ready to edit and use.'); });
    $('#copy-draft').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#draft-output').textContent); notify('Draft copied.'); } catch { notify('Copy is unavailable here. You can select the draft text instead.'); } });
    draft();
  }

  if (demo === 'kanso') {
    const products = { lamp: {name:'The everyday lamp',price:89}, bag:{name:'The canvas companion',price:42}, mug:{name:'The slow morning cup',price:28}, tray:{name:'A place for the small things',price:36} };
    const cart = {};
    function renderCart() {
      const keys = Object.keys(cart).filter(key => cart[key] > 0);
      const count = keys.reduce((n,key) => n + cart[key],0);
      $('#cart-count').textContent = count;
      $('#cart-toggle').setAttribute('aria-label', `Open bag, ${count} items`);
      $('#cart-items').replaceChildren();
      if (!keys.length) { const p=document.createElement('p');p.style.cssText='font-size:12px;color:#8c9480';p.textContent='Your bag is empty. A little room for something useful.';$('#cart-items').append(p); }
      keys.forEach(key => {
        const row = document.createElement('div'); row.className = 'cart-row';
        const text=document.createElement('span');text.textContent=`${products[key].name} × ${cart[key]} — ${currency(products[key].price*cart[key])}`;
        const remove=document.createElement('button');remove.textContent='Remove one';remove.setAttribute('aria-label',`Remove one ${products[key].name}`);remove.addEventListener('click',()=>{cart[key]--;renderCart();});
        row.append(text,remove);$('#cart-items').append(row);
      });
      $('#cart-total').textContent = currency(keys.reduce((sum,key)=>sum+cart[key]*products[key].price,0));
    }
    $$('.add-product').forEach(button => button.addEventListener('click',()=>{const key=button.dataset.product;cart[key]=(cart[key]||0)+1;renderCart();notify(`${products[key].name} added to your demo bag.`);}));
    $('#cart-toggle').addEventListener('click',()=>{renderCart();$('#cart-dialog').showModal();});
    $$('.category-filters button').forEach(button=>button.addEventListener('click',()=>{$$('.category-filters button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$$('.product-tile').forEach(card=>{card.hidden=button.dataset.category!=='all'&&card.dataset.category!==button.dataset.category;});}));
    renderCart();
  }

  if (demo === 'pulse') {
    const data={week:{revenue:18420,customers:184,mrr:32800,churn:'1.8%',values:[1100,1400,1280,2700,3290,3750,4900],labels:['MON','TUE','WED','THU','FRI','SAT','SUN']},month:{revenue:72840,customers:712,mrr:35400,churn:'1.6%',values:[16200,18420,17380,20840],labels:['WEEK 1','WEEK 2','WEEK 3','WEEK 4']}};
    function render(period){
      const d=data[period];$$('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.period===period)));
      $('#pulse-stats').replaceChildren();
      [['GROSS REVENUE',currency(d.revenue),'Illustrative sales'],['NEW CUSTOMERS',d.customers.toLocaleString(),'Sample signups'],['MONTHLY RECURRING',currency(d.mrr),'Sample MRR'],['CHURN RATE',d.churn,'Sample churn']].forEach(([label,value,note])=>{const card=document.createElement('div');card.className='stat';const a=document.createElement('span');a.textContent=label;const b=document.createElement('strong');b.textContent=value;const c=document.createElement('small');c.textContent=note;card.append(a,b,c);$('#pulse-stats').append(card);});
      const max=Math.max(...d.values)*1.15;
      const points=d.values.map((v,i)=>[20+i*(510/(d.values.length-1)),155-v/max*140]);
      const line=points.map((p,i)=>(i?'L':'M')+p.join(',')).join(' ');
      $('#pulse-chart').innerHTML=`<defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9290e8" stop-opacity=".3"/><stop offset="100%" stop-color="#9290e8" stop-opacity="0"/></linearGradient></defs><path d="M20 30H530 M20 75H530 M20 120H530 M20 160H530" stroke="#26364e" fill="none"/><path d="${line} L530 165 L20 165Z" fill="url(#area)"/><path d="${line}" fill="none" stroke="#a19bef" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>${points.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#aaa5f4"><title>${d.labels[i]}: ${currency(d.values[i])}</title></circle>`).join('')}`;
      $('#pulse-chart').setAttribute('aria-label',`${period==='week'?'7 day':'30 day'} sample gross revenue: ${currency(d.revenue)}. ${d.labels.map((label,i)=>`${label}: ${currency(d.values[i])}`).join('; ')}`);
      $('#pulse-labels').replaceChildren();d.labels.forEach(label=>{const span=document.createElement('span');span.textContent=label;$('#pulse-labels').append(span);});
    }
    const customers=[{name:'North Studio',plan:'Professional',amount:89},{name:'Cedar & Co.',plan:'Team',amount:149},{name:'Alex Morgan',plan:'Starter',amount:29},{name:'Acme Labs',plan:'Professional',amount:89}];
    function subscriptions(){const q=$('#subscription-search').value.toLowerCase().trim();const selected=customers.filter(c=>(c.name+' '+c.plan).toLowerCase().includes(q));$('#subscription-rows').replaceChildren();selected.forEach(c=>{const row=document.createElement('tr');[c.name,c.plan,'Active',currency(c.amount)+'/mo'].forEach((value,i)=>{const cell=document.createElement('td');if(i===2){const tag=document.createElement('span');tag.className='tx-status';tag.textContent=value;cell.append(tag);}else cell.textContent=value;row.append(cell);});$('#subscription-rows').append(row);});$('#subscription-summary').textContent=`${selected.length} sample subscriptions shown`;}
    $$('[data-period]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.period)));$('#subscription-search').addEventListener('input',subscriptions);render('week');subscriptions();
  }

  if (demo === 'haven') {
    const homes=[{id:'willow',name:'The Willow Residence',area:'central',label:'Central district',price:2400,beds:'2 beds · 2 baths · 940 sq ft'},{id:'riverside',name:'Riverside Court',area:'riverside',label:'Riverside district',price:1800,beds:'1 bed · 1 bath · 680 sq ft'},{id:'cedar',name:'Cedar Heights',area:'central',label:'Central district',price:3200,beds:'3 beds · 2 baths · 1,240 sq ft'}];
    const saved=new Set();
    function render(){const area=$('#property-area').value;const budget=$('#property-budget').value;const selected=homes.filter(h=>(area==='all'||h.area===area)&&(budget==='all'||h.price<=Number(budget)));$('#property-grid').replaceChildren();selected.forEach(h=>{const card=document.createElement('article');card.className='property-card';card.innerHTML='<div class="property-image" aria-hidden="true"><div class="building"></div><div class="building b2"></div><div class="building b3"></div></div>';const button=document.createElement('button');button.className='save-property';button.textContent='♡';button.setAttribute('aria-label',`Save ${h.name}`);button.setAttribute('aria-pressed',String(saved.has(h.id)));button.addEventListener('click',()=>{if(saved.has(h.id))saved.delete(h.id);else saved.add(h.id);button.setAttribute('aria-pressed',String(saved.has(h.id)));button.textContent=saved.has(h.id)?'♥':'♡';notify(saved.has(h.id)?'Sample home saved in this tab.':'Sample home removed from saved.');});const details=document.createElement('div');details.className='property-details';const name=document.createElement('h3');name.textContent=h.name;const description=document.createElement('p');description.textContent=h.label+' / '+h.beds;const bottom=document.createElement('div');const price=document.createElement('span');price.textContent=currency(h.price);const small=document.createElement('small');small.textContent='per month · sample';bottom.append(price,small);details.append(name,description,bottom);card.append(button,details);$('#property-grid').append(card);});$('#property-count').textContent=`${String(selected.length).padStart(2,'0')} SAMPLE HOMES` ;$('#property-empty').hidden=selected.length>0;}
    $('#property-search').addEventListener('submit',event=>{event.preventDefault();render();notify('Sample properties filtered.');});render();
  }

  if (demo === 'flowboard') {
    let nextId=6;
    let tasks=[{id:1,title:'Map the onboarding journey',description:'Find the clearest path from first visit to first useful moment.',status:'planned',label:'PRODUCT'},{id:2,title:'Explore the visual direction',description:'A quieter palette. A stronger type system.',status:'planned',label:'DESIGN'},{id:3,title:'Build the landing page',description:'Responsive sections, clear copy, and the little details.',status:'progress',label:'DEVELOPMENT'},{id:4,title:'Connect the product API',description:'Make the interface and the data work together.',status:'progress',label:'ENGINEERING'},{id:5,title:'Define the launch scope',description:'The right first version, with a clear finish line.',status:'done',label:'PLANNING'}];
    const columns=[['planned','Planned'],['progress','In progress'],['done','Done']];
    function render(){ $('#task-board').replaceChildren();columns.forEach(([status,name])=>{const list=tasks.filter(t=>t.status===status);const col=document.createElement('section');col.className='board-column';col.setAttribute('aria-label',name);const heading=document.createElement('h2');heading.className='column-heading';heading.textContent=name;const count=document.createElement('span');count.textContent=list.length;heading.append(count);col.append(heading);list.forEach(task=>{const card=document.createElement('article');card.className='task-card';card.dataset.status=task.status;const label=document.createElement('span');label.className='task-label';label.textContent=task.label;const title=document.createElement('h3');title.textContent=task.title;const desc=document.createElement('p');desc.textContent=task.description;const footer=document.createElement('div');footer.className='task-footer';const avatar=document.createElement('span');avatar.className='task-avatar';avatar.textContent='RQ';const button=document.createElement('button');button.className=status==='done'?'delete-task':'move-task';button.textContent=status==='planned'?'Start task →':status==='progress'?'Mark done ✓':'Remove task';button.setAttribute('aria-label',`${button.textContent}: ${task.title}`);button.addEventListener('click',()=>{if(task.status==='done')tasks=tasks.filter(t=>t.id!==task.id);else task.status=task.status==='planned'?'progress':'done';render();notify('Board updated.');});footer.append(avatar,button);card.append(label,title,desc,footer);col.append(card);});$('#task-board').append(col);});$('#task-summary').textContent=`${tasks.length} tasks · ${tasks.filter(t=>t.status==='done').length} completed`; }
    $('#add-task').addEventListener('click',()=>{$('#task-dialog').showModal();$('#task-title').focus();});$('#task-form').addEventListener('submit',event=>{event.preventDefault();const title=$('#task-title').value.trim();if(!title)return;tasks.push({id:nextId++,title,description:$('#task-description').value.trim(),status:$('#task-status').value,label:'NEW TASK'});render();$('#task-dialog').close();$('#task-form').reset();notify('Task added to your local board.');});render();
  }
})();
