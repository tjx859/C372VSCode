# Product & Project Context

This file gives Kiro lasting context about this project so you don't have to
re-explain it in every chat. Kiro reads it automatically.

## What this app is

A **Pet Care Journal System**: a web app where pet owners can register their
pets, keep a journal of care activities, book paid pet-care services (grooming,
vaccination, daycare, etc.), and pay for those bookings. Admin users manage the
list of users and services.

## Who uses it

- **Users (pet owners)** — sign up, log in, add pets, write journal entries,
  book and pay for services.
- **Admins** — manage users and services. Seeded admin login: `admin1` / `admin123`.

> For the tech stack, run commands, and coding conventions, see `tech.md`.

## Architecture (MVC)

Requests flow: `routes/ → middleware/ → controllers/ → models/ → config/db.js`,
with `views/` rendering the HTML response.

- `routes/` — map URLs to controller functions.
- `controllers/` — request handling and app logic.
- `models/` — all SQL queries live here, using parameterised queries.
- `views/` — EJS templates; shared pieces in `views/partials/`.
- `middleware/auth.js` — `isLoggedIn` and `isAdmin` guards.
- `config/db.js` — MySQL connection pool. `config/upload.js` — multer setup.
- `helpers/hash.js` — password hashing.

## Data model (see db.sql)

- `users` (role: `admin` or `user`) → owns many `pets`
- `pets` → have many `journal` entries and many `service_bookings`
- `services` (catalogue + price) ← referenced by `service_bookings`
- `service_bookings` → each can have one `payment`
- Passwords are stored as SHA-256 hashes.

## Notes for students

- This is a learning codebase. It takes some shortcuts that are fine for class
  but **not** for production. Those shortcuts, and the coding conventions to
  follow when editing, are described in `tech.md`.
