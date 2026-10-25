import { useState, type FormEvent } from "react";
import type { Priority } from "../types";

export interface NewTaskValues {
  title: string;
  description: string;
  priority: Priority;
}

interface NewTaskFormProps {
  onSubmit: (values: NewTaskValues) => void;
  onCancel: () => void;
}

export function NewTaskForm({ onSubmit, onCancel }: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const trimmedTitle = title.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedTitle) {
      return;
    }
    onSubmit({ title: trimmedTitle, description: description.trim(), priority });
  }

  return (
    <form className="new-task" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} autoFocus />
      </label>
      <label>
        Description
        <textarea
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label>
        Priority
        <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <div className="form-actions">
        <button type="submit" disabled={!trimmedTitle}>
          Add task
        </button>
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
