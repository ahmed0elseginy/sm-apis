# Social Media Backend API

A production-ready, Twitter-like Social Media Backend built with Node.js, Express, PostgreSQL, and Prisma.

## Tech Stack

- **Node.js** + **Express.js**
- **PostgreSQL** + **Prisma ORM**
- **JWT** authentication
- **bcrypt** for password hashing
- **Zod** for validation
- **Winston** for logging
- **Swagger** for API documentation

## Project Structure

```
src/
├── config/         # Configuration (env, logger, swagger)
├── controllers/    # Request handlers
├── middlewares/    # Auth, validation, error handling, rate limiting
├── routes/         # API routes
├── services/       # Business logic
├── validators/     # Zod schemas
├── utils/          # Utilities (Prisma, ApiError, pagination)
├── app.js
└── index.js
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd sm-apis
npm install
```

2. Create `.env` from example:

```bash
cp .env.example .env
```

3. Configure `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sm_apis"
JWT_SECRET=your-secret-key
```

4. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. (Optional) Seed database:

```bash
npm run db:seed
```

6. Start the server:

```bash
npm run dev
```

API: `http://localhost:3000/api`  
Swagger: `http://localhost:3000/api-docs`

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/:id/follow` | Follow user |
| DELETE | `/api/users/:id/follow` | Unfollow user |
| GET | `/api/users/:id/followers` | Get followers |
| GET | `/api/users/:id/following` | Get following |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Create post |
| GET | `/api/posts/feed` | Get feed (paginated) |
| GET | `/api/posts/:id` | Get post by ID |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/comments` | Add comment |
| GET | `/api/comments/post/:postId` | List comments |
| DELETE | `/api/comments/:id` | Delete comment |

### Reactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reactions` | Like/React (LIKE, LOVE, HAHA, WOW) |
| DELETE | `/api/reactions/:id` | Remove reaction |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

## Authentication

Protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Pagination

Use `page` and `limit` query params:

```
GET /api/posts/feed?page=1&limit=20
GET /api/users/:id/followers?page=2&limit=10
```

## Deployment

### Render

1. Push to GitHub
2. Connect repo on [Render](https://render.com)
3. Create a PostgreSQL database on Render
4. Add environment variables (use `DATABASE_URL` from database)
5. Build command: `npm install && npx prisma generate`
6. Start command: `npx prisma migrate deploy && npm start`

### Railway

1. Push to GitHub
2. Connect repo on [Railway](https://railway.app)
3. Add PostgreSQL plugin
4. Add env vars; Railway provides `DATABASE_URL`
5. Deploy

### Fly.io

1. Install `flyctl`
2. `fly launch`
3. Add PostgreSQL with `fly postgres create` or external DB
4. Set `DATABASE_URL` secret
5. `fly deploy`

### Docker

```bash
docker build -t sm-apis .
docker run -p 3000:3000 -e DATABASE_URL=... -e JWT_SECRET=... sm-apis
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start dev server (nodemon) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:migrate:prod` | Run migrations (prod) |
| `npm run db:push` | Push schema without migration |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

## License

MIT
