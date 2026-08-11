export const SORTS = {
  due: 'due_date IS NULL, due_date ASC, id DESC',
  topic: `topic = '', topic COLLATE NOCASE, due_date IS NULL, due_date ASC`,
  status: `CASE status WHEN 'inprogress' THEN 0 WHEN 'todo' THEN 1 ELSE 2 END, id DESC`,
};

export const DEFAULT_SORT = 'due';

export const SORT_LABELS = {
  due: 'Due date',
  topic: 'Topic',
  status: 'Status',
};