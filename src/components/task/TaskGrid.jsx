import React from "react";
import TaskCard from "./TaskCard";

const TaskGrid = ({
  tasks,
  onUpdate,
  onDelete,
  selectedTasks = new Set(),
  onTaskSelect,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl mb-4">No tasks found</div>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    );
  }
};
