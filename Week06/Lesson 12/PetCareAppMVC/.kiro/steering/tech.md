# Tech Stack & How to Work on This Project

This file tells Kiro what the project is built with and how to run and edit it.
Kiro reads it automatically. (See `product.md` for what the app does.)

## Stack

- **Runtime:** Node.js
- **Web framework:** Express 5
- **Views:** EJS templates in `views/` (server-rendered HTML)
- **Database:** MySQL, via the `mysql2` package
- **Sessions:** `express-session`
- **Flash messages:** `connect-flash`
- **File uploads:** `multer`
- **Password hashing:** Node's built-in `crypto` (SHA-256)

## How to run

```bash
npm install                 # install dependencies
# load the schema + sample data into MySQL, e.g.:
#   mysql -u root -p < db.sql
# make sure config/db.js matches your local MySQL (host, user, password, database)
node app.js                 # starts the app on http://localhost:3000
```

## Commands that exist (and don't)

- There is **no build step** and **no linter**.
- `npm test` is only a placeholder that prints an error and exits — there is
  **no test suite**. Do not assume tests exist or try to run them.
- The app is started directly with `node app.js`.

## Database

- The entire schema and sample data live in `db.sql`. There is **no migration
  tool** — if you change the schema, update `db.sql` and re-run it.
- Access the DB through the connection **pool** exported from `config/db.js`.
- Use the **callback style**: `connection.query(sql, params, (err, results) => { ... })`.
- Always use **parameterised queries** with `?` placeholders. Never build SQL by
  concatenating strings — it is unsafe and is not the pattern used here.
- Keep all SQL inside `models/`.

## Auth & sessions

- The logged-in user is stored in `req.session.user` (including `role`).
- Guard routes with the middleware in `middleware/auth.js`:
  - `isLoggedIn` for any route that needs a logged-in user.
  - `isAdmin` for admin-only routes.
- Passwords are hashed with SHA-256 via `helpers/hash.js`.

## File uploads

- Handled by `multer`, configured in `config/upload.js`.
- Uploaded files are saved to `public/images/`.
- The stored filename is `Date.now() + '_' + originalname`; only that filename
  is saved in the database (e.g. the `pets.image` column), not the full path.

## Learning-only shortcuts (do not copy into real projects)

This is a teaching codebase and takes shortcuts that are acceptable in class but
not in production:

- A hard-coded session secret in `app.js` and a hard-coded DB password in
  `config/db.js` — real apps keep these in environment variables.
- Plain SHA-256 for passwords — real apps use a slow, salted hash such as bcrypt.

If a task touches these areas, follow the existing pattern for consistency, but
feel free to point out the better production approach.
