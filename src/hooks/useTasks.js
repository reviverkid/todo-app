// src/hooks/useTasks.js
// Central hook for all Firestore task operations.
// Uses onSnapshot for real-time updates.
// KEY FIX: Both listeners are properly cleaned up and re-subscribed
// whenever the user or selected date changes, preventing stale data
// after actions (add/toggle/delete) without needing a page refresh.

import { useState, useEffect, useRef } from "react";
import {
  collection, query, where, orderBy,
  onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export function useTasks(currentUser, selectedDateStr) {
  const [tasks, setTasks]         = useState([]);
  const [taskDates, setTaskDates] = useState([]);
  const [adding, setAdding]       = useState(false);

  // ── LISTENER 1: Tasks for the selected date (real-time) ──────────────
  // Deps: currentUser.uid + selectedDateStr
  // Re-subscribes whenever either changes → always fresh, no stale data
  useEffect(() => {
    if (!currentUser?.uid) { setTasks([]); return; }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid),
      where("date",   "==", selectedDateStr),
      orderBy("createdAt", "asc")
    );

    // onSnapshot fires immediately (current state) then on every change
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Tasks listener error:", err);
    });

    return unsub; // ← critical: unsubscribe old listener before new one
  }, [currentUser?.uid, selectedDateStr]);

  // ── LISTENER 2: All task dates (for calendar dot markers) ────────────
  // Only depends on userId — no need to re-run on date change
  useEffect(() => {
    if (!currentUser?.uid) { setTaskDates([]); return; }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const dates = snap.docs.map(d => d.data().date).filter(Boolean);
      setTaskDates([...new Set(dates)]);
    }, (err) => {
      console.error("TaskDates listener error:", err);
    });

    return unsub;
  }, [currentUser?.uid]);

  // ── MUTATIONS ─────────────────────────────────────────────────────────

  const addTask = async (text) => {
    if (!text.trim() || !currentUser?.uid) return;
    setAdding(true);
    try {
      await addDoc(collection(db, "tasks"), {
        text:      text.trim(),
        completed: false,
        date:      selectedDateStr,
        userId:    currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("addTask error:", e);
    } finally {
      setAdding(false);
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { completed: !completed });
    } catch (e) {
      console.error("toggleTask error:", e);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (e) {
      console.error("deleteTask error:", e);
    }
  };

  return { tasks, taskDates, adding, addTask, toggleTask, deleteTask };
}
