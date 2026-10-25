import type { Column, ColumnId, Task } from "../types";

interface TaskCardProps {
  task: Task;
  previous?: Column;
  next?: Column;
  onMove: (to: ColumnId) => void;
  onDelete: (taskId: string) => void;
  onDropBefore: (taskId: string) => void;
}

export function TaskCard({ task, previous, next, onMove, onDelete, onDropBefore }: TaskCardProps) {
  return (
    <li
      className="card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", task.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onDrop={(event) => {
        // Handle the drop here so the column does not also append the card.
        event.preventDefault();
        event.stopPropagation();
        const draggedId = event.dataTransfer.getData("text/plain");
        if (draggedId) {
          onDropBefore(draggedId);
        }
      }}
    >
      <div className="card-top">
        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
        <button
          type="button"
          className="icon-button"
          aria-label={`Delete ${task.title}`}
          onClick={() => onDelete(task.id)}
        >
          ×
        </button>
      </div>
      <h3 className="card-title">{task.title}</h3>
      {task.description && <p className="card-description">{task.description}</p>}
      <div className="card-actions">
        {previous && (
          <button
            type="button"
            aria-label={`Move "${task.title}" to ${previous.title}`}
            onClick={() => onMove(previous.id)}
          >
            ← {previous.title}
          </button>
        )}
        {next && (
          <button
            type="button"
            aria-label={`Move "${task.title}" to ${next.title}`}
            onClick={() => onMove(next.id)}
          >
            {next.title} →
          </button>
        )}
      </div>
    </li>
  );
}
