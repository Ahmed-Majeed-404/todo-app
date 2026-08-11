# AI Transcript

This document accompanies the exported chat log in `ai-chat-log.md`. It records
which tool was used, what it was used for, and which suggestions were rejected.

**Tool:** Claude (Anthropic), accessed through the web chat interface.
**Scope:** One continuous session covering the full build, from an empty
repository to a tested application with documentation.

## Planning

The session opened with the stack already chosen (Next.js and SQLite, running
locally with no deployment and no user accounts) and moved straight to the
consequences of that choice. The decisions made before any code was written:

- Server components reading SQLite directly, with no API layer, since a single
  user on one machine has no need for one.
- `better-sqlite3` over a promise based driver, because there is no concurrency
  to manage and synchronous calls keep the code simpler.
- `serverExternalPackages` in the Next.js config, because `better-sqlite3` is a
  native module that the bundler cannot process.
- A single `tasks` table, with status and topic as plain columns rather than
  foreign keys. The reasoning is recorded in the project README.
- `archived_at` serving as both the archive flag and the timestamp, so there is
  no boolean to keep in sync with a date.

Two setup questions were also worked through: how to scaffold into an already
cloned repository, and whether to enable the React Compiler and generate an
`AGENTS.md` file.

## Code generation

Features were built one at a time, each mapped to a line in the specification.
In order:

1. Task creation, editing and archiving, with title, description, due date and
   topic. No delete path anywhere in the codebase.
2. A separate archive page, with restore.
3. Sorting by topic, status and due date, with the sort key held in the URL and
   validated against a whitelist before it reaches the SQL.
4. Three fixed statuses, defined in one module so the set cannot drift, with
   colour coded buttons.
5. An overdue indicator, computed at render time from the due date and status
   rather than stored, so it cannot disagree with the data behind it.
6. A calendar icon on the date field, replacing the inconsistent native picker
   indicator.
7. A refactor pulling all database logic out of the server actions into
   `src/lib/tasks.js`, with each function taking a database handle as its first
   argument. This is what made the code testable.
8. Thirteen tests against an in memory SQLite database, using Node's built in
   test runner so no test dependencies were added.
9. The project README, covering third party code, database design and how to
   run the application.

## Debugging

Three problems took more than one attempt to resolve.

**A JSX syntax error** reporting an unexpected closing brace, caused by a
template literal losing its opening delimiter during a paste.

**A 404 on the edit route.** The initial diagnosis was wrong: the suggested
PowerShell command for creating a folder named `[id]` used backtick escaping,
which PowerShell itself consumes inside double quotes, producing a folder with
literal backticks in the name. The correct approach is `-LiteralPath`, which
disables wildcard interpretation entirely. Diagnosis eventually came down to
logging inside the route handler to distinguish an unregistered route from a
failed database lookup.

**A schema change that did not apply**, because `CREATE TABLE IF NOT EXISTS`
silently does nothing when the table already exists. Resolved by adding a
`PRAGMA table_info` check and an `ALTER TABLE` for existing databases.

## Suggestions rejected

Not everything proposed was kept. These were turned down deliberately:

- **Defaulting an empty due date to the end of the current day.** Implemented,
  then reverted. With no undated tasks left, every task created and left alone
  would show as overdue the following day, which makes the flag meaningless.
- **The React Compiler.** Declined at scaffold time. It optimises client side
  re-rendering, and this application is almost entirely server rendered, so the
  slower builds would buy nothing.
- **Date formatting and label rewording.** A set of presentational changes
  proposed unprompted and dropped, to keep the diff focused on the requirement
  being worked on.
- **Removing the "Newest" sort option**, which was a direct instruction rather
  than a rejection, but required a follow on fix: the default sort constant
  pointed at the option being deleted, which would have thrown on every page
  load.
- **Opening the date picker on field click.** Replaced with an explicit
  calendar icon, which is clearer and behaves consistently across browsers.