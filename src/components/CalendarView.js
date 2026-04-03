// src/components/CalendarView.js
import React from "react";
import Calendar from "react-calendar";

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarView({ selectedDate, onDateChange, taskDates }) {
  return (
    <div className="cal-shell">
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;
          const str = formatDate(date);
          return taskDates.includes(str)
            ? <span className="cal-dot" />
            : null;
        }}
        tileClassName={({ date, view }) => {
          if (view !== "month") return null;
          const str = formatDate(date);
          return taskDates.includes(str) ? "has-tasks" : null;
        }}
      />
    </div>
  );
}
