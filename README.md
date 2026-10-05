# Library Management - Free Digital Library

React + Vite + JSON Server library application with free books, Google Drive PDF links, online reading, favorites and a single Admin workspace.

## Features

- User signup/login/logout
- Browse, search, filter and sort books
- Favorites
- All books are FREE; no purchase/price flow
- Admin-only library management
- Admin dashboard with book/user/category/PDF statistics
- Add, edit and delete books
- Google Drive PDF link for each book
- Read Online using a Google Drive PDF iframe
- Open/download PDF from the Drive link
- Responsive layout

## PDF workflow

1. Upload the PDF to Google Drive.
2. Open the file's Share settings.
3. Set access to **Anyone with the link → Viewer**.
4. Copy the Google Drive sharing link.
5. In Admin → Add Book/Edit Book, paste the link into **Google Drive PDF Link**.
6. Save the book.
7. Users can select **Read Online** to view the PDF inside the website.
8. Users can select **Download / Open PDF** or the Download button in the reader.

The application stores only the Google Drive link (`pdfUrl`) in JSON Server. The PDF itself is not stored in IndexedDB, the React project, or JSON Server.

### Accepted Drive link

Example:

`https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

The application extracts the file ID and opens:

`https://drive.google.com/file/d/FILE_ID/preview`

for the embedded reader.

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
2. Add Book button
3. Add/Edit Book pages
4. Search and category filters
5. Complete book inventory
6. Edit and Delete actions

## Run locally

```bash
npm install
npm run dev:all
```

Frontend: `http://localhost:5173`

JSON Server: `http://localhost:5000`

## API configuration

For deployment, set `VITE_API_URL` to the deployed API URL:

```text
VITE_API_URL=https://your-api.example.com
```

## Important

Google Drive must allow **Anyone with the link → Viewer** for users on other devices to access the PDF.

For a college/demo project this is a simple shared-storage approach. For a larger production system, a dedicated cloud storage service can be used later.
