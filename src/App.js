// src/App.js
import React from "react";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import "./App.css";
import "react-calendar/dist/Calendar.css";

export default function App() {
  const { currentUser } = useAuth();
  return currentUser ? <Dashboard /> : <Auth />;
}
