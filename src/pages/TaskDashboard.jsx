import React, {
  useState,
  useMemo,
  useCallback,
  useTransition,
  useDeferredValue,
} from "react";

// Components
import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";
import TaskFilters from "../components/task/TaskFilters";
import TaskGrid from "../components/task/TaskGrid";
import TaskForm from "../components/task/TaskForm";
import TaskStats from "../components/task/TaskStats";
import BulkActions from "../components/comman/BulkActions";
import Analytics from "../components/task/Analytics";
import Modal from "../components/ui/Modal";

// Hooks
import { useTaskManager } from "../hooks/useTaskManager";
import { useDebounce } from "../hooks/useDebounce";

// Utils
import { filterTasks, sortTasks } from "../utils/helpers";
import { TASK_ACTIONS } from "../reducers/taskReducer";

const TaskDashboard = () => {
  const { state, dispatch } = useTaskManager();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [isPending, startTransition] = useTransition();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);

  // Memoized filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(state.tasks, state.filter, deferredSearchTerm);
    return sortTasks(filtered, state.sortBy);
  }, [state.tasks, state.filter, deferredSearchTerm, state.sortBy]);

  // Event handlers
  const handleCreateTask = useCallback(
    (taskData) => {
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: taskData });
      setShowForm(false);
    },
    [dispatch]
  );

  const handleUpdateTask = useCallback(
    (taskData) => {
      dispatch({
        type: TASK_ACTIONS.UPDATE_TASK,
        payload: { ...editingTask, ...taskData },
      });
      setEditingTask(null);
      setShowForm(false);
    },
    [dispatch, editingTask]
  );

  const handleDeleteTask = useCallback(
    (taskId) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId });
        setSelectedTasks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }
    },
    [dispatch]
  );

  const handleBulkStatusUpdate = useCallback(
    (status) => {
      dispatch({
        type: TASK_ACTIONS.BULK_UPDATE,
        payload: {
          ids: Array.from(selectedTasks),
          updates: { status },
        },
      });
      setSelectedTasks(new Set());
    },
    [dispatch, selectedTasks]
  );

  const handleTaskSelect = useCallback((taskId, isSelected) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  }, []);

  const handleSearchChange = useCallback((value) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleCreateNewTask = useCallback(() => {
    setEditingTask(null);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingTask(null);
  }, []);

  return (
    <Layout>
      {/* Header */}

      <Header
        onCreateTask={handleCreateNewTask}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        showAnalytics={showAnalytics}
      />

      {/* Analytics */}
      {showAnalytics && (
        <div className="mb-6">
          <Analytics tasks={state.tasks} />
        </div>
      )}

      {/* Task Form Modal */}
      <Modal isOpen={showForm} onClose={handleCloseForm}>
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseForm}
        />
      </Modal>

      {/* Filters */}
      <TaskFilters
        filter={state.filter}
        sortBy={state.sortBy}
        searchTerm={searchTerm}
        onFilterChange={(filter) =>
          dispatch({ type: TASK_ACTIONS.SET_FILTER, payload: filter })
        }
        onSortChange={(sortBy) =>
          dispatch({ type: TASK_ACTIONS.SET_SORT, payload: sortBy })
        }
        onSearchChange={handleSearchChange}
        isPending={isPending}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedTasks.size}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onClearSelection={() => setSelectedTasks(new Set())}
      />

      {/* Task Grid */}
      <div className="mb-8">
        <TaskGrid
          tasks={filteredTasks}
          onUpdate={handleEditTask}
          onDelete={handleDeleteTask}
          selectedTasks={selectedTasks}
          onTaskSelect={handleTaskSelect}
        />
      </div>

      {/* Task Stats */}
      <TaskStats tasks={state.tasks} />
    </Layout>
  );
};

export default TaskDashboard;
