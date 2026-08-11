import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';

import { applySchema } from '../src/lib/schema.js';
import { isOverdue } from '../src/lib/dates.js';
import {
  archiveTask, createTask, getTask, listActive,
  listArchived, restoreTask, setStatus, updateTask,
} from '../src/lib/tasks.js';

let db;

beforeEach(() => {
  db = new Database(':memory:');
  applySchema(db);
});

describe('creating tasks', () => {
  test('persists all four fields', () => {
    const id = createTask(db, {
      title: 'Finish OS lab',
      description: 'Caesar cipher utility',
      due_date: '2026-09-01',
      topic: 'COMS3010A',
    });

    const task = getTask(db, id);
    assert.equal(task.title, 'Finish OS lab');
    assert.equal(task.description, 'Caesar cipher utility');
    assert.equal(task.due_date, '2026-09-01');
    assert.equal(task.topic, 'COMS3010A');
    assert.equal(task.status, 'todo');
    assert.equal(task.archived_at, null);
  });

  test('falls back to General when topic is blank', () => {
    const id = createTask(db, { title: 'Read notes', topic: '   ' });
    assert.equal(getTask(db, id).topic, 'General');
  });

  test('rejects a task with no title', () => {
    assert.equal(createTask(db, { title: '  ' }), null);
    assert.equal(listActive(db).length, 0);
  });
});

describe('archiving', () => {
  test('hides the task from the active list but keeps it readable', () => {
    const id = createTask(db, { title: 'Submit assignment' });
    archiveTask(db, id);

    assert.equal(listActive(db).length, 0);

    const archived = listArchived(db);
    assert.equal(archived.length, 1);
    assert.equal(archived[0].title, 'Submit assignment');
    assert.ok(archived[0].archived_at);
  });

  test('restoring returns the task to the active list', () => {
    const id = createTask(db, { title: 'Book study room' });
    archiveTask(db, id);
    restoreTask(db, id);

    assert.equal(listActive(db).length, 1);
    assert.equal(listArchived(db).length, 0);
  });
});

describe('status', () => {
  test('accepts the three fixed values', () => {
    const id = createTask(db, { title: 'Revise graphics' });

    for (const status of ['inprogress', 'completed', 'todo']) {
      assert.equal(setStatus(db, id, status), true);
      assert.equal(getTask(db, id).status, status);
    }
  });

  test('rejects a value outside the fixed set', () => {
    const id = createTask(db, { title: 'Revise graphics' });
    setStatus(db, id, 'inprogress');

    assert.equal(setStatus(db, id, 'urgent'), false);
    assert.equal(getTask(db, id).status, 'inprogress');
  });
});

describe('sorting', () => {
  test('due date sort puts undated tasks last', () => {
    createTask(db, { title: 'No deadline' });
    createTask(db, { title: 'Later', due_date: '2026-12-01' });
    createTask(db, { title: 'Sooner', due_date: '2026-08-20' });

    const titles = listActive(db, 'due').map((t) => t.title);
    assert.deepEqual(titles, ['Sooner', 'Later', 'No deadline']);
  });

  test('an unknown sort key falls back to the default', () => {
    createTask(db, { title: 'Later', due_date: '2026-12-01' });
    createTask(db, { title: 'Sooner', due_date: '2026-08-20' });

    const titles = listActive(db, 'DROP TABLE tasks').map((t) => t.title);
    assert.deepEqual(titles, ['Sooner', 'Later']);
  });
});

describe('overdue', () => {
  test('flags a past deadline that is not complete', () => {
    assert.equal(isOverdue({ due_date: '2020-01-01', status: 'todo' }), true);
  });

  test('does not flag completed or undated tasks', () => {
    assert.equal(isOverdue({ due_date: '2020-01-01', status: 'completed' }), false);
    assert.equal(isOverdue({ due_date: null, status: 'todo' }), false);
  });
});

describe('editing', () => {
  test('updates fields without changing status or archive state', () => {
    const id = createTask(db, { title: 'Draft report', topic: 'Coursework' });
    setStatus(db, id, 'inprogress');

    updateTask(db, id, { title: 'Draft final report', topic: 'COMS3011A' });

    const task = getTask(db, id);
    assert.equal(task.title, 'Draft final report');
    assert.equal(task.topic, 'COMS3011A');
    assert.equal(task.status, 'inprogress');
    assert.equal(task.archived_at, null);
  });
});

test('there is no way to delete a task', async () => {
  const module = await import('../src/lib/tasks.js');
  const names = Object.keys(module).join(' ').toLowerCase();
  assert.ok(!names.includes('delete'));
});