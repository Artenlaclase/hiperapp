# Plan de migración de base de datos: MySQL → Supabase (PostgreSQL)

Objetivo: migrar la base de datos actual (MySQL) hacia Supabase PostgreSQL y dejar el backend usando Prisma apuntando a la conexión Supabase.

Estado actual:
- `backend/prisma/schema.prisma` configurado con `provider = "postgresql"`.

Pasos recomendados (ejecutar con acceso a la instancia de Supabase y las credenciales de MySQL):

1) Preparar entorno Supabase

  - Crear un proyecto en Supabase.
  - En el dashboard de Supabase, copiar el `DATABASE_URL` PostgreSQL.
  - Asegurar que el esquema objetivo sea `public` o la configuración usada en Supabase.

2) Exportar datos desde MySQL

  - Dump esquema y datos:

      mysqldump --single-transaction --routines --triggers --events --databases mydb > dump_mysql.sql

3) Convertir schema y datos (opciones)

- Opción A: Usar `pgloader` para migración automática (recomendado para dataset con relaciones simples):

      pgloader mysql://user:pass@localhost/mydb postgresql://pguser:pgpass@localhost/apphiper

- Opción B: Usar `mysql2psql` o herramientas online, o transformar el `dump_mysql.sql` manualmente (tipos de datos, AUTO_INCREMENT → SERIAL, backticks, `ENGINE=` line removals).

4) Ajustar tipos y constraints

- Revisar campos `DATETIME` → `timestamp` o `timestamptz` según necesidad.
- Revisar `enum` y convertir a `CHECK` o `enum` en Postgres.
- Asegurar `utf8mb4` → `UTF8` en Postgres.

5) Actualizar `DATABASE_URL` en `backend/.env` con la URL de Supabase (ejemplo):

    DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?schema=public"
    JWT_SECRET=your_jwt_secret_here

6) Ejecutar migraciones Prisma

- Si se quiere usar el esquema Prisma actual como fuente de verdad:

    npx prisma migrate deploy --schema=prisma/schema.prisma
    # o para desarrollo
    npx prisma migrate dev --name init --schema=prisma/schema.prisma

- Nota: `prisma migrate dev` espera que el esquema Prisma refleje el estado deseado; si la DB ya tiene tablas, puede ser necesario `prisma db pull` primero para introspección.

7) Introspección (si la DB ya fue poblada con pgloader):

    npx prisma db pull --schema=prisma/schema.prisma
    npx prisma generate

8) Verificar integridad de datos y relaciones

- Ejecutar scripts de comprobación: conteos por tabla, claves foráneas, muestras de datos.

9) Ajustes finales en Prisma schema

- Validar tipos, índices y relaciones.

10) Backfill / pruebas

- Ejecutar la aplicación contra la nueva DB y probar endpoints clave (auth, crear usuario, registrar presión, registrar alimento).

Comandos útiles

    # Generar client
    cd backend
    npx prisma generate

    # Introspección si la DB ya existe
    npx prisma db pull

    # Crear migración basada en schema
    npx prisma migrate dev --name init

    # Aplicar migraciones en producción
    npx prisma migrate deploy

Consideraciones
- Hacer snapshot/backup completo antes de migrar en producción.
- Las funciones y triggers de MySQL no funcionan en Postgres; adaptar manualmente.
- Validar performance: revisar índices y consultas.

Si quieres, puedo:
- (A) Generar un script SQL inicial derivado del `schema.prisma` (archivo `migrations/0001_init.sql`) preparado para aplicar en PostgreSQL, o
- (B) Intentar correr `pgloader`/`prisma migrate` aquí si me facilitas un `DATABASE_URL` con acceso, o
- (C) Continuar implementando los endpoints core y pruebas sin hacer la migración de datos ahora.
