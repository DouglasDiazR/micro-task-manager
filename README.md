# Micro Task Manager - Proyecto de Microservicios

Este proyecto es una aplicación de microservicios que consta de tres microservicios: **auth**, **gateway**, y **notes-microservice**. Además, se utiliza Docker Compose para orquestar y ejecutar estos microservicios de manera local.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de carpetas:

micro-task-manager/  

├── auth/ # Microservicio de autenticación  

├── gateway/ # Microservicio de puerta de enlace (API Gateway)  

├── notes-microservice/ # Microservicio de gestión de notas  

├── docker-compose.yml # Archivo de configuración de Docker Compose  
  

## Requisitos Previos

Para ejecutar el proyecto localmente, debes tener instalados los siguientes programas:

- **Docker**: Para construir y ejecutar los contenedores.
- **Docker Compose**: Para gestionar la orquestación de los contenedores.

## Pasos para Ejecutar el Proyecto Localmente

### 1. Clonar el Repositorio

Primero, clona el repositorio a tu máquina local:

```bash
git clone https://github.com/tu_usuario/micro-task-manager.git
cd micro-task-manager
````

# Configurar las Variables de Entorno
## En cada microservicio (auth, gateway, notes-microservice) copia el archivo .env.example a .env
```bash
cp auth/.env.example auth/.env
cp gateway/.env.example gateway/.env
cp notes-microservice/.env.example notes-microservice/.env
````

# Ejecutar los Servicios con Docker Compose
```bash
docker-compose up
````

## Generar el Esquema de la Base de Datos con Prisma
```bash

# cd notes-microservice
npx prisma generate 

# cd auth
npx prisma migrate
````

## Iniciar los Microservicios en Desarrollo con npm run start:dev
```bash
cd auth
npm install
npm run start:dev

cd ../gateway
npm install
npm run start:dev

cd ../notes-microservice
npm install
npm run start:dev
````
## Correr la Api de Swagger en el puerto 
# http://localhost:3000/api



