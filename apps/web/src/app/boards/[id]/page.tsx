"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, Share2, Lock, UserPlus } from "lucide-react";
import { useBoard } from "@/hooks/use-board";
import { useSocket } from "@/hooks/use-socket";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { ShareBoardDialog } from "@/components/boards/share-board-dialog";
import { HistoryDrawer } from "@/components/boards/history-drawer";
import { TaskDetailModal } from "@/components/kanban/task-detail-modal";
import { createColumn } from "@/lib/api/columns";
import { createTask, updateTask, deleteTask } from "@/lib/api/tasks";
import { useAuth } from "@/hooks/use-auth";
import { requestEditAccess, getAccessRequests, updateAccessRequest } from "@/lib/api/boards";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@Kanflow-Brand/types";

export default function BoardDetailPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { user } = useAuth();

  const { board, isLoading, error, moveTask, moveColumn, refresh } = useBoard(boardId);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const membership = board?.members.find((m) => m.userId === user?.id);
  const role = membership?.role;

  // Connect to websocket and refresh board data on activity
  useSocket(boardId, () => {
    refresh();
    if (role === "OWNER") {
      getAccessRequests(boardId).then(setAccessRequests).catch(console.error);
    }
  });

  useEffect(() => {
    if (role === "OWNER") {
      getAccessRequests(boardId).then(setAccessRequests).catch(console.error);
    }
  }, [role, boardId]);

  const handleAddColumn = async (name: string) => {
    if (role === "VIEWER") {
      toast.error("You only have view access to this board");
      return;
    }
    await createColumn(boardId, name);
  };

  const handleAddTask = async (columnId: string, title: string, description?: string) => {
    if (role === "VIEWER") {
      toast.error("You only have view access to this board");
      return;
    }
    await createTask(columnId, title, description);
  };

  const handleUpdateTask = async (taskId: string, data: { title: string; description?: string }) => {
    await updateTask(taskId, data);
    refresh();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    refresh();
  };

  const handleRequestAccess = async () => {
    setIsRequesting(true);
    try {
      await requestEditAccess(boardId);
      toast.success("Edit access requested successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to request access");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleApproveRequest = async (reqId: string) => {
    try {
      await updateAccessRequest(boardId, reqId, "APPROVED");
      toast.success("Access request approved");
      setAccessRequests((prev) => prev.filter((r) => r.id !== reqId));
      refresh();
    } catch (err: any) {
      toast.error("Failed to approve request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4f46e5] animate-spin" suppressHydrationWarning />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100">
          {error || "Board not found"}
        </div>
      </div>
    );
  }

  const pendingRequests = accessRequests.filter((r) => r.status === "PENDING");

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Board header */}
      <div className="shrink-0 min-h-16 py-3 px-4 sm:px-6 border-b border-[#e2e8f0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0d1c2f]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {board.name}
            </h1>
            {role === "VIEWER" && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 shrink-0">
                View Only
              </span>
            )}
          </div>
          <p className="text-xs text-[#777587] mt-0.5">
            {board.columns.length} columns • {board.columns.reduce((sum, col) => sum + col.tasks.length, 0)} tasks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
          <div className="flex items-center -space-x-2 shrink-0">
            {board.members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full bg-[#f8fafc] border-2 border-white flex items-center justify-center text-xs font-medium text-[#464555]"
                title={`${member.user?.name} (${member.role})`}
              >
                {member.user?.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {board.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-[#f1f5f9] border-2 border-white flex items-center justify-center text-xs font-medium text-[#777587]">
                +{board.members.length - 3}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-[#e2e8f0]"></div>

          {role === "VIEWER" && (
            <button
              onClick={handleRequestAccess}
              disabled={isRequesting}
              className="h-9 px-3 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0d1c2f] text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isRequesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 text-[#64748b]" />}
              Request Edit Access
            </button>
          )}

          {role === "OWNER" && pendingRequests.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="h-9 px-3 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                    <UserPlus className="w-4 h-4" />
                    Requests ({pendingRequests.length})
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Access Requests</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {pendingRequests.map((req) => (
                    <DropdownMenuItem key={req.id} className="flex flex-col items-start gap-2 p-3 cursor-default focus:bg-transparent">
                      <div className="text-sm font-medium">{req.user?.name}</div>
                      <div className="text-xs text-slate-500">{req.user?.email}</div>
                      <div className="flex gap-2 w-full mt-2">
                        <button
                          onClick={() => handleApproveRequest(req.id)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <HistoryDrawer boardId={boardId} />

          {(role === "OWNER" || role === "MEMBER") && (
            <button
              onClick={() => setIsShareOpen(true)}
              className="h-9 px-3 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0d1c2f] text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#64748b]" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Board canvas */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <KanbanBoard
          columns={board.columns}
          onMoveTask={moveTask}
          onMoveColumn={moveColumn}
          onAddTask={handleAddTask}
          onAddColumn={handleAddColumn}
          onEditTask={role !== "VIEWER" ? setSelectedTask : undefined}
          onDeleteTask={role !== "VIEWER" ? handleDeleteTask : undefined}
        />
      </div>

      <ShareBoardDialog
        boardId={boardId}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
