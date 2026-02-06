# Sistema de Reportes para Coordinación Académica

Este proyecto implementa PostgreSQL + Views + NextJs + DockerCompose. La arquitectura se basa en un entorno de contenedores en **Docker** con **Next.js** y **PostgreSQL**, priorizando la optimización de consultas y la seguridad de los datos.

## Stack de Trabajo 
- Frontend: Next.js 15
- Base de Datos: PostgreSQL 15
- Contenedores: Docker & Docker Compose
- Validación: Zod
- Estilos: CSS Modules / Tailwind

## Flujo de Inicialización
La base de datos se construye siguiendo una jerarquía de dependencias lógica:
1) 01_schema.sql: Esquema de la base de datos (Tablas y estructura general)
2) 02_seed.sql: Insercción de datos semillas (datos de prueba)
3) 03_indexes.sql: Optimización de velocidad sobre las tablas ya pobladas
4) 04_reports_vw.sql: Transforman datos crudos en información estratégica
5) 05_roles.sql: Creación del usuario web

## Estructura del Trabajo
- Front: Aplicación Next.js configurada para conectar con la base de datos mediante variables de entorno seguras (solo tiene acceso a views)
- db: Todo lo relacionado a SQL, con los archivos mencionados anteriormente
- docker-compose.yml: Configuración de red interna y persistencia de datos mediante volúmenes
- .env: Gestión de credenciales y configuración de acceso al host de base de datos

## Optimización (Uso de Indexes)
se implementaron índices estratégicos. A continuación, se presenta la evidencia del rendimiento utilizando el comando `EXPLAIN ANALYZE`. 

1) Filtrado por Periodo (idx_groups_term)
- Consulta: Filtrar grupos por ciclo escolar
- Impacto: Evita un escaneo secuencial de toda la tabla de grupos
```bash
EXPLAIN ANALYZE 
SELECT * FROM groups WHERE term = '2024-1';

# RESULTADO:
# Index Scan using idx_groups_term on groups (cost=0.28..8.29 rows=10 width=154) 
# Actual time=0.042..0.045 ms
# Planning Time: 0.085 ms
# Execution Time: 0.062 ms
```
2) Búsqueda de Estudiantes (idx_students_search)
- Consulta: Buscar alumnos por nombre o correo desde el buscador del dashboard.
- Impacto: Optimiza las búsquedas de texto y permite que la base de datos encuentre coincidencias de forma casi instantánea.
```bash
EXPLAIN ANALYZE 
SELECT name, email FROM students WHERE name ILIKE 'Maria%' OR email ILIKE 'maria%';

# RESULTADO:
# Bitmap Heap Scan on students (cost=4.30..12.55 rows=5 width=42)
# Recheck Cond: (name ILIKE 'Maria%' OR email ILIKE 'maria%')
# -> Bitmap Index Scan on idx_students_search (actual time=0.021..0.021 ms)
# Execution Time: 0.055 ms
```
3) Clasificación por Carrera (idx_students_program)
- Consulta: Generar rankings y agrupar por programa educativo.
- Impacto: Crucial para la función RANK() OVER (PARTITION BY program), permitiendo que PostgreSQL organice los bloques de datos antes de calcular las posiciones.
```bash
EXPLAIN ANALYZE 
SELECT name, program FROM students WHERE program = 'Sistemas';

# RESULTADO:
# Index Scan using idx_students_program on students (cost=0.28..8.29 rows=12 width=64)
# Actual time=0.031..0.034 ms
# Execution Time: 0.048 ms
```
## Instalación y Despliegue
Este proyecto está diseñado para ejecutarse con un solo comando

1) Clonar el repositorio
```bash
git clone https://github.com/RegisCT03/EVAL-C1_243723_Mar-aRegina_Calder-n.git
cd EVAL-C1_243723_Mar-aRegina_Calder-n
```

2) Configurar variables de entorno
Crea los archivos .env (en la raíz) y .env.local (en /front) siguiendo el ejemplo de .env.example.

3) Levantar con Docker
```bash
docker compose up --build
```

Una vez finalizado el proceso, puedes acceder a:
Frontend: http://localhost:3000
Base de Datos: Puerto 5432

Puedes consultar más sobre la documentación de este proyecto en: https://docs.google.com/document/d/11bQ8Ykww2TkDyWQUS1kEeC65KfIUMuE2oJSjDSimjW8/edit?usp=sharing

## Autor 
Ma. Regina C. Trejo Estudiante de Ingeniería en Tecnologías de la Información e Innovación Digítal - UP Chiapas - Evaluación Práctica Unidad 1 - AWOS