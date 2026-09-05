"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface CreateColumnFormProps {
  onAdd: (name: string) => Promise<void>;
}

export function CreateColumnForm({ onAdd }: CreateColumnFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(name.trim());
      setName("");
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center justify-center gap-2 w-[300px] min-w-[300px] h-[48px] rounded-xl border-2 border-dashed border-[#c7c4d8] text-[#777587] hover:border-[#6366f1] hover:text-[#6366f1] hover:bg-[#eef2ff] transition-all bg-white"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add new column</span>
      </button>
    );
  }

  return (
    <div className="w-[300px] min-w-[300px] bg-[#f1f5f9] rounded-xl border border-[#e2e8f0] p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          autoFocus
          type="text"
          placeholder="Column name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-[#c7c4d8] bg-white text-sm text-[#0d1c2f] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="flex-1 h-9 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Add column
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setName(""); }}
            className="h-9 px-4 rounded-lg border border-[#c7c4d8] text-sm text-[#464555] hover:bg-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
