import { describe, expect, it } from "vitest";
import { boardReducer, createEmptyBoard, type BoardAction } from "../state/boardReducer";
import type { BoardState, Task } from "../types";

const task = (id: string): Task => ({ id, title: `Task ${id}`, description: "", priority: "medium" });

function apply(state: BoardState, ...actions: BoardAction[]): BoardState {
  return actions.reduce(boardReducer, state);
}

describe("boardReducer", () => {
  it("appends new tasks to the chosen column", () => {
    const state = apply(
      createEmptyBoard(),
      { type: "task/add", column: "backlog", task: task("a") },
      { type: "task/add", column: "done", task: task("b") },
    );

    expect(state.columns.backlog).toEqual(["a"]);
    expect(state.columns.done).toEqual(["b"]);
    expect(Object.keys(state.tasks)).toEqual(["a", "b"]);
  });

  it("ignores an add with an id that already exists", () => {
    const state = apply(createEmptyBoard(), { type: "task/add", column: "backlog", task: task("a") });
    const again = boardReducer(state, { type: "task/add", column: "review", task: task("a") });

    expect(again).toBe(state);
  });

  it("moves a task into another column before the given card", () => {
    const state = apply(
      createEmptyBoard(),
      { type: "task/add", column: "backlog", task: task("a") },
      { type: "task/add", column: "backlog", task: task("b") },
      { type: "task/add", column: "review", task: task("x") },
      { type: "task/move", taskId: "b", to: "review", beforeTaskId: "x" },
    );

    expect(state.columns.backlog).toEqual(["a"]);
    expect(state.columns.review).toEqual(["b", "x"]);
  });

  it("reorders tasks inside one column", () => {
    const state = apply(
      createEmptyBoard(),
      { type: "task/add", column: "backlog", task: task("a") },
      { type: "task/add", column: "backlog", task: task("b") },
      { type: "task/add", column: "backlog", task: task("c") },
      { type: "task/move", taskId: "a", to: "backlog", beforeTaskId: "c" },
    );

    expect(state.columns.backlog).toEqual(["b", "a", "c"]);
  });

  it("appends to the end of a column when no target card is given", () => {
    const state = apply(
      createEmptyBoard(),
      { type: "task/add", column: "backlog", task: task("a") },
      { type: "task/add", column: "done", task: task("z") },
      { type: "task/move", taskId: "a", to: "done" },
    );

    expect(state.columns.done).toEqual(["z", "a"]);
    expect(state.columns.backlog).toEqual([]);
  });

  it("removes a deleted task from its column and from the task map", () => {
    const state = apply(
      createEmptyBoard(),
      { type: "task/add", column: "backlog", task: task("a") },
      { type: "task/add", column: "backlog", task: task("b") },
      { type: "task/delete", taskId: "b" },
    );

    expect(state.columns.backlog).toEqual(["a"]);
    expect(state.tasks).not.toHaveProperty("b");
  });

  it("returns the same state object when nothing changes", () => {
    const state = apply(createEmptyBoard(), { type: "task/add", column: "backlog", task: task("a") });

    expect(boardReducer(state, { type: "task/delete", taskId: "missing" })).toBe(state);
    expect(boardReducer(state, { type: "task/move", taskId: "missing", to: "done" })).toBe(state);
    expect(boardReducer(state, { type: "task/move", taskId: "a", to: "backlog", beforeTaskId: "a" })).toBe(state);
  });
});
