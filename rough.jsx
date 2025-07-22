// File Structure Overview
src/
├── components/
│ ├── ui/
│ │ ├── CustomInput.jsx
│ │ ├── Modal.jsx
│ │ └── LoadingSpinner.jsx
│ ├── task/
│ │ ├── TaskCard.jsx
│ │ ├── TaskForm.jsx
│ │ ├── TaskFilters.jsx
│ │ ├── TaskGrid.jsx
│ │ └── TaskStats.jsx
│ ├── layout/
│ │ ├── Header.jsx
│ │ └── Layout.jsx
│ └── common/
│ ├── ErrorBoundary.jsx
│ └── BulkActions.jsx
├── pages/
│ └── TaskDashboard.jsx
├── hooks/
│ ├── useTaskManager.js
│ ├── useDebounce.js
│ └── useLocalStorage.js
├── context/
│ ├── ThemeContext.jsx
│ └── TaskContext.jsx
├── reducers/
│ └── taskReducer.js
├── utils/
│ ├── constants.js
│ └── helpers.js
├── services/
│ └── taskService.js
├── types/
│ └── index.js
└── App.jsx

// ==============================================
// src/types/index.js
// ==============================================

export const TaskStatus = {
TODO: 'todo',
IN_PROGRESS: 'in-progress',
COMPLETED: 'completed'
};

export const TaskPriority = {
LOW: 'low',
MEDIUM: 'medium',
HIGH: 'high'
};

export const SortBy = {
CREATED_AT: 'createdAt',
PRIORITY: 'priority',
TITLE: 'title'
};

// ==============================================
// src/utils/constants.js
// ==============================================

export const STATUS_COLORS = {
[TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
[TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
[TaskStatus.COMPLETED]: 'bg-green-100 text-green-800'
};

export const PRIORITY_COLORS = {
[TaskPriority.LOW]: 'border-l-green-500',
[TaskPriority.MEDIUM]: 'border-l-yellow-500',
[TaskPriority.HIGH]: 'border-l-red-500'
};

export const PRIORITY_ORDER = {
[TaskPriority.HIGH]: 3,
[TaskPriority.MEDIUM]: 2,
[TaskPriority.LOW]: 1
};

// ==============================================
// src/utils/helpers.js
// ==============================================

export const validateTaskForm = (formData) => {
const errors = {};
if (!formData.title?.trim()) errors.title = 'Title is required';
if (!formData.assignee?.trim()) errors.assignee = 'Assignee is required';
return errors;
};

export const sortTasks = (tasks, sortBy) => {
return [...tasks].sort((a, b) => {
switch (sortBy) {
case SortBy.PRIORITY:
return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
case SortBy.TITLE:
return a.title.localeCompare(b.title);
case SortBy.CREATED_AT:
default:
return new Date(b.createdAt) - new Date(a.createdAt);
}
});
};

export const filterTasks = (tasks, filter, searchTerm) => {
let filtered = tasks;

if (filter !== 'all') {
filtered = filtered.filter(task => task.status === filter);
}

if (searchTerm) {
const lowerSearchTerm = searchTerm.toLowerCase();
filtered = filtered.filter(task =>
task.title.toLowerCase().includes(lowerSearchTerm) ||
task.assignee.toLowerCase().includes(lowerSearchTerm)
);
}

return filtered;
};

// ==============================================
// src/reducers/taskReducer.js
// ==============================================

export const TASK_ACTIONS = {
ADD_TASK: 'ADD_TASK',
UPDATE_TASK: 'UPDATE_TASK',
DELETE_TASK: 'DELETE_TASK',
SET_FILTER: 'SET_FILTER',
SET_SORT: 'SET_SORT',
BULK_UPDATE: 'BULK_UPDATE'
};

export const initialTaskState = {
tasks: [
{
id: 1,
title: 'Learn React 19',
priority: 'high',
status: 'in-progress',
assignee: 'John',
createdAt: new Date()
},
{
id: 2,
title: 'Build Dashboard',
priority: 'medium',
status: 'todo',
assignee: 'Jane',
createdAt: new Date()
},
{
id: 3,
title: 'Write Tests',
priority: 'low',
status: 'completed',
assignee: 'Bob',
createdAt: new Date()
}
],
filter: 'all',
sortBy: 'createdAt'
};

export const taskReducer = (state, action) => {
switch (action.type) {
case TASK_ACTIONS.ADD_TASK:
return {
...state,
tasks: [...state.tasks, {
...action.payload,
id: Date.now(),
createdAt: new Date()
}]
};

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload }
            : task
        )
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case TASK_ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload };

    case TASK_ACTIONS.SET_SORT:
      return { ...state, sortBy: action.payload };

    case TASK_ACTIONS.BULK_UPDATE:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          action.payload.ids.includes(task.id)
            ? { ...task, ...action.payload.updates }
            : task
        )
      };

    default:
      return state;

}
};

// ==============================================
// src/context/ThemeContext.jsx
// ==============================================

import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
const [theme, setTheme] = useState('light');

const value = {
theme,
setTheme,
isDark: theme === 'dark'
};

return (
<ThemeContext.Provider value={value}>
{children}
</ThemeContext.Provider>
);
};

export const useTheme = () => {
const context = useContext(ThemeContext);
if (!context) {
throw new Error('useTheme must be used within ThemeProvider');
}
return context;
};

export default ThemeContext;

// ==============================================
// src/context/TaskContext.jsx
// ==============================================

import { createContext, useContext } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children, value }) => {
return (
<TaskContext.Provider value={value}>
{children}
</TaskContext.Provider>
);
};

export const useTaskContext = () => {
const context = useContext(TaskContext);
if (!context) {
throw new Error('useTaskContext must be used within TaskProvider');
}
return context;
};

export default TaskContext;

// ==============================================
// src/hooks/useDebounce.js
// ==============================================

import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
const [debouncedValue, setDebouncedValue] = useState(value);

useEffect(() => {
const handler = setTimeout(() => {
setDebouncedValue(value);
}, delay);

    return () => clearTimeout(handler);

}, [value, delay]);

return debouncedValue;
};

// ==============================================
// src/hooks/useTaskManager.js
// ==============================================

import { useReducer } from 'react';
import { taskReducer, initialTaskState } from '../reducers/taskReducer';

export const useTaskManager = () => {
const [state, dispatch] = useReducer(taskReducer, initialTaskState);

return {
state,
dispatch
};
};

// ==============================================
// src/hooks/useLocalStorage.js
// ==============================================

import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
const [storedValue, setStoredValue] = useState(() => {
try {
const item = window.localStorage.getItem(key);
return item ? JSON.parse(item) : initialValue;
} catch (error) {
console.error(`Error reading localStorage key "${key}":`, error);
return initialValue;
}
});

const setValue = (value) => {
try {
const valueToStore = value instanceof Function ? value(storedValue) : value;
setStoredValue(valueToStore);
window.localStorage.setItem(key, JSON.stringify(valueToStore));
} catch (error) {
console.error(`Error setting localStorage key "${key}":`, error);
}
};

return [storedValue, setValue];
};

// ==============================================
// src/services/taskService.js
// ==============================================

// Mock API service for task operations
class TaskService {
static async getAllTasks() {
// Simulate API call
return new Promise((resolve) => {
setTimeout(() => {
resolve({
success: true,
data: []
});
}, 1000);
});
}

static async createTask(taskData) {
return new Promise((resolve) => {
setTimeout(() => {
resolve({
success: true,
data: { ...taskData, id: Date.now(), createdAt: new Date() }
});
}, 500);
});
}

static async updateTask(taskId, updates) {
return new Promise((resolve) => {
setTimeout(() => {
resolve({
success: true,
data: { id: taskId, ...updates }
});
}, 500);
});
}

static async deleteTask(taskId) {
return new Promise((resolve) => {
setTimeout(() => {
resolve({
success: true,
data: { id: taskId }
});
}, 300);
});
}
}

export default TaskService;

// ==============================================
// src/components/common/ErrorBoundary.jsx
// ==============================================

import React from 'react';

class ErrorBoundary extends React.Component {
constructor(props) {
super(props);
this.state = { hasError: false, error: null };
}

static getDerivedStateFromError(error) {
return { hasError: true, error };
}

componentDidCatch(error, errorInfo) {
console.error('Error caught by boundary:', error, errorInfo);
}

render() {
if (this.state.hasError) {
return (

<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
<h2 className="text-lg font-semibold text-red-800 mb-2">
Something went wrong!
</h2>
<p className="text-red-600 mb-4">
{this.props.fallbackMessage || 'Please refresh the page and try again.'}
</p>
<button
onClick={() => window.location.reload()}
className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" >
Refresh Page
</button>
</div>
);
}

    return this.props.children;

}
}

export default ErrorBoundary;

// ==============================================
// src/components/ui/CustomInput.jsx
// ==============================================

import React, { forwardRef, useId } from 'react';

const CustomInput = forwardRef(({
label,
error,
className = '',
containerClassName = '',
...props
}, ref) => {
const id = useId();

return (

<div className={`mb-4 ${containerClassName}`}>
{label && (
<label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
{label}
</label>
)}
<input
id={id}
ref={ref}
className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
{...props}
/>
{error && (
<p className="mt-1 text-sm text-red-500">{error}</p>
)}
</div>
);
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;

// ==============================================
// src/components/ui/Modal.jsx
// ==============================================

import React from 'react';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
if (!isOpen) return null;

return (

<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className={`max-w-md w-full ${className}`}>
{children}
</div>
</div>
);
};

export default Modal;

// ==============================================
// src/components/ui/LoadingSpinner.jsx
// ==============================================

import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
const sizeClasses = {
sm: 'w-4 h-4',
md: 'w-6 h-6',
lg: 'w-8 h-8'
};

return (

<div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
);
};

export default LoadingSpinner;

// ==============================================
// src/components/task/TaskCard.jsx
// ==============================================

import React, { memo } from 'react';
import { Trash2, Edit3, Clock, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';

const TaskCard = memo(({ task, onUpdate, onDelete, isSelected, onSelect }) => {
const { isDark } = useTheme();

const StatusIcon = {
'todo': Clock,
'in-progress': AlertCircle,
'completed': CheckCircle
}[task.status];

return (

<div className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${PRIORITY_COLORS[task.priority]} ${
      isDark ? 'bg-gray-800 text-white' : ''
    } transform hover:scale-105 transition-transform duration-200 relative`}>

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
            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
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
        <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${STATUS_COLORS[task.status]}`}>
          <StatusIcon size={14} />
          {task.status.replace('-', ' ')}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} />
          {task.assignee}
        </span>
        <span className="capitalize font-medium text-xs px-2 py-1 rounded bg-gray-100">
          {task.priority} priority
        </span>
      </div>
    </div>

);
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;

// ==============================================
// src/components/task/TaskForm.jsx
// ==============================================

import React, { useState, useEffect, useRef } from 'react';
import CustomInput from '../ui/CustomInput';
import { validateTaskForm } from '../../utils/helpers';
import { TaskStatus, TaskPriority } from '../../types';

const TaskForm = ({ task, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
title: task?.title || '',
priority: task?.priority || TaskPriority.MEDIUM,
status: task?.status || TaskStatus.TODO,
assignee: task?.assignee || ''
});
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const titleRef = useRef(null);

useEffect(() => {
titleRef.current?.focus();
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
const newErrors = validateTaskForm(formData);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData({
          title: '',
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.TODO,
          assignee: ''
        });
      } catch (error) {
        console.error('Error submitting task:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }

};

const handleInputChange = (field) => (e) => {
setFormData(prev => ({ ...prev, [field]: e.target.value }));
// Clear error when user starts typing
if (errors[field]) {
setErrors(prev => ({ ...prev, [field]: '' }));
}
};

return (

<div className="bg-white p-6 rounded-lg shadow-lg">
<h2 className="text-xl font-bold mb-4">
{task ? 'Edit Task' : 'Create New Task'}
</h2>

      <form onSubmit={handleSubmit}>
        <CustomInput
          ref={titleRef}
          label="Task Title"
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          placeholder="Enter task title..."
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={handleInputChange('priority')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={handleInputChange('status')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>

        <CustomInput
          label="Assignee"
          value={formData.assignee}
          onChange={handleInputChange('assignee')}
          error={errors.assignee}
          placeholder="Enter assignee name..."
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : task ? 'Update' : 'Create'} Task
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

);
};

export default TaskForm;

// ==============================================
// src/components/task/TaskFilters.jsx
// ==============================================

import React, { useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { TaskStatus, SortBy } from '../../types';

const TaskFilters = ({
filter,
sortBy,
searchTerm,
onFilterChange,
onSortChange,
onSearchChange,
isPending = false
}) => {
const handleSearchChange = useCallback((e) => {
onSearchChange(e.target.value);
}, [onSearchChange]);

return (

<div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg mb-6">
<div className="flex-1 min-w-64">
<div className="relative">
<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
<input
type="text"
placeholder="Search tasks..."
value={searchTerm}
onChange={handleSearchChange}
className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-opacity ${
              isPending ? 'opacity-50' : ''
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
        <option value={SortBy.CREATED_AT}>Sort by Date</option>
        <option value={SortBy.PRIORITY}>Sort by Priority</option>
        <option value={SortBy.TITLE}>Sort by Title</option>
      </select>
    </div>

);
};

export default TaskFilters;

// ==============================================
// src/components/task/TaskGrid.jsx
// ==============================================

import React from 'react';
import TaskCard from './TaskCard';

const TaskGrid = ({
tasks,
onUpdate,
onDelete,
selectedTasks = new Set(),
onTaskSelect
}) => {
if (tasks.length === 0) {
return (

<div className="text-center py-12">
<div className="text-gray-400 text-xl mb-4">No tasks found</div>
<p className="text-gray-600">Create your first task to get started!</p>
</div>
);
}

return (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{tasks.map(task => (
<TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isSelected={selectedTasks.has(task.id)}
          onSelect={onTaskSelect}
        />
))}
</div>
);
};

export default TaskGrid;

// ==============================================
// src/components/task/TaskStats.jsx
// ==============================================

import React from 'react';
import { TaskStatus } from '../../types';

const TaskStats = ({ tasks }) => {
const totalTasks = tasks.length;
const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;

const stats = [
{
title: 'Total Tasks',
value: totalTasks,
color: 'text-blue-600',
bgColor: 'bg-blue-50'
},
{
title: 'Completed',
value: completedTasks,
color: 'text-green-600',
bgColor: 'bg-green-50'
},
{
title: 'In Progress',
value: inProgressTasks,
color: 'text-orange-600',
bgColor: 'bg-orange-50'
},
{
title: 'To Do',
value: todoTasks,
color: 'text-gray-600',
bgColor: 'bg-gray-50'
}
];

return (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
{stats.map((stat) => (
<div key={stat.title} className={`p-6 rounded-lg shadow-sm ${stat.bgColor}`}>
<h3 className="text-lg font-semibold mb-2 text-gray-800">
{stat.title}
</h3>
<p className={`text-3xl font-bold ${stat.color}`}>
{stat.value}
</p>
{totalTasks > 0 && (
<p className="text-sm text-gray-600 mt-1">
{Math.round((stat.value / totalTasks) \* 100)}%
</p>
)}
</div>
))}
</div>
);
};

export default TaskStats;

// ==============================================
// src/components/common/BulkActions.jsx
// ==============================================

import React from 'react';
import { TaskStatus } from '../../types';

const BulkActions = ({
selectedCount,
onBulkStatusUpdate,
onClearSelection
}) => {
if (selectedCount === 0) return null;

return (

<div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-6">
<span className="font-medium">
{selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
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

// ==============================================
// src/components/layout/Header.jsx
// ==============================================

import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({
onCreateTask,
onToggleAnalytics,
showAnalytics
}) => {
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
          {showAnalytics ? 'Hide' : 'Show'} Analytics
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

// ==============================================
// src/components/layout/Layout.jsx
// ==============================================

import React from 'react';
import ErrorBoundary from '../common/ErrorBoundary';

const Layout = ({ children }) => {
return (
<ErrorBoundary>

<div className="min-h-screen bg-gray-100">
<div className="container mx-auto px-4 py-8">
{children}
</div>
</div>
</ErrorBoundary>
);
};

export default Layout;

// ==============================================
// src/components/task/Analytics.jsx
// ==============================================

import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

const AnalyticsContent = lazy(() =>
new Promise(resolve =>
setTimeout(() => resolve({
default: ({ tasks }) => {
const completedTasks = tasks.filter(t => t.status === 'completed').length;
const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
const todoTasks = tasks.filter(t => t.status === 'todo').length;

        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-4">Analytics Dashboard</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{completedTasks}</div>
                <div className="text-sm opacity-80">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{inProgressTasks}</div>
                <div className="text-sm opacity-80">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{todoTasks}</div>
                <div className="text-sm opacity-80">Pending</div>
              </div>
            </div>
          </div>
        );
      }
    }), 2000)

)
);

const Analytics = ({ tasks }) => {
return (
<Suspense fallback={

<div className="bg-gray-200 animate-pulse p-6 rounded-lg flex items-center justify-center">
<LoadingSpinner size="lg" />
<span className="ml-2 text-gray-600">Loading Analytics...</span>
</div>
}>
<AnalyticsContent tasks={tasks} />
</Suspense>
);
};

export default Analytics;

// ==============================================
// src/pages/TaskDashboard.jsx
// ==============================================

import React, {
useState,
useMemo,
useCallback,
useTransition,
useDeferredValue
} from 'react';

// Components
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import TaskFilters from '../components/task/TaskFilters';
import TaskGrid from '../components/task/TaskGrid';
import TaskForm from '../components/task/TaskForm';
import TaskStats from '../components/task/TaskStats';
import BulkActions from '../components/common/BulkActions';
import Analytics from '../components/task/Analytics';
import Modal from '../components/ui/Modal';

// Hooks
import { useTaskManager } from '../hooks/useTaskManager';
import { useDebounce } from '../hooks/useDebounce';

// Utils
import { filterTasks, sortTasks } from '../utils/helpers';
import { TASK_ACTIONS } from '../reducers/taskReducer';

const TaskDashboard = () => {
const { state, dispatch } = useTaskManager();
const [showForm, setShowForm] = useState(false);
const [editingTask, setEditingTask] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
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
const handleCreateTask = useCallback((taskData) => {
dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: taskData });
setShowForm(false);
}, [dispatch]);

const handleUpdateTask = useCallback((taskData) => {
dispatch({
type: TASK_ACTIONS.UPDATE_TASK,
payload: { ...editingTask, ...taskData }
});
setEditingTask(null);
setShowForm(false);
}, [dispatch, editingTask]);

const handleDeleteTask = useCallback((taskId) => {
if (window.confirm('Are you sure you want to delete this task?')) {
dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId });
setSelectedTasks(prev => {
const newSet = new Set(prev);
newSet.delete(taskId);
return newSet;
});
}
}, [dispatch]);

const handleBulkStatusUpdate = useCallback((status) => {
dispatch({
type: TASK_ACTIONS.BULK_UPDATE,
payload: {
ids: Array.from(selectedTasks),
updates: { status }
}
});
setSelectedTasks(new Set());
}, [dispatch, selectedTasks]);

const handleTaskSelect = useCallback((taskId, isSelected) => {
setSelectedTasks(prev => {
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
{/_ Header _/}

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
        onFilterChange={(filter) => dispatch({ type: TASK_ACTIONS.SET_FILTER, payload: filter })}
        onSortChange={(sortBy) => dispatch({ type: TASK_ACTIONS.SET_SORT, payload: sortBy })}
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

// ==============================================
// src/App.jsx
// ==============================================

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import TaskDashboard from './pages/TaskDashboard';

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
