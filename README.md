<<<<<<< HEAD
## Full‑Stack Setup (Frontend + Backend)

### Backend (Express + MongoDB)

1) Configure environment:

```
cd backend
copy ENV.EXAMPLE .env   # On Windows PowerShell: Copy-Item ENV.EXAMPLE .env
# fill in .env with your values
```

Required keys in `backend/.env`:

- `PORT` (default 5000)
- `CLIENT_ORIGIN` (e.g. http://localhost:5173)
- `MONGODB_URI` (your Mongo connection string)
- `JWT_SECRET` (long random string)
- `JWT_EXPIRES_IN` (e.g. 7d)

2) Install and run backend:

```
cd backend
npm install
npm run dev
```

Health check: `GET http://localhost:5000/api/health`

Auth endpoints:

- `POST /api/auth/register` { name, email, password, role? }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` (Bearer token)
- `POST /api/auth/logout` (Bearer token)

Mess endpoints:

- `GET /api/messes` (?q, minPrice, maxPrice)
- `GET /api/messes/:id`
- `POST /api/messes` (provider only)
- `PUT /api/messes/:id` (provider only)
- `DELETE /api/messes/:id` (provider only)

Order endpoints:

- `POST /api/orders` (customer only) { messId, quantity, notes? }
- `GET /api/orders/my` (customer only)
- `GET /api/orders/provider` (provider only)
- `PATCH /api/orders/:id/status` (provider only) { status }

Notification endpoints:

- `GET /api/notifications` (auth)
- `POST /api/notifications/:id/read` (auth)

Authentication: send JWT in header `Authorization: Bearer <token>`.

### Frontend (Vite + React)

Run the frontend in a separate terminal:

```
npm install
npm run dev
```

Default dev URL: `http://localhost:5173`

Point API calls at `http://localhost:5000/api/...` and include the JWT header after login.
=======
# MessMate
>>>>>>> ba1c7b63302ab326fd457925e9f3cf76d6450abe
