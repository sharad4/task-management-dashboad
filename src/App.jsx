import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { TaskProvider } from "./context/TaskContext";
import TaskDashboard from "./pages/TaskDashboard";

function App() {
  return (
    <ThemeProvider>
      <TaskProvider value={{}}>
        <TaskDashboard />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
