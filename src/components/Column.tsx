import { useState } from "react";
import type { Column as ColumnModel, ColumnId, Task } from "../types";
import { NewTaskForm, type NewTaskValues } from "./NewTaskForm";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: ColumnModel;
  tasks: Task[];
  previous?: ColumnModel;
  next?: ColumnModel;
  onAdd: (values: NewTaskValues) => void;
  onDelete: (taskId: string) => void;
  /** Moves a task into this column, before `beforeTaskId`, or to the end when it is omitted. */
  onMove: (taskId: string, to: ColumnId, beforeTaskId?: string) => void;
}

export function Column({ column, tasks, previous, next, onAdd, onDelete, onMove }: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [dropActive, setDropActive] = useState(false);

  function handleDrop(taskId: string) {
    setDropActive(false);
    if (taskId) {
      onMove(taskId, column.id);
    }
  }

  return (
    <section
      className={`column${dropActive ? " column-drop-active" : ""}`}
      aria-labelledby={`column-${column.id}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDropActive(true);
      }}
      onDragLeave={() => setDropActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        handleDrop(event.dataTransfer.getData("text/plain"));
      }}
    >
      <header className="column-header">
        <h2 id={`column-${column.id}`}>
          {column.title} <span className="count">{tasks.length}</span>
        </h2>
        <button type="button" className="ghost" aria-expanded={adding} onClick={() => setAdding(!adding)}>
          {adding ? "Close" : "+ Add"}
        </button>
      </header>

      {adding && (
        <NewTaskForm
          onSubmit={(values) => {
            onAdd(values);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <ul className="cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            previous={previous}
            next={next}
            onMove={(to) => onMove(task.id, to)}
            onDelete={onDelete}
            onDropBefore={(draggedId) => onMove(draggedId, column.id, task.id)}
          />
        ))}
      </ul>

      {tasks.length === 0 && <p className="empty">Nothing here yet.</p>}
    </section>
  );
}
