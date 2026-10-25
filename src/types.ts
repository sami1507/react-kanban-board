export type ColumnId = "backlog" | "in-progress" | "review" | "done";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: readonly Column[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export interface BoardState {
  /** Task ids in display order, one list per column. */
  columns: Record<ColumnId, string[]>;
  /** Task records keyed by id. Every id in `columns` must exist here. */
  tasks: Record<string, Task>;
}
