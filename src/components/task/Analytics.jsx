import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

const AnalyticsContent = lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: ({ tasks }) => {
              const completedTasks = tasks.filter(
                (t) => t.status === "completed"
              ).length;
              const inProgressTasks = tasks.filter(
                (t) => t.status === "in-progress"
              ).length;
              const todoTasks = tasks.filter((t) => t.status === "todo").length;

              return (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-4">
                    Analytics Dashboard
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{completedTasks}</div>
                      <div className="text-sm opacity-80">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {inProgressTasks}
                      </div>
                      <div className="text-sm opacity-80">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{todoTasks}</div>
                      <div className="text-sm opacity-80">Pending</div>
                    </div>
                  </div>
                </div>
              );
            },
          }),
        2000
      )
    )
);

const Analytics = ({ tasks }) => {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-200 animate-pulse p-6 rounded-lg flex items-center justify-center">
          <LoadingSpinner size="lg" />
          <span className="ml-2 text-gray-600">Loading Analytics...</span>
        </div>
      }
    >
      <AnalyticsContent tasks={tasks} />
    </Suspense>
  );
};

export default Analytics;
