# Seguimiento de Retos

## 1. InformaciÃ³n general

- Universidad: Universidad TÃ©cnica Particular de Loja (UTPL).
- Autor: Jorge Granda.
- Proyecto: Seguimiento de Retos.
- Modalidad: Individual.
- Plataformas: Web y Android.
- AÃ±o: 2026.

## 2. DescripciÃ³n del proyecto

Seguimiento de Retos es una aplicaciÃ³n web y mÃ³vil
que permite gestionar objetivos personales mediante
el registro de avances y el seguimiento semanal.

El sistema incorpora un semÃ¡foro de cumplimiento,
alertas preventivas, validaciones de fechas y un
asistente de recuperaciÃ³n que genera recomendaciones
personalizadas para alcanzar los objetivos semanales.

## 3. Objetivos

### Objetivo general

Desarrollar una aplicaciÃ³n multiplataforma que permita
gestionar retos personales, controlar su progreso y
facilitar el cumplimiento de objetivos semanales.

### Objetivos especÃ­ficos

- Implementar una API REST utilizando Django.
- Gestionar la persistencia de datos mediante MySQL.
- Desarrollar una interfaz web con Angular e Ionic.
- Integrar la aplicaciÃ³n con Android mediante Capacitor.
- Implementar alertas y un semÃ¡foro de cumplimiento.
- Incorporar una funcionalidad propia de recuperaciÃ³n.
- Validar el funcionamiento mediante pruebas unitarias.

## 4. TecnologÃ­as utilizadas

| TecnologÃ­a | FunciÃ³n |
|---|---|
| Python | Lenguaje del backend |
| Django | Framework del backend |
| Django REST Framework | API REST |
| MySQL | Base de datos |
| Angular | Framework del frontend |
| TypeScript | Lenguaje del frontend |
| Ionic | Componentes de interfaz |
| Capacitor | IntegraciÃ³n con Android |
| Android Studio | CompilaciÃ³n y emulaciÃ³n mÃ³vil |
| Vitest | Pruebas del frontend |
| Git | Control de versiones |
| Visual Studio Code | Entorno de desarrollo |

## 5. Arquitectura del sistema

La aplicaciÃ³n utiliza una arquitectura cliente-servidor,
separando la interfaz, la lÃ³gica del backend y la
persistencia de datos.

```mermaid
flowchart TD
    A[Usuario] --> B[AplicaciÃ³n web Angular e Ionic]
    A --> C[AplicaciÃ³n Android con Capacitor]
    B --> D[API REST Django]
    C --> D
    D --> E[Modelos y lÃ³gica de negocio]
    E --> F[Base de datos MySQL]
```

El frontend consume los servicios del backend mediante
peticiones HTTP. Tanto la aplicaciÃ³n web como la mÃ³vil
utilizan la misma API y base de datos.

## 6. Estructura del proyecto

```text
SeguimientoReto/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ config/
â”‚   â”œâ”€â”€ retos/
â”‚   â””â”€â”€ manage.py
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ android/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â””â”€â”€ app/
â”‚   â”‚       â”œâ”€â”€ core/
â”‚   â”‚       â””â”€â”€ paginas/
â”‚   â”œâ”€â”€ angular.json
â”‚   â”œâ”€â”€ capacitor.config.ts
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ Documentacion/
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

## 7. InstalaciÃ³n y ejecuciÃ³n

### 7.1. Requisitos previos

- Python.
- Node.js y npm.
- MySQL.
- Android Studio.
- Android SDK.
- Java JDK.
- Git.

### 7.2. Backend

Ingresar al directorio del backend:

```powershell
cd backend
```

Crear y activar el entorno virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instalar las dependencias:

```powershell
pip install -r requirements.txt
```

Configurar las variables de entorno utilizando
el archivo `.env.example` como referencia.

Crear la base de datos MySQL y configurar las
credenciales correspondientes en el archivo `.env`.

Aplicar las migraciones:

```powershell
python manage.py migrate
```

Crear un usuario administrador, si es necesario:

```powershell
python manage.py createsuperuser
```

Iniciar el servidor:

```powershell
python manage.py runserver 0.0.0.0:8000 --noreload
```

Direcciones disponibles:

- API REST: http://localhost:8000/api/
- AdministraciÃ³n: http://localhost:8000/admin/
- DocumentaciÃ³n API: http://localhost:8000/api/docs/

### 7.3. Frontend web

Desde la raÃ­z del proyecto:

```powershell
cd frontend
npm.cmd install
npm.cmd start
```

Abrir en el navegador:

http://localhost:4200/

### 7.4. AplicaciÃ³n Android

Desde el directorio frontend:

```powershell
npm.cmd run build
npx.cmd cap sync android
npx.cmd cap open android
```

Seleccionar un dispositivo virtual en Android Studio
y ejecutar la aplicaciÃ³n.

El backend debe permanecer activo durante la ejecuciÃ³n.

La aplicaciÃ³n Android utiliza la direcciÃ³n
http://10.0.2.2:8000 para acceder al servidor local
desde el emulador.

## 8. Funcionalidades implementadas

- CreaciÃ³n y consulta de retos personales.
- BÃºsqueda de retos.
- VisualizaciÃ³n del detalle de cada reto.
- Seguimiento de las semanas 7 a 15.
- Registro de porcentajes de cumplimiento.
- Registro de avances.
- Guardado automÃ¡tico del progreso semanal.
- SemÃ¡foro de cumplimiento.
- Alertas de semanas en riesgo.
- Bloqueo de modificaciones en semanas cerradas.
- ValidaciÃ³n de errores mediante la API REST.
- EjecuciÃ³n de la aplicaciÃ³n en Android.
- Asistente personalizado de recuperaciÃ³n de retos.

## 9. SemÃ¡foro de cumplimiento

| Estado | DescripciÃ³n |
|---|---|
| Por iniciar | La semana todavÃ­a no comienza |
| En curso | La semana estÃ¡ activa |
| Verde | Semana cerrada con cumplimiento del 100% |
| Amarillo | Semana cerrada con cumplimiento entre 10% y menos de 100% |
| Rojo | Semana cerrada con cumplimiento inferior al 10% |

El sistema genera una alerta preventiva cuando una
semana activa tiene menos del 10% de progreso y
faltan dos dÃ­as o menos para su cierre.

Las semanas cerradas no pueden modificarse.
Esta restricciÃ³n se aplica tambiÃ©n en el backend.

## 10. Funcionalidad propia

### Asistente de recuperaciÃ³n de retos

### 10.1. Problema identificado

El seguimiento tradicional permite conocer el porcentaje
de cumplimiento de un reto, pero no necesariamente
orienta al usuario sobre cuÃ¡nto debe avanzar diariamente
para alcanzar su objetivo antes del cierre semanal.

### 10.2. SoluciÃ³n propuesta

Se desarrollÃ³ un asistente de recuperaciÃ³n que analiza
el porcentaje actual y los dÃ­as disponibles para generar
un plan personalizado de cumplimiento.

La funcionalidad transforma los datos de seguimiento
en recomendaciones prÃ¡cticas para el usuario.

### 10.3. CaracterÃ­sticas

- CÃ¡lculo del porcentaje pendiente.
- IdentificaciÃ³n de los dÃ­as disponibles.
- RecomendaciÃ³n del avance diario.
- GeneraciÃ³n de metas acumuladas por dÃ­a.
- RecÃ¡lculo automÃ¡tico al modificar el progreso.
- IdentificaciÃ³n de situaciones urgentes.
- Reconocimiento de objetivos completados.
- VisualizaciÃ³n mediante indicadores y barras de progreso.
- Disponibilidad tanto en la web como en Android.

### 10.4. Algoritmo utilizado

El algoritmo utiliza las siguientes reglas:

1. Porcentaje pendiente = 100 - porcentaje actual.
2. DÃ­as disponibles = dÃ­as restantes + 1.
3. Avance diario = porcentaje pendiente / dÃ­as disponibles,
   redondeado hacia arriba.
4. Las metas acumuladas se distribuyen entre los dÃ­as
   disponibles hasta alcanzar el 100%.

Se incluye el dÃ­a actual como una oportunidad de avance.

Cuando el avance diario recomendado es igual o superior
a 30 puntos porcentuales, el asistente indica una
situaciÃ³n de atenciÃ³n prioritaria.

Si el porcentaje alcanza el 100%, se muestra un mensaje
de felicitaciÃ³n y se elimina el plan de recuperaciÃ³n.

El asistente se muestra Ãºnicamente en semanas activas.

### 10.5. Ejemplo de funcionamiento

Para una semana con un progreso del 40% y cinco
dÃ­as disponibles:

| Indicador | Resultado |
|---|---|
| Progreso actual | 40% |
| Progreso pendiente | 60% |
| DÃ­as disponibles | 5 |
| Avance diario recomendado | 12 puntos porcentuales |

Plan generado:

| DÃ­a | Meta acumulada |
|---|---:|
| Hoy | 52% |
| DÃ­a 2 | 64% |
| DÃ­a 3 | 76% |
| DÃ­a 4 | 88% |
| DÃ­a 5 | 100% |

### 10.6. Archivos desarrollados y modificados

| Archivo | DescripciÃ³n |
|---|---|
| frontend/src/app/core/recuperacion.ts | Algoritmo y modelos del plan de recuperaciÃ³n |
| frontend/src/app/core/recuperacion.spec.ts | Seis pruebas unitarias del asistente |
| frontend/src/app/paginas/reto-detalle.page.ts | IntegraciÃ³n visual y funcional del asistente |
| frontend/src/app/app.spec.ts | AdaptaciÃ³n de las pruebas a Angular e Ionic |

### 10.7. Aporte personal

La funcionalidad aporta valor al convertir el porcentaje
de cumplimiento en un plan de acciÃ³n diario.

A diferencia de una alerta que Ãºnicamente informa sobre
un problema, el asistente propone metas concretas para
facilitar la recuperaciÃ³n del progreso.

La soluciÃ³n utiliza un algoritmo determinista basado
en reglas y cÃ¡lculos matemÃ¡ticos. No requiere servicios
externos de inteligencia artificial ni genera costos
adicionales por consumo de API.

La lÃ³gica se encuentra separada de la interfaz grÃ¡fica,
facilitando su mantenimiento, reutilizaciÃ³n y validaciÃ³n.

## 11. Pruebas unitarias

### 11.1. Backend

Ejecutar desde el directorio backend:

```powershell
python manage.py test retos
```

Resultado obtenido: 5 pruebas aprobadas.

### 11.2. Frontend

Ejecutar desde el directorio frontend:

```powershell
npx.cmd ng test --watch=false
```

Resultados obtenidos:

| Componente | Aprobadas |
|---|---:|
| SemÃ¡foro | 8/8 |
| Componente principal | 2/2 |
| Asistente de recuperaciÃ³n | 6/6 |
| Total frontend | 16/16 |

### 11.3. Pruebas de la funcionalidad propia

| Caso de prueba | Resultado |
|---|---|
| CÃ¡lculo desde un progreso del 0% | Aprobado |
| RecÃ¡lculo con progreso del 40% | Aprobado |
| GeneraciÃ³n de metas hasta el 100% | Aprobado |
| Reconocimiento del objetivo completado | Aprobado |
| DetecciÃ³n de situaciÃ³n urgente | Aprobado |
| Ausencia de metas para una semana cerrada | Aprobado |

### 11.4. Resumen general

- Backend: 5 pruebas aprobadas.
- Frontend: 16 pruebas aprobadas.
- Total: 21 pruebas aprobadas.
- CompilaciÃ³n del frontend: exitosa.
- SincronizaciÃ³n con Android: exitosa.
- Asistente en navegador web: verificado.
- Asistente en emulador Android: verificado.

## 12. Evidencias

Las evidencias del proyecto se encuentran organizadas
en el directorio [Documentacion/evidencias](Documentacion/evidencias).

### 12.1. Evidencias del desarrollo inicial

- [Evidencias iniciales del proyecto](Documentacion/evidencias/Evidencias_Iniciales.pdf)
- [Backend y pruebas](Documentacion/evidencias/01_Backend)
- [Frontend web](Documentacion/evidencias/02_Frontend_Web)
- [AplicaciÃ³n Android](Documentacion/evidencias/03_Android)
- [IntegraciÃ³n](Documentacion/evidencias/04_Integracion)
- [SemÃ¡foro y alertas](Documentacion/evidencias/05_Semaforo_y_Alertas)

### 12.2. Funcionalidad propia: Asistente de recuperaciÃ³n

#### Evidencia 1. Asistente de recuperaciÃ³n en la web

VisualizaciÃ³n del plan de recuperaciÃ³n a partir del
porcentaje actual y los dÃ­as disponibles.

![Asistente web](Documentacion/evidencias/06_Funcionalidad_Propia/01_Asistente_Web.jpeg)

#### Evidencia 2. RecÃ¡lculo automÃ¡tico en la web

ActualizaciÃ³n automÃ¡tica de las recomendaciones
y metas diarias al modificar el porcentaje de avance.

![RecÃ¡lculo web](Documentacion/evidencias/06_Funcionalidad_Propia/02_Recalculo_Web.jpeg)

#### Evidencia 3. Objetivo cumplido en la web

Reconocimiento del cumplimiento del 100% y
presentaciÃ³n del mensaje de felicitaciÃ³n.

![Objetivo cumplido web](Documentacion/evidencias/06_Funcionalidad_Propia/03_Objetivo_Cumplido_Web.jpeg)

#### Evidencia 4. Pruebas unitarias

EjecuciÃ³n exitosa de las 16 pruebas del frontend,
incluyendo las seis pruebas del asistente de recuperaciÃ³n.

![Pruebas unitarias](Documentacion/evidencias/06_Funcionalidad_Propia/04_Pruebas_Unitarias.jpeg)

#### Evidencia 5. Objetivo cumplido en Android

VerificaciÃ³n del reconocimiento del objetivo
completado desde la aplicaciÃ³n mÃ³vil.

<img src="Documentacion/evidencias/06_Funcionalidad_Propia/05_Objetivo_Cumplido_Android.jpeg" width="320" alt="Objetivo cumplido Android">

#### Evidencia 6. RecÃ¡lculo automÃ¡tico en Android

VerificaciÃ³n del plan de recuperaciÃ³n con un avance
del 40%, cinco dÃ­as disponibles y una recomendaciÃ³n
de 12 puntos porcentuales diarios.

<img src="Documentacion/evidencias/06_Funcionalidad_Propia/06_Recalculo_Android.jpeg" width="320" alt="RecÃ¡lculo Android">

## 13. Seguridad y buenas prÃ¡cticas

- Uso de variables de entorno.
- ExclusiÃ³n de credenciales del control de versiones.
- ValidaciÃ³n de datos en el frontend y backend.
- RestricciÃ³n de modificaciones en semanas cerradas.
- SeparaciÃ³n de responsabilidades.
- ReutilizaciÃ³n de componentes.
- Pruebas unitarias.
- Control de versiones mediante Git.

## 14. Conclusiones

El desarrollo del proyecto permitiÃ³ integrar tecnologÃ­as
de backend, frontend y desarrollo mÃ³vil dentro de una
misma soluciÃ³n.

La implementaciÃ³n del asistente de recuperaciÃ³n amplÃ­a
las capacidades del seguimiento tradicional al proporcionar
recomendaciones personalizadas y metas diarias.

Las pruebas unitarias y las verificaciones realizadas
en el navegador y en Android respaldan el funcionamiento
de los componentes evaluados.

El proyecto constituye una soluciÃ³n multiplataforma
que facilita la organizaciÃ³n, el seguimiento y el
cumplimiento de objetivos personales.

---

