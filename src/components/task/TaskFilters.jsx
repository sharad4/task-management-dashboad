import React, { useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { TaskStatus, SortBy } from "../../types";

const TaskFilters = ({
  filter,
  sortBy,
  searchTerm,
  onFilterChange,
  onSortChange,
  onSearchChange,
  isPending = false,
}) => {
  const handleSearchChange = useCallback(
    (e) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg mb-6">
      <div className="flex-1 min-w-64">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-opacity duration-200 ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Tasks</option>
          <option value={TaskStatus.TODO}>To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
        </select>
      </div>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value={SortBy.CREAETD_AT}>Sort by Date</option>
        <option value={SortBy.PRIORITY}>Sort by Priority</option>
        <option value={SortBy.TITLE}>Sort by Title</option>
      </select>
    </div>
  );
};

export default TaskFilters;
