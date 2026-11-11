'use strict';

const express = require('express');
const path = require('node:path');
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '12kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const original = [
  { id: 101, titulo: 'No se puede acceder al aula virtual', categoria: 'Software', prioridad: 'Alta', estado: 'Pendiente', responsable: 'Equipo de soporte', fecha: '2026-11-04' },
  { id: 102, titulo: 'Impresora de secretaría sin conexión', categoria: 'Hardware', prioridad: 'Media', estado: 'En curso', responsable: 'Lucía', fecha: '2026-11-05' },
  { id: 103, titulo: 'Actualización de navegador pendiente', categoria: 'Software', prioridad: 'Baja', estado: 'Resuelta', responsable: 'Pablo', fecha: '2026-11-06' },
  { id: 104, titulo: 'Cortes intermitentes de conexión Wi-Fi', categoria: 'Redes', prioridad: 'Alta', estado: 'En curso', responsable: 'Equipo de redes', fecha: '2026-11-07' },
  { id: 105, titulo: 'Fallo al iniciar sesión en un equipo', categoria: 'Sistemas', prioridad: 'Media', estado: 'Pendiente', responsable: 'Equipo de soporte', fecha: '2026-11-09' },
  { id: 106, titulo: 'Solicitud de instalación de software', categoria: 'Software', prioridad: 'Baja', estado: 'Resuelta', responsable: 'Lucía', fecha: '2026-11-10' }
];
let incidencias = structuredClone(original);
let nextId = 107;
const estados = ['Pendiente', 'En curso', 'Resuelta'];
const prioridades = ['Alta', 'Media', 'Baja'];
const categorias = ['Hardware', 'Software', 'Redes', 'Sistemas', 'Otros'];

app.get('/api/salud', (_req, res) => res.json({ estado: 'ok', version: process.env.APP_VERSION || '1.0', servicio: 'gestor-incidencias' }));
app.get('/api/config', (_req, res) => res.json({ nombre: process.env.APP_NAME || 'AulaSoporte', entorno: process.env.APP_ENV || 'Demostración', version: process.env.APP_VERSION || '1.0' }));
app.get('/api/incidencias', (_req, res) => res.json(incidencias));

app.post('/api/incidencias', (req, res) => {
  const { titulo, categoria, prioridad } = req.body || {};
  if (typeof titulo !== 'string' || titulo.trim().length < 5 || titulo.trim().length > 100 || !categorias.includes(categoria) || !prioridades.includes(prioridad)) {
    return res.status(400).json({ error: 'Comprueba el título (5 a 100 caracteres), categoría y prioridad.' });
  }
  const incidencia = { id: nextId++, titulo: titulo.trim(), categoria, prioridad, estado: 'Pendiente', responsable: 'Sin asignar', fecha: new Date().toISOString().slice(0, 10) };
  incidencias.unshift(incidencia);
  res.status(201).json(incidencia);
});

app.patch('/api/incidencias/:id', (req, res) => {
  const item = incidencias.find(x => x.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Incidencia no encontrada.' });
  if (!req.body || !estados.includes(req.body.estado)) return res.status(400).json({ error: 'Estado no válido.' });
  item.estado = req.body.estado;
  res.json(item);
});

app.get('/api/estadisticas', (_req, res) => res.json({ total: incidencias.length, pendientes: incidencias.filter(x => x.estado === 'Pendiente').length, enCurso: incidencias.filter(x => x.estado === 'En curso').length, resueltas: incidencias.filter(x => x.estado === 'Resuelta').length }));

app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.listen(PORT, '0.0.0.0', () => console.log(`Gestor de incidencias escuchando en puerto ${PORT}`));
