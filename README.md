# Task Manager

A local-first task manager. Runs on your own machine, stores everything in a
SQLite file next to the application, and serves a single user. There are no
accounts and nothing is sent over the network.

## Features

- Create, edit and archive tasks with a title, description, due date and topic.
- Tasks are never deleted. Archiving hides a task from the main list while
  keeping it viewable on the archive page, and it can be restored at any time.
- Each task has one of three fixed statuses: Todo, In-Progress, Complete.
- The task list can be sorted by due date, topic or status.
- Tasks past their due date are flagged as overdue.
- All data persists across restarts.

## Running It

Requires **Node.js 20 or later**. The project uses Node's built-in test runner,
which is stable from version 20.

```bash
npm install     # install dependencies
npm run dev     # start in development mode at http://localhost:3000
npm test        # run the test suite
```

For a production build:

```bash
npm run build
npm start
```

The database file `todo.db` is created automatically in the project root on
first run, so a fresh clone starts with an empty task list.

## Third-Party Code

| Package | Why |
| --- | --- |
| `next` | Provides the App Router, server components and server actions, which let pages read SQLite directly without a separate API layer. |
| `react`, `react-dom` | Required by Next.js as the rendering library. |
| `better-sqlite3` | Synchronous SQLite driver. A local single-user application has no concurrency to manage, so synchronous calls are simpler than promise-based alternatives and measurably faster. |
| `tailwindcss` | Utility classes keep styling next to the markup, avoiding a separate stylesheet for an application this small. |
| `eslint`, `eslint-config-next` | Catches common React and Next.js mistakes before they reach the browser. |

Testing uses `node:test` and `node:assert`, both built into Node, so the test
suite adds no dependencies.

## Database Design

One table, `tasks`. There are no relationships between tables because there is
only one entity. Topic and status are stored as plain values rather than
foreign keys, explained below.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INTEGER | Primary key, autoincrement. |
| `title` | TEXT | Required, never empty. |
| `description` | TEXT | Defaults to an empty string. |
| `due_date` | TEXT | `YYYY-MM-DD`, or NULL when no deadline is set. |
| `topic` | TEXT | Defaults to `General`. |
| `status` | TEXT | One of `todo`, `inprogress`, `completed`. Defaults to `todo`. |
| `archived_at` | TEXT | Timestamp when archived, NULL while active. |
| `created_at` | TEXT | Set automatically on insert. |

### Design notes

**Status is not a separate table.** The three statuses are fixed and not
user-customisable, so a lookup table would add a join for a set that cannot
change. The permitted values live in `src/lib/statuses.js` and are enforced in
`setStatus`, the only write path to that column.

**Topic is a plain string, not a foreign key.** Topics are free text entered
per task with no properties of their own, so a `topics` table would store
nothing beyond the name itself.

**`archived_at` is both the flag and the timestamp.** A task is active when it
is NULL and archived otherwise, which avoids keeping a separate boolean in sync
with a date. `src/lib/tasks.js` contains no delete operation at all, so
archived tasks remain viewable indefinitely.

**Derived values are not stored.** Whether a task is overdue is computed at
render time from `due_date` and `status`, so it can never disagree with the
data it is derived from.

**Dates are stored as ISO strings.** SQLite has no date type, and `YYYY-MM-DD`
sorts chronologically under plain string comparison, so ordering and overdue
checks work without conversion.

## Project Structure

```
src/
  app/
    page.js                    task list
    archive/page.js            archived tasks
    tasks/[id]/edit/page.js    edit form
  components/
    TaskForm.js                shared create and edit form
  lib/
    db.js                      opens the database file
    schema.js                  table definition, shared with tests
    tasks.js                   all task queries and mutations
    actions.js                 server actions wrapping tasks.js
    statuses.js                the three fixed statuses
    sorts.js                   permitted sort orders
    dates.js                   overdue calculation
tests/
  tasks.test.js
```

`tasks.js` takes a database handle as its first argument rather than importing
one, which lets the tests run every function against a fresh in-memory database.