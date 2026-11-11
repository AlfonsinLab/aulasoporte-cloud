'use strict';
const $ = id => document.getElementById(id);
let incidencias = [];
let toastTimer;
function notify(message) {
  const el = $('message');
  el.textContent = message; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}
async function json(url, options) {
  const resp = await fetch(url, options);
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || 'No se pudo completar la solicitud');
  return data;
}
function cell(tr, value, className) {
  const td = document.createElement('td');
  td.textContent = value;
  if (className) td.className = className;
  tr.appendChild(td);
  return td;
}
function draw() {
  const search = $('search').value.toLocaleLowerCase('es');
  const filter = $('filter').value;
  const filtered = incidencias.filter(x => (!filter || x.estado === filter) && (`${x.id} ${x.titulo} ${x.categoria} ${x.responsable}`).toLocaleLowerCase('es').includes(search));
  const rows = $('rows'); rows.replaceChildren();
  if (!filtered.length) {const tr = document.createElement('tr'); const td = cell(tr, 'No hay incidencias que coincidan con los filtros.');td.colSpan = 7;rows.appendChild(tr)}
  for (const x of filtered) {
    const tr = document.createElement('tr');
    cell(tr, `#${x.id}`); cell(tr, x.titulo); cell(tr, x.categoria);
    cell(tr, x.prioridad, `priority-${x.prioridad.toLowerCase()}`);
    const st = document.createElement('td'); const pill = document.createElement('span'); pill.className = `pill status-${x.estado.toLowerCase().replaceAll(' ', '-')}`; pill.textContent = x.estado;st.appendChild(pill);tr.appendChild(st);
    cell(tr, x.responsable);
    const actions = document.createElement('td'); const select = document.createElement('select'); select.className = 'change-status'; select.setAttribute('aria-label', `Estado incidencia ${x.id}`);
    for (const estado of ['Pendiente', 'En curso', 'Resuelta']) {const option = new Option(estado, estado, false, estado === x.estado); select.add(option)}
    select.addEventListener('change', async () => {try{ await json(`/api/incidencias/${x.id}`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({estado:select.value})});await refresh();notify('Estado actualizado correctamente');}catch(e){notify(e.message);select.value=x.estado;}});
    actions.appendChild(select);tr.appendChild(actions);rows.appendChild(tr);
  }
  $('count').textContent = `Mostrando ${filtered.length} de ${incidencias.length} incidencias`;
}
async function refresh(){
  incidencias = await json('/api/incidencias');
  const stats = await json('/api/estadisticas');
  $('stat-total').textContent=stats.total;$('stat-pendiente').textContent=stats.pendientes;$('stat-curso').textContent=stats.enCurso;$('stat-resuelta').textContent=stats.resueltas;
  draw();
}
async function init() {
  try {
    const config = await json('/api/config');
    $('brand-name').textContent = config.nombre;
    $('env-name').textContent = config.entorno;
    $('version').textContent = `v${config.version}`;
    document.title = `${config.nombre} · Gestión de incidencias`;
    await refresh();
  } catch(e) {notify(`No se pudo conectar al servidor: ${e.message}`);}
}
$('filter').addEventListener('change',draw);$('search').addEventListener('input',draw);
$('new-button').addEventListener('click',()=>$('dialog').showModal());
$('close').addEventListener('click',()=>$('dialog').close());$('cancel').addEventListener('click',()=>$('dialog').close());
$('form').addEventListener('submit',async e => {
  e.preventDefault();
  const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));
  try {await json('/api/incidencias',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});$('dialog').close();form.reset();await refresh();notify('Incidencia creada. Los datos son temporales.');}catch(err){notify(err.message)}
});
init();
