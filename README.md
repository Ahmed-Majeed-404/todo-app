# Task Manager

A local task management app built with Next.js and SQLite. Tasks are created with a title, description, due date, and topic. Nothing is ever deleted — tasks are archived instead, so the record is always recoverable.

## Features

- Create tasks with title, description, due date, and topic
- Mark tasks complete or incomplete
- Archive tasks instead of deleting them
- Restore archived tasks back to the active list
- Data persists to a local SQLite file, so tasks survive a server restart

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS |
| Database | SQLite via `better-sqlite3` |
| Mutations | Next.js Server Actions |

## Requirements

- Node.js 20 or later
- npm

On Windows, `better-sqlite3` is a native module. If the install fails to compile, install the Visual Studio Build Tools with the "Desktop development with C++" workload and try again.

## Getting started

Clone the repository and move into it:

```bash
git clone <your-repo-url>
cd todo-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The database file `tasks.db` is created automatically on first run. There is no migration step and no separate database server to start.

## Using the app

### Adding a task

The form at the top of the main page takes four fields. Only the title is required — the rest are optional and can be left blank.

| Field | Notes |
|---|---|
| Title | Required. The task will not save without it. |
| Description | Free text, shown underneath the title in the list. |
| Due date | Date picker. Tasks with a due date sort ahead of those without. |
| Topic | Free text label for grouping related tasks. |

Press **Add task** to save. The form clears itself on success.

### Completing a task

Click the checkbox to the left of a task. Completed tasks stay visible but are struck through and sink to the bottom of the list. Clicking again marks it incomplete.

### Archiving a task

Click **Archive** on the right of any task. It disappears from the main list and moves to the archive.

There is no delete function anywhere in the app. This is deliberate — the database layer has no `DELETE` statement, so a task cannot be lost through the interface.

### Viewing the archive

Follow the **Archive** link in the page header. Archived tasks can be restored from there, which returns them to the main list with their completion state intact.

## Project structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── page.js          Main page, lists active tasks
│   │   ├── actions.js       Server actions for all mutations
│   │   ├── layout.js        Root layout
│   │   └── globals.css      Tailwind entry point
│   ├── components/
│   │   ├── TaskForm.js      Creation form
│   │   └── TaskItem.js      Single task row
│   └── lib/
│       ├── db.js            Connection and schema
│       └── tasks.js         All SQL queries
├── next.config.mjs
├── jsconfig.json
└── package.json
```

## Database schema

The `tasks` table is created on first import of `src/lib/db.js` if it does not already exist.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, autoincrement |
| `title` | TEXT | Required |
| `description` | TEXT | Defaults to empty string |
| `due_date` | TEXT | Nullable, stored as `YYYY-MM-DD` |
| `topic` | TEXT | Defaults to empty string |
| `completed` | INTEGER | 0 or 1 |
| `archived` | INTEGER | 0 or 1 |
| `created_at` | TEXT | Set automatically |

SQLite has no boolean type, so `completed` and `archived` are stored as integers and converted to real booleans in `src/lib/tasks.js` before reaching the components.

All queries use parameter placeholders rather than string interpolation, so user input cannot alter the shape of a statement.

## Resetting the database

Stop the dev server, delete the database files, and restart:

```bash
rm tasks.db tasks.db-wal tasks.db-shm
npm run dev
```

On Windows PowerShell:

```powershell
Remove-Item tasks.db, tasks.db-wal, tasks.db-shm
npm run dev
```

The schema is recreated empty on the next start.

## Notes

The database file is listed in `.gitignore` and is not committed. Each clone of the repository starts with an empty task list.

This app is built to run locally and has no authentication, no multi-user support, and no deployment configuration.