import React, { memo } from "react";
import {
  Trash2,
  Edit3,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { STATUS_COLORS, PRIORITY_COLORS } from "../../utils/constant";

const TaskCard = memo(({ task, onUpdate, onDelete, isSelected, onSelect }) => {
  const { isDark } = useTheme();

  const StatusIcon = {
    todo: Clock,
    "in-progress": AlertCircle,
    completed: CheckCircle,
  }[task.status];

  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${
        PRIORITY_COLORS[task.priority]
      } ${
        isDark ? "bg-gray-800 text-white" : ""
      } transform hover:scale-105 transition-transform duration-200 relative`}
    >
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(task.id, e.target.checked)}
          className="absolute top-4 right-4 z-10"
        />
      )}

      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg pr-8">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(task)}
            className="p-2 text-gray-500 hover:text-blue-50 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Edit task"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            STATUS_COLORS[task.status]
          }`}
        >
          <StatusIcon size={14} />
          {task.status.replace("-", " ")}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} />
          {task.assignee}
        </span>
        <span>{task.priority} priority</span>
      </div>
    </div>
  );
});
