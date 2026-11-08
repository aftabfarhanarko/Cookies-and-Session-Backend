# Cookies and Session Backend

A small Express.js example that demonstrates cookie-based sessions with
`express-session`. The app provides a login endpoint, a protected endpoint, and
a logout endpoint.

> **Demo only:** This project does not authenticate a real user. `/login` accepts
> any non-empty `userName` and marks the session as logged in. Do not use this
> as-is for a production authentication system.

## Requirements

- Node.js and npm

## Setup

From the project directory, install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

The server listens on [http://localhost:3000](http://localhost:3000).
`npm run dev` uses Nodemon and restarts the server when files change. You can
also run it without Nodemon using:

```bash
node app.js
```

## API

The examples below use `curl`. The login route accepts either JSON or URL-encoded
form data.

### Log in

```bash
curl -i -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"userName":"demo"}' \
  http://localhost:3000/login
```

The response sets the `sessionId` cookie. Keep it for subsequent requests.
The current implementation responds with `404` if `userName` is missing.

### Access the protected route

```bash
curl -i -b cookies.txt http://localhost:3000/protectd
```

An authenticated session receives a success response. Without an authenticated
session, the route currently responds with `404`. The route is spelled
`/protectd` in the current code.

### Log out

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/logout
```

This destroys the current session and clears the `sessionId` cookie.

## Session and cookie configuration

The app configures sessions with:

- An `httpOnly` cookie, so browser JavaScript cannot read it.
- `sameSite: "lax"` as a cross-site request mitigation.
- A 24-hour cookie lifetime.
- `secure: true` when `NODE_ENV` is set to `production` (HTTPS is required).
- `resave: false` and `saveUninitialized: false`.

The current session secret is hard-coded in `app.js`, and `express-session` uses
its default in-memory store. Both are development-only choices. Before
deployment, load a strong secret from environment configuration and use a
persistent session store. If deploying behind a TLS-terminating proxy, configure
Express proxy trust appropriately so secure cookies work as intended.

## Important limitations

- Login only checks that a username is present; there is no password check,
  user database, or authorization policy.
- The session ID is not regenerated during login.
- The default in-memory session store does not persist sessions across restarts
  and is not suitable for a multi-instance production deployment.
- The project does not currently define an automated test suite.
