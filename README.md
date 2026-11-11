# AulaSoporte — Gestor de incidencias

Proyecto didáctico para **2.º DAM — Digitalización aplicada al sector productivo**, Tema 3, Cloud Computing.

## Qué contiene

- Backend Node.js + Express (`server.js`).
- Interfaz web responsive (`public/`).
- API REST para consultar, añadir y cambiar el estado de incidencias.
- Datos ficticios precargados y estadísticas.
- Variables de entorno para comprobar cómo se configura una aplicación en PaaS.

**Importante:** los datos se guardan solo en memoria. Las nuevas incidencias y los cambios de estado se pierden cuando se reinicia o redepliega el servidor. Es intencionado: el proyecto no usa bases de datos de pago ni almacenamiento persistente. No introducir datos personales reales.

## Probar en local

Necesitas Node.js 20 o posterior. Desde esta carpeta:

```bash
npm install
npm start
```

Abre <http://localhost:3000>. Para detenerlo, pulsa `Ctrl+C`.

Endpoints para verificar el backend:
- `GET /api/salud`
- `GET /api/config`
- `GET /api/incidencias`
- `GET /api/estadisticas`

## Despliegue en Render (plan gratuito)

1. Crea un repositorio **privado** en GitHub y sube a él los archivos del proyecto, manteniendo `server.js`, `package.json` y `public/` en la raíz. **No subas `node_modules/`.**
2. En Render, selecciona **New → Web Service** y conecta el repositorio de GitHub.
3. Configura el servicio:
   - **Language / Runtime:** Node
   - **Branch:** `main` (o la rama que hayas utilizado)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type / Plan:** **Free** (comprueba que no aparezca ningún precio antes de crearlo)
4. Si te deja configurar variables de entorno, añade opcionalmente:
   - `APP_NAME=AulaSoporte`
   - `APP_ENV=Prácticas DAM`
   - `APP_VERSION=1.0`
5. Finaliza la creación, revisa el registro de despliegue (**Logs**) y abre la URL `https://...onrender.com` que Render te asigne.
6. Comprueba el panel, la búsqueda, el cambio de estado y la creación de incidencias. Comprueba también `https://TU_URL.onrender.com/api/salud`.
7. Para verificar un cambio de configuración, modifica `APP_NAME` o `APP_ENV` en el servicio (seguirá necesitando un reinicio o despliegue para tomar efecto según el proceso) o cambia el código en GitHub y realiza un nuevo despliegue.

### Evidencias recomendadas

- Captura de la aplicación en local.
- Captura del servicio Render con el plan Free y comandos configurados.
- Captura de los logs mostrando que el servidor se ha iniciado.
- URL pública funcionando y captura del panel.
- Captura de un cambio de variable o de una actualización de código.

## Limitaciones deliberadas

- No dispone de inicio de sesión ni autorización. Solo admite **datos ficticios**.
- Los datos nuevos y las modificaciones se pierden al reiniciar (RAM; no persistencia).
- El servicio gratuito de Render puede suspenderse tras 15 minutos sin tráfico y tardar en reactivarse.
- Evita repositorios que contengan secretos, contraseñas o información personal.

## Estructura

```
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── README.md
```

## Ampliación opcional: IaaS

Como actividad posterior, desplegar el mismo proyecto en una máquina virtual Linux y comparar qué debe administrar el alumnado (SO, Node.js, servidor web, actualizaciones, firewall...) respecto a Render.
