# Backend project guide

This project is a product inventory API built with Express, TypeScript, and MongoDB. Users can view products. Admins can add, update, and delete them.

## What you need

- Node.js 20.19 or newer
- npm
- MongoDB running locally, or a MongoDB connection string

## Run the API

1. Install packages with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set the MongoDB connection and choose local admin and user passwords in `.env`. Replace the example JWT secret with a long random value.
4. Start MongoDB.
5. Create the sample admin and user accounts with `npm run seed`.
6. Start the API with `npm run dev`.

The API runs on port `3000` by default. Open `http://localhost:3000/health` to check that it is running.

## Main routes

- `POST /auth/login` logs in and returns a JWT.
- `GET /products` lists products. Use `?page=1` to choose a page.
- `GET /products/:id` gets one product.
- `POST /products`, `PUT /products/:id`, and `DELETE /products/:id` require an admin token.

The `api.http` file contains sample requests. Log in as the admin, then send its token as `Authorization: Bearer <token>` for admin routes.

## Useful commands

- `npm run dev` starts the development server.
- `npm run seed` creates or updates the local admin and user accounts.
- `npm run typecheck` checks TypeScript types.
- `npm run build` creates the production build in `dist/`.
- `npm start` runs the production build.

## Where things live

- `src/server.ts` connects to MongoDB and starts the server.
- `src/app.ts` sets up Express and registers routes and middleware.
- `src/routes/` contains login and product routes.
- `src/models/` contains the MongoDB models.
- `src/middleware/` contains authentication, authorization, and error handling.
- `src/config/` contains environment and database setup.
- `docs/database-query-optimization.md` has query examples.
