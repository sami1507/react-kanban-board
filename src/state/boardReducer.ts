import { COLUMNS, type BoardState, type ColumnId, type Task } from "../types";

export type BoardAction =
  | { type: "task/add"; column: ColumnId; task: Task }
  | { type: "task/delete"; taskId: string }
  | { type: "task/move"; taskId: string; to: ColumnId; beforeTaskId?: string };

export function createEmptyBoard(): BoardState {
  return {
    columns: { backlog: [], "in-progress": [], review: [], done: [] },
    tasks: {},
  };
}

export function findColumn(state: BoardState, taskId: string): ColumnId | undefined {
  return COLUMNS.find((column) => state.columns[column.id].includes(taskId))?.id;
}

/**
 * Pure state transitions for the board. Every action returns either a new state
 * or the same object when nothing would change, so React can skip re-rendering.
 */
export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "task/add": {
      if (state.tasks[action.task.id]) {
        return state;
      }
      return {
        tasks: { ...state.tasks, [action.task.id]: action.task },
        columns: {
          ...state.columns,
          [action.column]: [...state.columns[action.column], action.task.id],
        },
      };
    }

    case "task/delete": {
      if (!state.tasks[action.taskId]) {
        return state;
      }
      const tasks = { ...state.tasks };
      delete tasks[action.taskId];

      const columns = { ...state.columns };
      for (const column of COLUMNS) {
        columns[column.id] = state.columns[column.id].filter((id) => id !== action.taskId);
      }
      return { tasks, columns };
    }

    case "task/move": {
      const from = findColumn(state, action.taskId);
      if (!from || action.taskId === action.beforeTaskId) {
        return state;
      }

      const withoutTask = state.columns[from].filter((id) => id !== action.taskId);
      const destination = action.to === from ? withoutTask : [...state.columns[action.to]];
      const position =
        action.beforeTaskId === undefined ? -1 : destination.indexOf(action.beforeTaskId);
      destination.splice(position === -1 ? destination.length : position, 0, action.taskId);

      return {
        ...state,
        columns: { ...state.columns, [from]: withoutTask, [action.to]: destination },
      };
    }
  }
}
