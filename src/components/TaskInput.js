// src/components/TaskInput.js
// ─────────────────────────────────────────────
// Input bar to add a new task.
// The date is pre-filled with the calendar's selected date.
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "./CalendarView";

export default function TaskInput({ selectedDate }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // ignore empty input

    setLoading(true);
    try {
      // Add a new task document to the "tasks" collection in Firestore
      await addDoc(collection(db, "tasks"), {
        text: text.trim(),           // task description
        completed: false,            // default: not done
        date: formatDate(selectedDate), // "YYYY-MM-DD" string
        userId: currentUser.uid,     // owner of this task
        createdAt: serverTimestamp() // for ordering
      });
      setText(""); // clear input after adding
    } catch (err) {
      console.error("Error adding task:", err);
    }
    setLoading(false);
  };

  return (
    <form className="task-input-form" onSubmit={handleAdd}>
      <input
        className="task-input-field"
        type="text"
        placeholder="Add a new task…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <button className="task-add-btn" type="submit" disabled={loading || !text.trim()}>
        {loading ? "…" : "+"}
      </button>
    </form>
  );
}
