# LibraryHub — React + JSON Server

A fully connected Library Management System built with React, React Router, Axios and JSON Server.

## Features

- Login / Signup / Logout
- User and Admin roles
- Protected user routes
- Protected admin routes
- Book CRUD using JSON Server REST API
- Search books
- Filter by category
- Sort by title, rating and price
- Book details
- Favorite books persisted to JSON Server
- Admin dashboard
- Add and edit books
- Delete books
- Responsive library-themed UI

## Demo accounts

### Admin
- Email: `admin@library.com`
- Password: `admin123`

### User
- Email: `user@library.com`
- Password: `user123`

## Run the project

Open a terminal in the project folder:

```bash
npm install
```

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

Or run both:

```bash
npm run dev:all
```

JSON Server runs at `http://localhost:5000`.

Vite normally runs at the URL shown by `npm run dev`.

## API endpoints

- `GET /books`
- `GET /books/:id`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`
- `GET /users`
- `POST /users`
- `PUT /users/:id`

## Routes

- `/` — Home
- `/login` — Login
- `/signup` — Signup
- `/books` — User books
- `/books/:id` — Book details
- `/favorites` — User favorites
- `/admin` — Admin dashboard
- `/admin/add-book` — Add book
- `/admin/edit-book/:id` — Edit book

## Design

Library palette:
- Navy `#102A43`
- Teal `#147D92`
- Cream `#F7F4ED`
- Gold `#D9A441`

> This is a frontend/demo authentication flow. Passwords are stored in `db.json` because JSON Server is being used as a mock backend. For production, authentication should use a real backend with password hashing and authorization.
