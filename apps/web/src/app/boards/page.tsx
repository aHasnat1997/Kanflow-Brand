"use client";

import { useState } from "react";
import { Plus, Loader2, Link as LinkIcon, ArrowRight } from "lucide-react";
import { useBoards } from "@/hooks/use-boards";
import { BoardCard } from "@/components/boards/board-card";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { joinViaToken } from "@/lib/api/boards";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function BoardsPage() {
  const { boards, isLoading, error, refresh } = useBoards();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinLink) return;

    setIsJoining(true);
    try {
      // Extract token from link or assume it's the token itself
      const token = joinLink.split("/join/").pop() || joinLink;
      const res = await joinViaToken(token);
      toast.success("Joined board successfully");
      router.push(`/boards/${res.boardId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to join board");
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4f46e5] animate-spin" suppressHydrationWarning />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  const myBoards = boards.filter((b) => b.ownerId === user?.id);
  const sharedBoards = boards.filter((b) => b.ownerId !== user?.id);

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1c2f]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your Boards
          </h1>
          <p className="text-sm text-[#464555] mt-1">
            Manage your personal and shared workspaces.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
          <form onSubmit={handleJoin} className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <LinkIcon className="w-4 h-4 text-[#777587] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Paste invite link or token"
                className="pl-9 w-full sm:w-64 h-10 text-black"
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isJoining || !joinLink}
              className="h-10 px-4 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0d1c2f] text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span className="hidden sm:inline">Join</span>
            </button>
          </form>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-10 px-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create board
          </button>
        </div>
      </div>

      <Tabs defaultValue="my-boards" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="my-boards">My Boards ({myBoards.length})</TabsTrigger>
          <TabsTrigger value="shared-boards">Shared with me ({sharedBoards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-boards">
          {myBoards.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-[#c7c4d8] p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-[#eff4ff] rounded-full flex items-center justify-center text-[#4f46e5] mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-[#0d1c2f] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No personal boards yet
              </h2>
              <p className="text-sm text-[#464555] max-w-md mx-auto mb-6">
                Create your first board to start organising tasks.
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="h-10 px-4 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0d1c2f] text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                Create a board
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared-boards">
          {sharedBoards.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-[#c7c4d8] p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-[#eff4ff] rounded-full flex items-center justify-center text-[#4f46e5] mb-4">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-[#0d1c2f] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No shared boards
              </h2>
              <p className="text-sm text-[#464555] max-w-md mx-auto">
                When someone shares a board with you, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sharedBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateBoardDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
}
