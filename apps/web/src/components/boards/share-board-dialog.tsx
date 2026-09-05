"use client";

import { useState, useEffect } from "react";
import { Loader2, Share2, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { shareBoard, getShareToken } from "@/lib/api/boards";
import { ApiClientError } from "@/lib/api/client";

interface ShareBoardDialogProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareBoardDialog({ boardId, isOpen, onClose }: ShareBoardDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingToken(true);
      getShareToken(boardId)
        .then((res) => setShareToken(res.token))
        .catch(() => toast.error("Failed to load share link"))
        .finally(() => setIsLoadingToken(false));
    } else {
      setShareToken(null);
      setEmail("");
      setIsCopied(false);
    }
  }, [isOpen, boardId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await shareBoard(boardId, email.trim());
      toast.success(res.message);
      setEmail("");
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Failed to share board";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareToken) return;
    const link = `${window.location.origin}/boards/join/${shareToken}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Share Board
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Share via link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareToken ? `${window.location.origin}/boards/join/${shareToken}` : "Loading..."}
                className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-600 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!shareToken}
                className="h-10 px-4 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Anyone with this link can view the board.
            </p>
          </div>

          <div className="relative flex items-center py-4 mb-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
              Or invite via email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="member-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="member-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <p className="mt-2 text-xs text-slate-500">
                They must already have a Kanflow account.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-all"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="h-10 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Invite
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
