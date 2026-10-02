# Library Management - Free Digital Library

React + Vite + JSON Server library application with free books, PDF upload, online page-by-page reading, downloading, favorites and a single Admin workspace.

## Features

- User signup/login/logout
- Browse, search, filter and sort books
- Favorites
- All books are FREE; no purchase/price flow
- Admin-only library management
- Admin dashboard with book/user/copy/PDF statistics
- One Admin workspace with separate Add/Edit pages launched from `/admin`
- PDF file picker in the Admin form
- PDF validation (PDF only, maximum 10 MB)
- Online PDF reader with previous/next page controls and zoom
- PDF download
- Admin delete books
- Responsive layout

## Project structure

```text
src/
├── components/
│   ├── AdminRoute.jsx
│   ├── BookCard.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── Books.jsx
│   ├── BookDetails.jsx
│   ├── PdfReader.jsx
│   ├── Favorites.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── NotFound.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       └── BookForm.jsx
├── routes/
│   └── AppRoutes.jsx
├── api.js
├── AuthContext.jsx
├── App.jsx
├── App.css
└── index.css
```

## Admin workflow

Go to `/admin`. The Admin workspace contains:

1. Library statistics
2. Add Book button → `/admin/add-book`
3. Separate Add/Edit Book pages
4. Search and category filters
5. Complete book inventory
6. Edit and Delete actions

## PDF upload and storage

Select a PDF directly in the Admin form. The PDF binary is stored in the browser's IndexedDB database (`library-pdf-storage`) under the book ID. JSON Server stores only small book metadata such as `hasPdf` and `pdfFileName`, so large PDFs do not hit JSON Server's request-size limit.

Maximum PDF size: 10 MB.

**Important:** IndexedDB is local to the browser/device. A PDF uploaded by an admin in one browser is not automatically available to another browser or computer. For shared multi-user production storage, replace the IndexedDB layer with a real backend/cloud file-storage service.

## Run locally

```bash
npm install
npm run dev:all
```

Frontend: `http://localhost:5173`

JSON Server: `http://localhost:5000`

## API configuration

For deployment, set `VITE_API_URL` to the deployed API URL. Example:

```text
VITE_API_URL=https://your-api.example.com
```

If the variable is not set, local development uses `http://localhost:5000`.

## Online reading

When a book has a PDF, the **Read Online** button opens `/books/:id/read`. The reader supports:

- Previous/Next page
- Page counter
- Zoom out/in
- PDF rendering through `react-pdf`
- Download PDF
- Book Details link
