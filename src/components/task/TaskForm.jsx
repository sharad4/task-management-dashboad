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
};
