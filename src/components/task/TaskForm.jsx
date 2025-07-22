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
};
