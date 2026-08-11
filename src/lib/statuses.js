export const STATUSES = [
  {
    value: 'todo',
    label: 'Todo',
    idle: 'border-orange-500 text-orange-600',
    active: 'border-orange-500 bg-orange-500 text-white',
  },
  {
    value: 'inprogress',
    label: 'In-Progress',
    idle: 'border-yellow-500 text-yellow-600',
    active: 'border-yellow-500 bg-yellow-400 text-black',
  },
  {
    value: 'completed',
    label: 'Complete',
    idle: 'border-green-600 text-green-700',
    active: 'border-green-600 bg-green-600 text-white',
  },
];

export const STATUS_VALUES = STATUSES.map((s) => s.value);