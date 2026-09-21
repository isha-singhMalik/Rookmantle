"use client";

import { useState, useTransition } from "react";
import { addKnowledgeItem } from "@/lib/actions";
import { KnowledgeItem } from "@/lib/types";
import { Button, EmptyState } from "@/components/ui/primitives";
import { Plus, FileText } from "lucide-react";

export function KnowledgePanel({ employeeId, items }: { employeeId: string; items: KnowledgeItem[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!content.trim()) return;
    startTransition(async () => {
      await addKnowledgeItem(employeeId, title, content);
      setTitle("");
      setContent("");
      setOpen(false);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-ink">Knowledge base</h2>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-xs font-medium text-graphite inline-flex items-center gap-1"
        >
          <Plus size={13} /> Add knowledge
        </button>
      </div>

      {open && (
        <div className="mb-4 rounded-md border border-line p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full rounded-md border border-line px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-graphite"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Add a policy, script, or fact this employee should know."
            className="w-full rounded-md border border-line px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-graphite"
          />
          <Button onClick={submit} disabled={isPending} className="text-xs">
            Save note
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState title="No knowledge added yet" detail="Add documents, notes, or policies so this employee has the context it needs." />
      ) : (
        <div className="flex flex-col divide-y divide-line-soft">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex gap-3">
              <FileText size={16} className="text-ink-soft mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="text-sm text-ink-soft mt-0.5 line-clamp-2">{item.content}</p>
                <p className="text-[11px] font-mono text-ink-soft mt-1">
                  {item.type} · added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
