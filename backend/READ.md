# node/npm is required to tun this project: https://nodejs.org/en/download

## Quick Copy-Paste Checklist (commands)

```bash
# 1) Install dependencies
npm i

# 2) Build TS
npm run build

# 3) Start server
npm run start
```

# Startup

## Installation & Build

```bash
# Install dependencies
npm i

# Build TypeScript files
npm run build
```

## Database setup

PostgreSQL is used as the database for this project.
This means that a psql database needs to be set up beforehand and its values need to be inserted into the .env file (follow the example)

For linux, see "LINUX_RUNNING_PSQL.md" within the backend repo

For windows, see psql setup here: https://www.youtube.com/watch?v=GpqJzWCcQXY - or directly install here: https://www.postgresql.org/download/windows/

## After install/build — Run & Verify Tests

Ensure that you have updated your psql database by running the migrations via the migration scripts:

npm run migration:generate all - this will generate any loose/leftover migrations which might not be included in the repo - but should not be neccessary
npm run migration:run - this will execute all migrations for your psql server

```bash
# Run/verify all currently existing tests (looks for .test.js files under ./dist/tests/)
npm run run:files ./dist/tests/ .test.js
```

> **Note:** The repo contains some example/preview files that can be cleaned up as needed.

---

## Folders

### `/controllers`
- Used for storing controller files.
- `/auth` – Manages user login. (Includes an empty `logout` controller for now.)
- `/user` – Handles user CRUD operations.

---

### `/db`
Used for DB-related files:
- `/entities` – Contains TypeORM entities/models and their repositories.  
- `/fixtures` – Data setup / seeding files (including the main seed function and any supporting data).  
- `/scripts` – Migration scripts and an entity boilerplate script.  
- `data-source.ts` – TypeORM DB configuration file.

---

### `/middleware`
Contains middleware:
- `authenticate.ts` – Middleware for confirming the user token.  
- `authorise.ts` – Middleware for confirming the user role.

---

### `/routes`
Route paths and their configurations:
- `/auth` – Auth routes, utilising the auth controllers.  
- `/user` – User routes, utilising the user controllers.

---

### `/services`
Reusable logic that involves database querying:
- `loadUserRoles.ts` – Used for getting user roles; utilised by `middleware/authorise` to compare the user roles against required permissions.

---

### `/tests`
- Used for tests.

---

### `/types`
- Used for TypeScript types / type definitions.

---

### `/utilities`
- Used for logic which does **not** query the database (helper functions, formatters, small pure utilities).

---

## Notes
- Remember -the repository contains some preview/example/junk files that can be removed or moved into an `examples/` folder for clarity.
- Keep controller logic thin — delegate DB queries and business logic to `/services`.
- Keep middleware focused on a single responsibility (e.g., authentication only verifies tokens; authorization checks roles/permissions).

---

