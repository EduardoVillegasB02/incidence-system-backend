<p align="center">
  <a href="https://web.munisjl.gob.pe/web/" target="blank">
    <img src="./client/logo.png" width="320" alt="MDSJL" />
  </a>
  <br>
  <img src="https://img.shields.io/badge/Sistema-SCI-2D6A80?style=for-the-badge&logo=government&logoColor=white">
</p>

<h3 align="center">Sistema de Control de Incidencias</h3>
<p align="center">
  <em>Sistema de Control de Incidencias de la Central de Control y Monitoreo de la Municipalidad de San Juan de Lurigancho</em>
</p>

<p align="center">
  <a href="https://www.munisanjuan.gob.pe" target="_blank">
    <img src="https://img.shields.io/badge/Institución-MDSJL-0077B6?style=flat-square&logo=government&logoColor=white">
  </a>
  <a href="LICENSE" target="_blank">
    <img src="https://img.shields.io/badge/Licencia-Municipal-blueviolet?style=flat-square">
  </a>
</p>

## 📘 Descripción

Este repositorio contiene el backend del Sistema de Control de Incidencias (SCI), desarrollado por el equipo de desarrolladores de la Central de Control y  Monitoreo de la Municipalidad de San Juan de Lurigancho.

El sistema está construido utilizando el framework  [NestJS](https://github.com/nestjs/nest), bajo una arquitectura modular que facilita el mantenimiento y escalabilidad del proyecto.

Permite registrar, asignar y dar seguimiento a incidencias reportadas en el distrito, optimizando la coordinación entre operadores, cazadores y supervisores desde la Central de Comunicaciones.

---

## 🔑 Características principales

- Registro y gestión de incidencias
- Asignación de personal a cada incidencia
- Seguimiento de estados: pendiente, en proceso, finalizado
- Control de usuarios por roles (operador, cazador, supervisor)
- Subida de evidencias (imágenes, videos)
- Historial de intervenciones por incidencia
- Paneles e indicadores de desempeño

---

## ⚙️ Configuración del Proyecto

### 1️⃣ Instalar dependencias

```bash
yarn install
```

Instala todos los paquetes definidos en `package.json`, incluyendo NestJS, Prisma, y otras dependencias esenciales.

---

### 2️⃣ Configurar variables de entorno

Renombra el archivo `.env.template` a `.env` y completa las variables necesarias:

```bash
cp .env.template .env
```

Ejemplo mínimo para conexión a base de datos y ejecución:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_bd
JWT_SECRET=clave_secreta_segura
```

> ⚠️ Asegúrate de que la variable `DATABASE_URL` esté bien definida según tu entorno.

---

### 3️⃣ Configurar Prisma

```bash
npx prisma generate
npx prisma db push
```

- `prisma generate`: genera el cliente Prisma basado en `schema.prisma`.
- `prisma db push`: sincroniza tu esquema con la base de datos (sin usar migraciones).

---

### 4️⃣ Ejecutar el servidor

```bash
# Modo desarrollo
yarn start:dev

# Modo normal
yarn start

# Modo producción
yarn start:prod
```

---

### 5️⃣ Ejecutar pruebas

```bash
# Pruebas unitarias
yarn test

# Pruebas end-to-end
yarn test:e2e

# Reporte de cobertura
yarn test:cov
```

---

## 🚀 Deployment

Para desplegar este proyecto, ten en cuenta lo siguiente:

### 📦 Requisitos mínimos en producción

- Node.js 18+
- PostgreSQL 12+
- PM2, Docker o servicio equivalente para manejar procesos
- Variables de entorno correctamente configuradas (`.env`)
- Prisma Client generado (`npx prisma generate`)
- Esquema sincronizado con la BD (`npx prisma db push` o `migrate deploy` si usas migraciones)

---

### 🔧 Pasos básicos para producción

```bash
# Instalar dependencias sin devDependencies
yarn install --production

# Generar Prisma Client
npx prisma generate

# Sincronizar con la base de datos
npx prisma db push

# Ejecutar en modo producción
yarn start:prod
```

> También puedes usar `PM2`, `Docker` o `Nginx` como proxy inverso para manejar procesos y despliegue continuo.

---

## 🛠 Soporte Técnico

El equipo de desarrollo encargado del backend del Sistema de Control de Incidencias está conformado por:

- **Eduardo Villegas** – Backend Developer – [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eduardo-enrique-villegas-bojorquez/)

---

## 📞 Contacto Institucional

- **Central de Control y Monitoreo**  
  Municipalidad de San Juan de Lurigancho  
  Av. Santa Rosa de Lima Mz. Q, 15427
  Teléfono: (01) 5102090  
  Horario de atención: L-V 8:00 AM - 5:00 PM

---

## 📄 Licencia

El sistema backend utiliza el framework **NestJS** bajo la Licencia MIT.

---

<p align="center">
  <sub>Desarrollado por el equipo de desarrollo de la Central de Comunicaciones de la Municipalidad de San Juan de Lurigancho</sub>
  <br>
  <img src="./client/logo.png" width="320" alt="MDSJL" />
</p>
