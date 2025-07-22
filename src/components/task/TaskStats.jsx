import React from "react";
import { TaskStatus } from "../../types";

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === TaskStatus.COMPLETED
  ).length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS
  ).length;
  const todoTasks = tasks.filter((t) => t.status === TaskStatus.TODO).length;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedTasks,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "In Preogress",
      value: inProgressTasks,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "To Do",
      value: todoTasks,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];
};
