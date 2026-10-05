const sections=[
['inicio','🏠 Inicio'],['trabajo','💼 Trabajo'],['gym','🏋️ Gimnasio'],['alimentacion','🍽️ Alimentación'],
['sueno','😴 Sueño'],['finanzas','💰 Finanzas'],['tiempo','🎮 Tiempo libre'],['habitos','🔥 Hábitos']
];
const nav=document.getElementById('nav'), app=document.getElementById('app');
sections.forEach(([id,n])=>{let b=document.createElement('button');b.textContent=n;b.onclick=()=>show(id);b.dataset.id=id;nav.appendChild(b)});
let state=JSON.parse(localStorage.getItem('pc-state')||'null')||{
tasks:[], habits:[], expenses:[], savings:0, income:0
};
function save(){localStorage.setItem('pc-state',JSON.stringify(state))}
function show(id){
document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.id===id));
let title=sections.find(x=>x[0]===id)?.[1]||'PROYECTO CONTROL';
if(id==='inicio') return home();
app.innerHTML=`<div class="card"><h2>${title}</h2>${content(id)}</div>`;
bind(id);
}
function home(){
let today=new Date().toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long'});
let done=state.tasks.filter(x=>x.done).length;
app.innerHTML=`<div class="card"><h2>Hoy</h2><p class="muted">${today}</p>
<div class="grid"><div class="stat"><b>${state.tasks.length}</b><span class="muted">Tareas</span></div>
<div class="stat"><b>${done}</b><span class="muted">Completadas</span></div>
<div class="stat"><b>S/ ${Number(state.savings).toFixed(2)}</b><span class="muted">Ahorro</span></div>
<div class="stat"><b>${state.habits.length}</b><span class="muted">Hábitos</span></div></div></div>
<div class="card"><h2>⚡ Acción rápida</h2><input id="quick" placeholder="¿Qué tienes que hacer hoy?"><button class="primary" onclick="addTask()">Agregar tarea</button></div>
<div class="card"><h2>📋 Mis tareas</h2>${taskList()}</div>`;
}
function taskList(){if(!state.tasks.length)return '<p class="muted">Todavía no tienes tareas.</p>';
return state.tasks.map((t,i)=>`<div class="item"><span><input class="check" type="checkbox" ${t.done?'checked':''} onchange="toggleTask(${i})"> ${escapeHtml(t.text)}</span><button class="danger" onclick="delTask(${i})">✕</button></div>`).join('')}
function addTask(){let x=document.getElementById('quick')?.value.trim();if(!x)return;state.tasks.push({text:x,done:false});save();home()}
function toggleTask(i){state.tasks[i].done=!state.tasks[i].done;save();home()}
function delTask(i){state.tasks.splice(i,1);save();home()}
function content(id){
if(id==='finanzas')return `<p class="muted">Control simple de ingresos, gastos y ahorro.</p><label>Ingreso</label><input id="income" type="number" value="${state.income}" placeholder="0"><label>Ahorro acumulado</label><input id="savings" type="number" value="${state.savings}" placeholder="0"><button class="primary" onclick="saveMoney()">Guardar</button><hr><h3>Registrar gasto</h3><input id="expense" type="number" placeholder="Monto en soles"><input id="expenseName" placeholder="¿En qué gastaste?"><button class="primary" onclick="addExpense()">Registrar</button><div>${state.expenses.map((e,i)=>`<div class=item><span>${escapeHtml(e.name)}</span><b>S/ ${Number(e.amount).toFixed(2)}</b></div>`).join('')}</div>`;
if(id==='habitos')return `<p class="muted">Construye rachas y controla los hábitos que quieres mejorar.</p><input id="habit" placeholder="Ej.: no fumar / entrenar / estudiar"><button class="primary" onclick="addHabit()">Añadir hábito</button>${state.habits.map((h,i)=>`<div class=item><span>🔥 ${escapeHtml(h.name)}</span><button class="danger" onclick="delHabit(${i})">✕</button></div>`).join('')}`;
let desc={
trabajo:'Planifica tus responsabilidades y avances laborales.',
gym:'Registra tus entrenamientos y mantén constancia.',
alimentacion:'Organiza comidas, agua y preparación.',
sueno:'Define una hora objetivo para dormir y despertar.',
tiempo:'Reserva tiempo para descansar sin perder el control.'
}[id];
return `<p>${desc}</p><label>Objetivo de esta semana</label><textarea id="goal" placeholder="Escribe aquí...">${localStorage.getItem('goal-'+id)||''}</textarea><button class="primary" onclick="saveGoal('${id}')">Guardar objetivo</button>`;
}
function bind(id){}
function saveGoal(id){localStorage.setItem('goal-'+id,document.getElementById('goal').value);alert('Objetivo guardado');}
function saveMoney(){state.income=Number(document.getElementById('income').value||0);state.savings=Number(document.getElementById('savings').value||0);save();show('finanzas')}
function addExpense(){let amount=Number(document.getElementById('expense').value||0),name=document.getElementById('expenseName').value.trim()||'Gasto';if(amount){state.expenses.push({amount,name,date:Date.now()});save();show('finanzas')}}
function addHabit(){let n=document.getElementById('habit').value.trim();if(n){state.habits.push({name:n});save();show('habitos')}}
function delHabit(i){state.habits.splice(i,1);save();show('habitos')}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
let deferred;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.getElementById('install').style.display='inline-block'});
document.getElementById('install').onclick=async()=>{if(deferred){deferred.prompt();deferred=null}else alert('En Chrome: menú ⋮ → Añadir a pantalla de inicio')}
show('inicio');
