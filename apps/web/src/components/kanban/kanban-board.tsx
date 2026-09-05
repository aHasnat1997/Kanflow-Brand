"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import type { ColumnWithTasks, Task } from "@Kanflow-Brand/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BoardColumn } from "./board-column";
import { CreateColumnForm } from "./create-column-form";
import { TaskCard } from "./task-card";

interface KanbanBoardProps {
  columns: ColumnWithTasks[];
  onMoveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => Promise<void>;
  onAddTask: (columnId: string, title: string, description?: string) => Promise<void>;
  onAddColumn: (name: string) => Promise<void>;
  onMoveColumn?: (columnId: string, targetIndex: number) => Promise<void>;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export function KanbanBoard({ columns, onMoveTask, onAddTask, onAddColumn, onMoveColumn, onEditTask, onDeleteTask, onDeleteColumn }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnWithTasks | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // 5px movement before dragging starts (allows clicks)
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task as Task);
    }
    if (active.data.current?.type === "column") {
      setActiveColumn(active.data.current.column as ColumnWithTasks);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional handling if needed
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    setActiveColumn(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isActiveColumn = active.data.current?.type === "column";

    // Handle Column Drag & Drop
    if (isActiveColumn && onMoveColumn) {
      const overIndex = columns.findIndex((c) => c.id === overId);
      if (overIndex !== -1) {
        await onMoveColumn(activeId, overIndex);
      }
      return;
    }

    const isOverTask = over.data.current?.type === "task";
    const isOverColumn = over.data.current?.type === "column";

    if (!isActiveTask) return;

    const activeTaskData = active.data.current?.task as Task;
    const sourceColumnId = activeTaskData.columnId;
    let targetColumnId = sourceColumnId;
    let targetIndex = -1;

    if (isOverTask) {
      const overTaskData = over.data.current?.task as Task;
      targetColumnId = overTaskData.columnId;

      const targetColumn = columns.find(c => c.id === targetColumnId);
      if (targetColumn) {
        const overTaskIndex = targetColumn.tasks.findIndex(t => t.id === overId);

        // Determine insertion index based on relative movement
        const activeIndex = targetColumn.tasks.findIndex(t => t.id === activeId);
        if (sourceColumnId === targetColumnId && activeIndex !== -1 && activeIndex < overTaskIndex) {
          targetIndex = overTaskIndex + 1;
        } else {
          targetIndex = overTaskIndex;
        }
      }
    } else if (isOverColumn) {
      targetColumnId = overId;
      const targetColumn = columns.find(c => c.id === targetColumnId);
      if (targetColumn) {
        targetIndex = targetColumn.tasks.length;
      }
    }

    if (targetIndex !== -1) {
      await onMoveTask(activeId, sourceColumnId, targetColumnId, targetIndex);
    }
  };

  const columnIds = columns.map((c) => c.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="h-full w-full">
        <div className="flex gap-6 h-full p-6 items-start min-w-max">
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onDeleteColumn={onDeleteColumn}
              />
            ))}
          </SortableContext>

          <div className="flex-shrink-0">
            <CreateColumnForm onAdd={onAddColumn} />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
        {activeColumn ? (
          <div className="opacity-80 scale-105 pointer-events-none">
            <BoardColumn column={activeColumn} onAddTask={onAddTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
