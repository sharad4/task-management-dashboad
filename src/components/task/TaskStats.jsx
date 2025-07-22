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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`p-6 rounded-lg shadow-sm ${stat.bgColor}`}
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {stat.title}
          </h3>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          {totalTasks > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              {Math.round((stat.value / totalTasks) * 100)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
