// src/components/TaskList.js
// ─────────────────────────────────────────────
// Fetches tasks from Firestore in real-time.
// Filters by current user AND selected calendar date.
// Shows task count stats and the list of TaskItems.
// ─────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "./CalendarView";
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";

export default function TaskList({ selectedDate, onTaskDatesChange }) {
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();

  const selectedDateStr = formatDate(selectedDate);

  // ── Real-time listener: tasks on the selected date ──
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid),  // only THIS user
      where("date", "==", selectedDateStr),     // only selected date
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(fetched);
    });

    return unsubscribe;
  }, [currentUser, selectedDateStr]);

  // ── Real-time listener: all tasks (for calendar dot markers) ──
  const stableCallback = useCallback(onTaskDatesChange, []);
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allDates = snapshot.docs.map((d) => d.data().date);
      stableCallback([...new Set(allDates)]);
    });

    return unsubscribe;
  }, [currentUser, stableCallback]);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="task-panel">

      {/* Stats bar */}
      <div className="task-stats">
        <div className="stat-chip">
          <span className="stat-num">{totalCount}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-chip done">
          <span className="stat-num">{completedCount}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat-chip pending">
          <span className="stat-num">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      {/* Add task input */}
      <TaskInput selectedDate={selectedDate} />

      {/* Task list */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="task-empty">No tasks for this day — add one above!</p>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
