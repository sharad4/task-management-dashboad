import React from "react";
import { Plus } from "lucide-react";

const Header = ({ onCreateTask, onToggleAnalytics, showAnalytics }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Task Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your tasks efficiently with React 19
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onToggleAnalytics}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          {showAnalytics ? "Hide" : "Show"} Analytics
        </button>

        <button
          onClick={onCreateTask}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>
    </div>
  );
};

export default Header;
