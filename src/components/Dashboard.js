// src/components/Dashboard.js
// Main app after login. All task state lives here via useTasks hook.
// No prop-drilling of callbacks — clean, Vue-like reactive pattern.

import React, { useState, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import CalendarView, { formatDate } from "./CalendarView";
import TaskItem from "./TaskItem";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [inputText, setInputText]       = useState("");
  const [sidebarOpen, setSidebarOpen]   = useState(false); // mobile
  const inputRef = useRef(null);

  const selectedDateStr = formatDate(selectedDate);

  // All Firestore logic — real-time listeners + mutations
  const { tasks, taskDates, adding, addTask, toggleTask, deleteTask } = useTasks(
    currentUser,
    selectedDateStr
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await addTask(inputText);
    setInputText("");
    inputRef.current?.focus();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSidebarOpen(false); // close sidebar on mobile after picking
  };

  const handleLogout = () => signOut(auth);

  // Stats
  const total     = tasks.length;
  const done      = tasks.filter(t => t.completed).length;
  const pct       = total === 0 ? 0 : Math.round((done / total) * 100);

  // Date heading
  const todayStr = formatDate(new Date());
  const isToday  = selectedDateStr === todayStr;
  const heading  = isToday
    ? "Today"
    : selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="app-shell">

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="app-logo">
            <div className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="app-name">Taskflow</span>
          </div>
        </div>

        {/* User card */}
        <div className="user-card">
          <div className="user-avatar">
            {currentUser.email[0].toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-email">{currentUser.email}</span>
            <span className="user-badge">Active</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="sidebar-section">
          <p className="sidebar-label">Calendar</p>
          <CalendarView
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            taskDates={taskDates}
          />
        </div>

        {/* Overall progress */}
        <div className="sidebar-section">
          <p className="sidebar-label">All-time streak</p>
          <div className="streak-row">
            <span className="streak-num">{taskDates.length}</span>
            <span className="streak-text">active days</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </aside>

      {/* ── Main panel ── */}
      <main className="main-panel">

        {/* Top bar */}
        <header className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <div className="topbar-center">
            <h1 className="day-heading">{heading}</h1>
            <span className="day-date">{selectedDateStr}</span>
          </div>
          <div className="topbar-right">
            {isToday && <span className="today-chip">Today</span>}
          </div>
        </header>

        {/* Stats strip */}
        <div className="stats-strip">
          <div className="stat-card">
            <span className="stat-val">{total}</span>
            <span className="stat-key">Tasks</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-val">{done}</span>
            <span className="stat-key">Done</span>
          </div>
          <div className="stat-card muted">
            <span className="stat-val">{total - done}</span>
            <span className="stat-key">Left</span>
          </div>

          {/* Progress bar */}
          <div className="progress-wrap">
            <div className="progress-meta">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Add task form */}
        <form className="add-form" onSubmit={handleAdd}>
          <input
            ref={inputRef}
            className="add-input"
            type="text"
            placeholder="What needs to be done?"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={adding}
          />
          <button
            className="add-btn"
            type="submit"
            disabled={adding || !inputText.trim()}
          >
            {adding ? <span className="btn-spinner dark" /> : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
          </button>
        </form>

        {/* Task list */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <p className="empty-title">All clear!</p>
              <p className="empty-sub">Add a task to get started for {isToday ? "today" : heading}.</p>
            </div>
          ) : (
            <>
              {/* Pending tasks */}
              {tasks.filter(t => !t.completed).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}

              {/* Divider if there are done tasks */}
              {done > 0 && tasks.some(t => !t.completed) && (
                <div className="section-divider">
                  <span>Completed · {done}</span>
                </div>
              )}
              {done > 0 && !tasks.some(t => !t.completed) && (
                <div className="section-divider">
                  <span>All completed · {done}</span>
                </div>
              )}

              {/* Done tasks */}
              {tasks.filter(t => t.completed).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
