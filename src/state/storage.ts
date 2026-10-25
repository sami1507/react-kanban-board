import { COLUMNS, type BoardState, type Task } from "../types";

export const STORAGE_KEY = "kanban-board:v1";

const SEED_TASKS: Task[] = [
  {
    id: "seed-1",
    title: "Write onboarding checklist",
    description: "Cover repository access, CI and the on-call rota.",
    priority: "medium",
  },
  {
    id: "seed-2",
    title: "Set up staging database",
    description: "Seed it from the anonymised nightly snapshot.",
    priority: "high",
  },
  {
    id: "seed-3",
    title: "Add keyboard shortcuts",
    description: "Move cards between columns without a mouse.",
    priority: "low",
  },
  {
    id: "seed-4",
    title: "Fix flaky checkout test",
    description: "Wait for the payment frame instead of sleeping.",
    priority: "high",
  },
  {
    id: "seed-5",
    title: "Review pricing page copy",
    description: "",
    priority: "medium",
  },
];

export function createSeedBoard(): BoardState {
  return {
    tasks: Object.fromEntries(SEED_TASKS.map((task) => [task.id, task])),
    columns: {
      backlog: ["seed-1", "seed-3"],
      "in-progress": ["seed-2"],
      review: ["seed-4"],
      done: ["seed-5"],
    },
  };
}

/** Reads the saved board. Missing, corrupt or unreadable data falls back to the seed board. */
export function loadBoard(storage: Storage | undefined): BoardState {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isBoardState(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Corrupt JSON or blocked storage: start from the seed board instead.
  }
  return createSeedBoard();
}

/** Saves the board. Failures (quota, private mode) are ignored; the board keeps working in memory. */
export function saveBoard(storage: Storage | undefined, board: BoardState): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch {
    // Storage is full or disabled.
  }
}

function isBoardState(value: unknown): value is BoardState {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { columns, tasks } = value as { columns?: unknown; tasks?: unknown };
  if (typeof columns !== "object" || columns === null || typeof tasks !== "object") {
    return false;
  }
  return COLUMNS.every((column) =>
    Array.isArray((columns as Record<string, unknown>)[column.id]),
  );
}
