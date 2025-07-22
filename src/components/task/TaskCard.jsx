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
});
