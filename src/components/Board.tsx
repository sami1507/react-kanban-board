import type { Dispatch } from "react";
import type { BoardAction } from "../state/boardReducer";
import { COLUMNS, type BoardState, type Task } from "../types";
import { Column } from "./Column";

interface BoardProps {
  board: BoardState;
  dispatch: Dispatch<BoardAction>;
}

let nextTaskNumber = 0;

function createTaskId(): string {
  nextTaskNumber += 1;
  return `task-${Date.now().toString(36)}-${nextTaskNumber}`;
}

export function Board({ board, dispatch }: BoardProps) {
  return (
    <main className="board" aria-label="Task board">
      {COLUMNS.map((column, position) => {
        const tasks: Task[] = board.columns[column.id].map((id) => board.tasks[id]);
        return (
          <Column
            key={column.id}
            column={column}
            tasks={tasks}
            previous={position > 0 ? COLUMNS[position - 1] : undefined}
            next={position < COLUMNS.length - 1 ? COLUMNS[position + 1] : undefined}
            onAdd={(values) =>
              dispatch({
                type: "task/add",
                column: column.id,
                task: { id: createTaskId(), ...values },
              })
            }
            onDelete={(taskId) => dispatch({ type: "task/delete", taskId })}
            onMove={(taskId, to, beforeTaskId) =>
              dispatch({ type: "task/move", taskId, to, beforeTaskId })
            }
          />
        );
      })}
    </main>
  );
}
