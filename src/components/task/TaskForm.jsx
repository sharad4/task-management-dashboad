import React, { useState, useEffect, useRef } from "react";
import CustomInput from "../ui/CustomInput";
import { validateTaskForm } from "../../utils/helpers";
import { TaskStatus, TaskPriority } from "../../types";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    priority: task?.priority || TaskPriority.MEDIUM,
    status: task?.status || TaskStatus.TODO,
    assignee: task?.assignee || "",
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
          title: "",
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.TODO,
          assignee: "",
        });
      } catch (error) {
        console.error("Error submitting task:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">
        {task ? "Edit Task" : "Create New Task"}
      </h2>
      <form onSubmit={handleSubmit}>
        <CustomInput
          ref={titleRef}
          label="Task Title"
          value={formData.title}
          onChange={handleInputChange("title")}
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
              onChange={handleInputChange("priority")}
              className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={TaskPriority.LOW}>LOW</option>
              <option value={TaskPriority.MEDIUM}>MEDIUM</option>
              <option value={TaskPriority.HIGH}>HIGH</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};
