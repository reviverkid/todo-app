// src/components/TaskItem.js
import React, { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete }) {
  const { id, text, completed } = task;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    // small delay to let the exit animation play
    setTimeout(() => onDelete(id), 260);
  };

  return (
    <div className={`task-row ${completed ? "is-done" : ""} ${deleting ? "is-deleting" : ""}`}>
      {/* Custom animated checkbox */}
      <button
        className={`check-btn ${completed ? "checked" : ""}`}
        onClick={() => onToggle(id, completed)}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      >
        <svg className="check-svg" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
          {completed && (
            <path
              d="M5.5 9l2.5 2.5 4.5-4.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>

      {/* Text */}
      <span className="task-label">{text}</span>

      {/* Delete */}
      <button
        className="del-btn"
        onClick={handleDelete}
        aria-label="Delete task"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
