PDF storage note
================

New PDFs are selected from the Admin -> Add Book / Edit Book form.
The current React + JSON Server demo stores the selected PDF as a data URL inside db.json.
No manual PDF path is required.

For a production deployment, use a real backend and persistent file/object storage and store
only the resulting PDF URL in the database.
