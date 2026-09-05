"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Trash2 } from "lucide-react";
import type { ColumnWithTasks, Task } from "@Kanflow-Brand/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "./task-card";

interface BoardColumnProps {
  column: ColumnWithTasks;
  onAddTask: (columnId: string, title: string, description?: string) => Promise<void>;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

/**
 * A sortable Kanban column containing sortable task cards.
 * Styled to match the Stitch Kanflow design: navy container, light board track.
 */
export function BoardColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
}: BoardColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    setNodeRef,
    isOver,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTask(column.id, newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAddingTask(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskIds = column.tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex flex-col max-h-full w-[300px] min-w-[300px] rounded-xl border transition-all duration-150
        ${isOver
          ? "border-[#6366f1] bg-[#eef2ff]"
          : "border-[#e2e8f0] bg-[#f1f5f9]"
        }
      `}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-[#0d1c2f]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {column.name}
          </h3>
          <span className="text-xs font-medium text-[#777587] bg-white border border-[#e2e8f0] rounded-full px-2 py-0.5">
            {column.tasks.length}
          </span>
        </div>
        {onDeleteColumn && (
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="p-1 rounded text-[#c7c4d8] hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete column"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {/* Task list */}
      <ScrollArea className="flex-1 min-h-0 p-3">
        <div ref={setNodeRef} className="space-y-2 min-h-[48px] pb-4">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>

          {column.tasks.length === 0 && !isOver && (
            <div className="h-12 rounded-lg border-2 border-dashed border-[#c7c4d8] flex items-center justify-center">
              <p className="text-xs text-[#777587]">Drop tasks here</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add task section */}
      <div className="p-3 pt-0">
        {isAddingTask ? (
          <form onSubmit={handleAddTask} className="space-y-2">
            <input
              autoFocus
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-white text-sm text-[#0d1c2f] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || !newTaskTitle.trim()}
                className="flex-1 h-8 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Add task
              </button>
              <button
                type="button"
                onClick={() => { setIsAddingTask(false); setNewTaskTitle(""); }}
                className="h-8 px-3 rounded-lg border border-[#c7c4d8] text-xs text-[#464555] hover:bg-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full h-8 flex items-center gap-1.5 px-2 rounded-lg text-xs text-[#777587] hover:text-[#4f46e5] hover:bg-white border border-transparent hover:border-[#e2e8f0] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}
