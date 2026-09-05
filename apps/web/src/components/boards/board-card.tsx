"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Users, Clock } from "lucide-react";
import type { BoardWithMembers } from "@Kanflow-Brand/types";

interface BoardCardProps {
  board: BoardWithMembers;
}

/**
 * Card displaying board summary information on the dashboard.
 * Styled with Stitch tokens: crisp borders, level 1 elevation on hover.
 */
export function BoardCard({ board }: BoardCardProps) {
  const memberCount = board.members.length;

  return (
    <Link href={`/boards/${board.id}`}>
      <div className="group bg-white rounded-xl border border-[#e2e8f0] p-5 h-full hover:border-[#cbd5e1] hover:shadow-md transition-all duration-200">
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2 group-hover:text-[#4f46e5] transition-colors line-clamp-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {board.name}
        </h3>
        
        <div className="flex items-center gap-4 mt-6 text-sm text-[#64748b]">
          <div className="flex items-center gap-1.5" title={`${memberCount} member${memberCount !== 1 ? 's' : ''}`}>
            <Users className="w-4 h-4" />
            <span>{memberCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#94a3b8]" title={`Created ${new Date(board.createdAt).toLocaleDateString()}`}>
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(new Date(board.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
