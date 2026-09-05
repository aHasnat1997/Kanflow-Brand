"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@Kanflow-Brand/types";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

/**
 * Draggable task card for the Kanban board.
 * Uses @dnd-kit/sortable for drag-and-drop behavior.
 * Styled with the Stitch Kanflow design system tokens.
 */
export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative bg-white rounded-lg border p-3 cursor-default select-none
        transition-all duration-150
        ${isDragging
          ? "border-[#6366f1] shadow-lg rotate-1 scale-[1.02]"
          : isHovered
            ? "border-[#c7c4d8] shadow-md"
            : "border-[#e2e8f0] shadow-sm"
        }
      `}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 flex-shrink-0 text-[#c7c4d8] hover:text-[#777587] cursor-grab active:cursor-grabbing transition-colors touch-none"
          aria-label="Drag task"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#0d1c2f] leading-snug break-words">
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 text-xs text-[#464555] leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Action buttons — visible on hover */}
        {isHovered && (
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="p-1 rounded text-[#777587] hover:text-[#4f46e5] hover:bg-[#eff4ff] transition-colors"
                aria-label="Edit task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 rounded text-[#777587] hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
