import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { History, X, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getBoardActivity } from "@/lib/api/boards";
import { useSocket } from "@/hooks/use-socket";

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: any;
  createdAt: string;
  user: {
    name: string;
    email: string;
  } | null;
}

interface HistoryDrawerProps {
  boardId: string;
}

export function HistoryDrawer({ boardId }: HistoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const data = await getBoardActivity(boardId);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [isOpen, boardId]);

  useSocket(boardId, () => {
    if (isOpen) {
      fetchLogs();
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="h-9 px-3 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0d1c2f] text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <History className="w-4 h-4 text-[#64748b]" />
          History
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 !bg-white !text-[#0d1c2f]">
        <SheetHeader className="p-6 border-b border-[#e2e8f0]">
          <SheetTitle className="text-xl font-bold font-plus-jakarta flex items-center gap-2">
            <History className="w-5 h-5 text-[#4f46e5]" />
            Board History
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#4f46e5]" />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-[#777587] text-center mt-4">
              No activity recorded yet.
            </p>
          ) : (
            <div className="relative border-l border-[#e2e8f0] ml-3 space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#4f46e5]" />
                  
                  <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-sm text-[#0d1c2f]">
                        <span className="font-semibold">{log.user?.name || "Someone"}</span>
                        {" "}
                        {log.action}
                        {log.details?.title && (
                          <span className="font-medium text-[#4f46e5]">
                            {" "}
                            "{log.details.title}"
                          </span>
                        )}
                        {log.details?.name && (
                          <span className="font-medium text-[#4f46e5]">
                            {" "}
                            "{log.details.name}"
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#777587] whitespace-nowrap">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
