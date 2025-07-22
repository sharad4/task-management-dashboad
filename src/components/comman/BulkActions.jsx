import React from "react";
import { TaskStatus } from "../../types";

const BulkActions = ({
  selectedCount,
  onBulkStatusUpdate,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-6">
      <span className="font-medium">
        {selectedCount} task{selectedCount !== 1 ? "s" : ""} selected
      </span>

      <button
        onClick={() => onBulkStatusUpdate(TaskStatus.COMPLETED)}
        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
      >
        Mark Complete
      </button>

      <button
        onClick={() => onBulkStatusUpdate(TaskStatus.IN_PROGRESS)}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
      >
        In Progress
      </button>

      <button
        onClick={() => onBulkStatusUpdate(TaskStatus.TODO)}
        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
      >
        Mark Todo
      </button>

      <button
        onClick={onClearSelection}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
      >
        Clear Selection
      </button>
    </div>
  );
};

export default BulkActions;
