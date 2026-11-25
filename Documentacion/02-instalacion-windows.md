# Práctica: instalación del entorno de Seguimiento de Retos

Fecha de revisión: 4 de noviembre de 2026. Plataforma: Windows 10/11 de 64 bits y PowerShell.

## Propósito y entrega

Al terminar tendrás MySQL, Python, Django, Angular, Ionic y las herramientas Android preparados. Ejecutarás una plantilla web y generarás una APK de depuración. Las pantallas del sistema y sus modelos Django se desarrollarán en las siguientes etapas.

Trabaja en orden. Ejecuta los bloques uno por uno y comprueba el resultado antes de continuar. Los comandos de instalación de esta guía se ejecutan en el equipo de cada estudiante; no se han ejecutado automáticamente en el equipo del docente.

Entrega un informe con versiones, verificaciones y dificultades resueltas. No incluyas contraseñas ni el contenido de `.env`.

## 0. Preparar la terminal

Abre **Windows PowerShell**. No copies símbolos como `PS>` o `mysql>` cuando aparezcan en una consola. Los bloques `powershell` se ejecutan en PowerShell y los bloques `sql`, dentro del cliente MySQL.

```powershell
$PSVersionTable.PSVersion
winget --version
```

Si no existe `winget`, instala o actualiza **Instalador de aplicación**, de Microsoft, desde Microsoft Store. Los instaladores oficiales indicados en cada sección son una alternativa.

Usa una cuenta con permiso para instalar programas. Acepta la elevación de Windows cuando el instalador la solicite. Cierra y abre PowerShell después de instalar herramientas para actualizar el PATH.

## 1. Instalar y comprobar MySQL

### 1.1. Comprobar si hay un servidor previo

Si tienes XAMPP, su botón MySQL puede iniciar MariaDB. Comprueba la versión real:

```powershell
Test-Path C:\xampp\mysql\bin\mysql.exe
```

Solo si el resultado es `True` y el servicio de XAMPP está iniciado:

```powershell
& C:\xampp\mysql\bin\mysql.exe -u root -p -e "SELECT VERSION();"
```

Introduce la contraseña correspondiente; si esa instalación no tiene contraseña, pulsa Enter. No asumas que esto es apropiado para el servidor nuevo.

Django 5.2 requiere MySQL 8.0.11+ o MariaDB 10.5+. MariaDB 10.4 de algunas instalaciones XAMPP es incompatible. Para esta práctica usaremos **MySQL Community Server 8.4 LTS**, perteneciente a la familia MySQL 8. No reemplaces manualmente los archivos de datos de XAMPP.

### 1.2. Descargar e instalar

1. Abre [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
2. Selecciona la rama **8.4 LTS**, Windows y el instalador MSI de 64 bits.
3. Ejecuta el instalador y después **MySQL Configurator**. Si solicita Visual C++ Redistributable, instala el prerrequisito oficial que indique.
4. Selecciona una configuración de desarrollo.
5. Configura TCP/IP en el puerto **3307**. Lo usaremos incluso sin XAMPP para que toda la clase tenga la misma configuración.
6. Conserva la autenticación moderna predeterminada.
7. Define y guarda una contraseña propia para `root`.
8. Registra el servicio con el nombre **MySQL84**, con inicio automático, y aplica la configuración.

No necesitas abrir el puerto MySQL a otros equipos: Django se conectará localmente. Workbench es opcional; los ejercicios usan el cliente de consola.

### 1.3. Verificar servicio y cliente

```powershell
Get-Service MySQL84
Test-NetConnection 127.0.0.1 -Port 3307
$env:Path = "C:\Program Files\MySQL\MySQL Server 8.4\bin;" + $env:Path
mysql --version
mysql -h 127.0.0.1 -P 3307 -u root -p
```

Si elegiste otra carpeta, adapta la ruta. El cambio de PATH anterior solo dura esta sesión; puedes añadir esa carpeta desde **Editar las variables de entorno de la cuenta > Path > Nuevo**.

Resultado esperado: servicio `Running`, `TcpTestSucceeded: True` y acceso al cliente. `mysql --version` comprueba el cliente; la siguiente consulta comprueba el servidor.

Dentro de MySQL:

```sql
SELECT VERSION() AS version_servidor, @@port AS puerto;
CREATE DATABASE seguimiento_retos
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'retos_app'@'127.0.0.1'
    IDENTIFIED BY 'CAMBIA_ESTA_CLAVE_POR_UNA_PROPIA';
GRANT ALL PRIVILEGES ON seguimiento_retos.*
    TO 'retos_app'@'127.0.0.1';
SHOW DATABASES LIKE 'seguimiento_retos';
EXIT;
```

Antes de ejecutar `CREATE USER`, sustituye el texto de contraseña por una propia y guárdala. La cuenta tiene permisos sobre la base de la práctica para poder ejecutar migraciones. No usaremos `root` desde Django. No hace falta `FLUSH PRIVILEGES` al usar `CREATE USER` y `GRANT`.

Prueba la cuenta:

```powershell
mysql -h 127.0.0.1 -P 3307 -u retos_app -p seguimiento_retos
```

```sql
SELECT DATABASE(), CURRENT_USER();
SHOW TABLES;
EXIT;
```

La base debe estar vacía. Las tablas se crearán después con migraciones; no ejecutes el esquema SQL de referencia de la etapa 1 sobre esta base.

**Evidencia 1:** versión del servidor, puerto y acceso con `retos_app`.

## 2. Instalar Python 3.12

```powershell
winget install --exact --id Python.Python.3.12 --source winget
```

Alternativa: instalador oficial de [Python para Windows](https://www.python.org/downloads/windows/), rama 3.12, incluyendo Python Launcher. Si usas el instalador clásico, activa **Add python.exe to PATH**.

Abre otra terminal:

```powershell
py -3.12 --version
py -3.12 -m pip --version
py -3.12 -c "import struct; print('Arquitectura:', struct.calcsize('P') * 8, 'bits')"
```

Resultado esperado: Python 3.12.x, pip disponible y 64 bits. Usamos `py -3.12` para evitar seleccionar accidentalmente otra versión.

## 3. Instalar Git y Visual Studio Code

```powershell
winget install --exact --id Git.Git --source winget
winget install --exact --id Microsoft.VisualStudioCode --source winget
```

Abre otra terminal y verifica:

```powershell
git --version
code --version
```

Configura tu identidad, sustituyendo los ejemplos por tus datos:

```powershell
git config --global user.name "Nombre Apellido"
git config --global user.email "tu.correo@ejemplo.edu"
git config --global --get user.name
git config --global --get user.email
```

Instala extensiones:

```powershell
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension Angular.ng-template
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-ceintl.vscode-language-pack-es
code --list-extensions
```

Python y Pylance ayudan con el backend; Angular Language Service con las plantillas; Prettier con el formato y ESLint cuando configuremos sus reglas. CSS y Git ya tienen soporte integrado en VS Code.

## 4. Crear la carpeta y el entorno virtual

No se necesita Apache para ejecutar Django o Angular. En esta práctica usaremos una carpeta dentro de tu perfil, evitando depender de que exista XAMPP.

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\proyectos\SeguimientoRetos"
Set-Location "$env:USERPROFILE\proyectos\SeguimientoRetos"
New-Item -ItemType Directory -Force backend, documentacion
git init
code .
Set-Location backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python --version
python -c "import sys; print(sys.executable)"
```

El intérprete debe estar dentro de `backend\.venv`. Si PowerShell bloquea la activación, permite scripts **solo para esta sesión** y repite la activación:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
```

Si una política institucional impide el cambio, usa directamente `.\.venv\Scripts\python.exe` en lugar de `python` en todos los comandos del backend. No es necesario cambiar la política de todo el equipo.

En VS Code: `Ctrl+Shift+P` > **Python: Select Interpreter** > selecciona `backend\.venv\Scripts\python.exe`.

## 5. Instalar Django y las dependencias del backend

Ubicación: carpeta `backend`, entorno virtual activo.

```powershell
python -m pip install --upgrade pip
python -m pip install "Django>=5.2,<5.3" djangorestframework django-filter drf-spectacular django-cors-headers python-dotenv
python -m pip install --only-binary=:all: "mysqlclient>=2.2.1,<3"
python -m django --version
python -m pip check
python -c "import MySQLdb, rest_framework, django_filters, drf_spectacular, corsheaders, dotenv; print('Dependencias disponibles')"
```

Resultado esperado: Django 5.2.x, `No broken requirements found` y `Dependencias disponibles`.

Usamos `--only-binary` para instalar una rueda precompilada de mysqlclient y evitar compilación nativa en el laboratorio. Si no hay una compatible, comprueba primero que estás usando CPython 3.12 de 64 bits. Para compilar desde código fuente, el proyecto mysqlclient documenta MariaDB Connector/C y las herramientas de compilación de Visual Studio; eso requiere una preparación adicional del equipo.

### 5.1. Probar Python contra MySQL

```powershell
python -c "import MySQLdb, getpass; conexion = MySQLdb.connect(host='127.0.0.1', port=3307, user='retos_app', passwd=getpass.getpass('Clave de MySQL: '), db='seguimiento_retos', charset='utf8mb4'); cursor = conexion.cursor(); cursor.execute('SELECT VERSION(), DATABASE()'); print(cursor.fetchone()); cursor.close(); conexion.close()"
```

Resultado esperado: versión de MySQL y `seguimiento_retos`. La contraseña se pide de forma oculta y no queda dentro del comando.

### 5.2. Alternativa PyMySQL en Windows

Si mysqlclient no puede instalarse, PyMySQL permite probar una conexión sin compilar extensiones:

```powershell
python -m pip install "PyMySQL[rsa]"
python -c "import pymysql, getpass; conexion = pymysql.connect(host='127.0.0.1', port=3307, user='retos_app', password=getpass.getpass('Clave de MySQL: '), database='seguimiento_retos', charset='utf8mb4'); cursor = conexion.cursor(); cursor.execute('SELECT VERSION(), DATABASE()'); print(cursor.fetchone()); cursor.close(); conexion.close()"
```

El extra `rsa` permite autenticación con `caching_sha2_password`. Esta prueba valida PyMySQL, pero no demuestra compatibilidad con Django. El backend oficial de Django recomienda mysqlclient y verifica su versión. La sustitución mediante `pymysql.install_as_MySQLdb()` puede ser rechazada por esa comprobación; no falsees `version_info` ni edites Django para eludirla. Para completar esta práctica con Django 5.2, la ruta de referencia es mysqlclient; una integración alternativa exige validar expresamente el adaptador y sus versiones con el docente.

### 5.3. Preparar variables y registrar versiones

Crea `backend/.env` en VS Code con tus valores:

```dotenv
DB_NAME=seguimiento_retos
DB_USER=retos_app
DB_PASSWORD=REEMPLAZAR_POR_TU_CLAVE
DB_HOST=127.0.0.1
DB_PORT=3307
SECRET_KEY=REEMPLAZAR_POR_LA_CLAVE_GENERADA
DEBUG=True
```

Genera el valor de `SECRET_KEY`:

```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Pega el resultado entre comillas simples en `.env`, para conservar caracteres como `#`. Si tu contraseña contiene `#` o espacios, también debe ir entre comillas. El archivo `.env` no se carga automáticamente: en la etapa del backend usaremos `python-dotenv` y lo conectaremos con `DATABASES` en `settings.py`.

Guarda las versiones resueltas:

```powershell
python -m pip freeze | Set-Content -Encoding utf8 requirements.txt
```

En la raíz del monorepo, crea `.gitignore` con:

```gitignore
backend/.venv/
**/__pycache__/
*.pyc
**/.env
frontend/node_modules/
frontend/.angular/
frontend/www/
frontend/dist/
frontend/android/.gradle/
frontend/android/local.properties
**/build/
```

No excluyas `package-lock.json` ni las migraciones Django. Crea posteriormente `.env.example` con nombres de variables y valores de ejemplo sin credenciales reales.

**Evidencia 2:** versiones, entorno virtual y conexión Python–MySQL. No hay todavía `manage.py`; no ejecutes migraciones en esta etapa.

## 6. Instalar Node.js LTS y npm

Instala la versión LTS actual:

```powershell
winget install --exact --id OpenJS.NodeJS.LTS --source winget
```

También puedes usar el MSI LTS de [Node.js](https://nodejs.org/en/download). A la fecha de revisión, Node 26 está en LTS; Node 24 sigue siendo una alternativa LTS compatible si es al menos 24.15.0. Angular 22 admite Node `^22.22.3`, `^24.15.0` o `^26.0.0`.

Cierra y abre la terminal:

```powershell
node --version
npm.cmd --version
where.exe node
```

Se usa `npm.cmd` para evitar bloqueos de los lanzadores `.ps1` por las políticas de PowerShell. Las versiones exactas instaladas se anotarán en el informe.

## 7. Instalar Angular CLI e Ionic CLI

```powershell
npm.cmd install --global @angular/cli@22 @ionic/cli
ng.cmd version
ionic.cmd --version
npm.cmd view @ionic/angular@latest version peerDependencies --json
```

Angular 22 es la rama estable indicada por la documentación consultada. Verifica que las dependencias pares de Ionic admitan esa versión antes de continuar. No uses `--force` ni `--legacy-peer-deps` para ocultar incompatibilidades.

## 8. Crear una plantilla Angular standalone con Ionic

Partimos de Angular CLI para elegir explícitamente Angular 22. Ubicación: raíz del monorepo. Si ya existe `frontend`, no ejecutes el generador encima: usa el proyecto entregado por el docente y ejecuta `npm.cmd ci` dentro de él.

```powershell
Set-Location "$env:USERPROFILE\proyectos\SeguimientoRetos"
ng.cmd new frontend --standalone --routing --style=scss --skip-git --ssr=false --package-manager=npm --defaults
Set-Location frontend
npm.cmd install @ionic/angular@latest ionicons
ionic.cmd init "Seguimiento de Retos" --type=angular
npx.cmd ng version
npm.cmd ls @angular/core @ionic/angular
```

Si Ionic pregunta si deseas vincular una cuenta, no es necesario hacerlo para esta práctica.

En `src/app/app.config.ts`, conserva los proveedores existentes y añade:

```typescript
import { provideIonicAngular } from '@ionic/angular/standalone';
```

Dentro del arreglo `providers` añade `provideIonicAngular()`. No reemplaces los proveedores de rutas ni otros generados por Angular.

Al principio de `src/styles.scss` añade:

```scss
/* Estilos globales: infraestructura visual de Ionic. */
@import '@ionic/angular/css/core.css';
@import '@ionic/angular/css/normalize.css';
@import '@ionic/angular/css/structure.css';
@import '@ionic/angular/css/typography.css';
```

Para comprobar un componente Ionic, añade `IonButton` desde `@ionic/angular/standalone` al arreglo `imports` del componente raíz generado en `src/app/`. Según la convención del generador, el archivo puede llamarse `app.ts` o `app.component.ts`. Añade a su plantilla:

```html
<ion-button>Entorno de Seguimiento de Retos preparado</ion-button>
```

Ejecuta:

```powershell
ionic.cmd serve --port=8100
```

Abre `http://localhost:8100`. Debe verse el botón con el estilo de Ionic. Detén el servidor con `Ctrl+C`. La página generada puede incluir textos del framework en inglés: es una plantilla de comprobación que sustituiremos por la interfaz en español en la etapa del frontend.

**Evidencia 3:** versiones y botón Ionic funcionando en el navegador.

## 9. Instalar Android Studio y preparar el emulador

```powershell
winget install --exact --id Google.AndroidStudio --source winget
```

Alternativa: [descarga oficial de Android Studio](https://developer.android.com/studio).

1. Abre Android Studio y termina el asistente de instalación estándar.
2. Capacitor 8 requiere Android Studio **Otter 2025.2.1 o posterior**. Usa una versión estable que cumpla ese mínimo.
3. En **More Actions > SDK Manager**, instala **Android SDK Platform 36**.
4. En **SDK Tools**, instala Android SDK Build-Tools 36.x, Android SDK Platform-Tools, Android SDK Command-line Tools y Android Emulator. Acepta las licencias.
5. Anota la ruta del SDK. Habitualmente es `%LOCALAPPDATA%\Android\Sdk`.
6. En **Device Manager > Create Virtual Device**, selecciona un teléfono, descarga una imagen de sistema API 36 compatible con tu procesador y crea el dispositivo.
7. Inicia el emulador. Si solicita virtualización, activa VT-x/AMD-V en BIOS/UEFI y configura el hipervisor siguiendo el diagnóstico de Android Studio; puede requerir reinicio.

Configura solo la terminal actual, adaptando las rutas si instalaste en otra carpeta:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:JAVA_HOME\bin;" + $env:Path
java -version
adb version
adb devices
```

Usa el JDK incluido en Android Studio; Capacitor 8 utiliza Java 21. En Android Studio, verifica también **Settings > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK** y selecciona su JDK integrado compatible.

Resultado esperado: Java 21 o el JDK compatible con el proyecto generado, y una entrada como `emulator-5554 device`. Una lista vacía indica que todavía no hay un dispositivo conectado. En un teléfono real, activa opciones de desarrollador y depuración USB, conecta el cable y acepta la autorización.

Para sesiones futuras, añade `ANDROID_HOME` y `JAVA_HOME` a las variables de usuario y sus carpetas al PATH mediante el editor de variables de Windows.

## 10. Instalar Capacitor y generar Android

Ubicación: `frontend`. Capacitor se instala localmente en el proyecto, no globalmente.

```powershell
npm.cmd install @capacitor/core@8 @capacitor/android@8
npm.cmd install --save-dev @capacitor/cli@8
npx.cmd cap init "Seguimiento de Retos" "edu.ejemplo.seguimientoretos" --web-dir=dist/frontend/browser
npm.cmd run build
Test-Path .\dist\frontend\browser\index.html
```

El resultado debe ser `True`. Esta es la salida habitual del generador Angular con el constructor de aplicación. Si devuelve `False`, revisa la ruta que muestra la compilación y `outputPath` en `angular.json`; configura `webDir` en `capacitor.config.ts` con la carpeta que contiene el `index.html` compilado. No uses `src` como `webDir`.

Solo después de confirmar la carpeta:

```powershell
npx.cmd cap add android
npx.cmd cap sync android
npx.cmd cap doctor
npx.cmd cap open android
```

`cap add android` se ejecuta una sola vez. `cap sync android` se repite después de compilar cambios o instalar plugins.

En Android Studio espera la sincronización de Gradle, selecciona el emulador y pulsa **Run**. La primera compilación descarga dependencias y puede tardar varios minutos.

También puedes generar una APK de depuración desde PowerShell, con las variables Java/SDK configuradas:

```powershell
Set-Location android
.\gradlew.bat assembleDebug
Test-Path .\app\build\outputs\apk\debug\app-debug.apk
Set-Location ..
```

Resultado esperado: `BUILD SUCCESSFUL` y `True`. Esta APK sirve para pruebas, no es una compilación firmada para publicar en una tienda.

**Evidencia 4:** aplicación abierta en el emulador y ruta de la APK generada.

## 11. Guardar y reproducir el entorno

Desde `frontend`:

```powershell
npm.cmd ls --depth=0
Set-Location ..
git status --short
git check-ignore backend/.env
git check-ignore backend/.venv/pyvenv.cfg
```

Los dos últimos comandos deben mostrar las rutas ignoradas. Revisa los archivos antes de registrar el trabajo:

```powershell
git add .gitignore backend/requirements.txt frontend
git status --short
git commit -m "Prepara el entorno de desarrollo web y Android"
```

No agregues `.env`. El docente debe conservar `requirements.txt` y `package-lock.json` como referencia común del curso: los comandos iniciales resuelven versiones al momento de ejecutarse, mientras esos archivos registran las versiones concretas.

En una copia posterior del proyecto, las instalaciones se reproducen con `python -m pip install -r requirements.txt` dentro del entorno virtual del backend y `npm.cmd ci` dentro del frontend. No se vuelve a ejecutar `ng new` ni `cap add android` si esas carpetas ya existen.

## 12. Direcciones que usaremos cuando exista la API

| Cliente | Dirección del backend de desarrollo |
| --- | --- |
| Navegador de la misma PC | `http://localhost:8000/api/` |
| Emulador Android estándar | `http://10.0.2.2:8000/api/` |
| Teléfono real en la misma red | `http://IP_LOCAL_DE_LA_PC:8000/api/` |

En el teléfono, `localhost` apunta al propio teléfono. Para localizar la IP de tu PC, ejecuta `ipconfig` y revisa la IPv4 del adaptador conectado. Cuando implementemos Django, se configurarán `ALLOWED_HOSTS`, los orígenes CORS exactos y, para pruebas con HTTP en Android, la configuración de tráfico sin cifrar exclusiva de desarrollo. Capacitor Android suele usar el origen `https://localhost`; comprueba el esquema configurado antes de fijar CORS.

Para acceso desde emulador o teléfono, el servidor Django se iniciará con `python manage.py runserver 0.0.0.0:8000`. Este comando se ejecutará en la siguiente etapa, cuando exista `manage.py`. Si Windows bloquea el acceso, permite el puerto del backend solo en la red privada del laboratorio; no abras MySQL para resolver un problema HTTP.

## 13. Errores frecuentes

| Problema | Comprobación y solución |
| --- | --- |
| `mysql` no se reconoce | Añade al PATH la carpeta `bin` de MySQL 8.4 o usa la ruta completa con `&`. |
| Error MySQL 2003 / conexión rechazada | Revisa `Get-Service MySQL84`, el puerto 3307 y `Test-NetConnection`. |
| Error MySQL 1045 / acceso denegado | Comprueba contraseña, usuario y host; usa siempre `127.0.0.1` con la cuenta creada. |
| La base o el usuario ya existe | Comprueba `SHOW DATABASES` y la cuenta existente; no borres bases para repetir la práctica. |
| Django informa versión MariaDB incompatible | Comprueba `SELECT VERSION()` y que `.env` apunte a MySQL 8.4 en 3307. |
| `python` apunta a otra instalación | Comprueba `sys.executable`; activa `.venv` o usa su ejecutable completo. |
| No hay rueda de mysqlclient | Revisa Python 3.12 de 64 bits y pip actualizado; consulta los prerrequisitos oficiales de compilación. |
| `npm.ps1` o `ng.ps1` bloqueado | Usa `npm.cmd`, `npx.cmd`, `ng.cmd` e `ionic.cmd`. |
| `ERESOLVE` | Revisa `peerDependencies`; alinea las versiones, sin forzar la instalación. |
| No se reconoce una herramienta recién instalada | Abre una terminal nueva y comprueba el PATH. |
| Capacitor no encuentra recursos web | Ejecuta build y comprueba que `webDir` contenga `index.html`. |
| Gradle no encuentra Java o el SDK | Revisa `JAVA_HOME`, `ANDROID_HOME`, el SDK Manager y el Gradle JDK. |
| Fallan descargas por proxy institucional | Configura el proxy autorizado en npm/Android Studio con ayuda del laboratorio; no desactives la verificación TLS. |

## 14. Lista de entrega y preguntas

- [ ] MySQL 8.4 responde en 3307 y la cuenta de aplicación funciona.
- [ ] Python 3.12 de 64 bits usa el entorno virtual del proyecto.
- [ ] Django 5.2 y mysqlclient están instalados; `pip check` no informa conflictos.
- [ ] La prueba de conexión Python–MySQL devuelve la base correcta.
- [ ] Git, VS Code, Node LTS, Angular CLI e Ionic CLI están disponibles.
- [ ] La plantilla standalone muestra el botón Ionic en el navegador.
- [ ] Android Studio detecta el emulador y compila la plantilla.
- [ ] Se genera `app-debug.apk` y los secretos quedan fuera de Git.
- [ ] Se registran las versiones y las dificultades resueltas.

Responde: ¿qué diferencia existe entre servidor y cliente MySQL? ¿Por qué usamos un entorno virtual? ¿Qué diferencia hay entre npm global y local? ¿Qué conserva un archivo de bloqueo? ¿Por qué el teléfono no puede usar el `localhost` de la PC? ¿Qué tarea realiza Capacitor que no realiza Angular?

## Fuentes oficiales

Siguiente práctica: [construcción del backend paso a paso](03-backend-paso-a-paso.md).

- [Instalación de MySQL 8.4 en Windows](https://dev.mysql.com/doc/refman/8.4/en/windows-installation.html): instalador, configuración y servicio.
- [Bases de datos en Django 5.2](https://docs.djangoproject.com/en/5.2/ref/databases/): versiones mínimas y driver mysqlclient.
- [mysqlclient](https://github.com/PyMySQL/mysqlclient): instalación y prerrequisitos de compilación en Windows.
- [Instalación de PyMySQL](https://pymysql.readthedocs.io/en/latest/user/installation.html): extra RSA para autenticación.
- [Compatibilidad de Angular](https://angular.dev/reference/versions): Angular 22 y versiones compatibles de Node.
- [Versiones de Node.js](https://nodejs.org/en/about/previous-releases): estado LTS de las ramas.
- [Ionic Angular](https://ionicframework.com/docs/angular/overview): integración con Angular.
- [Entorno de Capacitor 8](https://capacitorjs.com/docs/getting-started/environment-setup): herramientas Node y Android.
- [Instalación de Capacitor](https://capacitorjs.com/docs/getting-started): inicialización y plataformas.
- [Android Studio](https://developer.android.com/studio): instalación y herramientas Android.
