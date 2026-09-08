"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  at?: string;
};

type TimelineItem = {
  id: string;
  label: string;
  done: boolean;
  at: string;
  by: string | null;
};

export function TakedownPanel({
  threatId,
  status,
  checklist,
  timeline,
}: {
  threatId: string;
  status: string;
  checklist: ChecklistItem[];
  timeline: TimelineItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(checklist);
  const [steps, setSteps] = useState(timeline);
  const [localStatus, setLocalStatus] = useState(status);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function launch() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/threats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: threatId, action: "launch_takedown" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Takedown failed");
        return;
      }
      setItems(data.threat.evidence.checklist);
      setSteps(data.threat.evidence.timeline);
      setLocalStatus(data.threat.status);
      setMessage(data.message);
      router.refresh();
    });
  }

  function toggle(checklistId: string) {
    startTransition(async () => {
      const res = await fetch("/api/threats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: threatId,
          action: "toggle_checklist",
          checklistId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
      setItems(data.threat.evidence.checklist);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {message ? <Alert variant="success">{message}</Alert> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <div className="space-y-3">
        {items.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.id)}
            disabled={pending}
            className="flex w-full items-start gap-3 rounded-lg border border-[var(--rd-line)] p-3 text-left hover:bg-[var(--rd-mist)]"
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                c.done
                  ? "border-[var(--rd-forest)] bg-[var(--rd-forest)] text-white"
                  : "border-[var(--rd-line)]",
              )}
            >
              {c.done ? "✓" : ""}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{c.label}</span>
              {c.at ? (
                <span className="text-xs text-[var(--rd-muted)]">{c.at}</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Button className="w-full" onClick={launch} disabled={pending}>
          {localStatus === "in_progress" ? "Takedown in progress" : "Launch takedown"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            setMessage("Demo export queued — evidence PDF would download here.")
          }
        >
          <FileDown className="h-4 w-4" />
          Export evidence PDF
        </Button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-[var(--rd-ink)]">
          Status timeline
        </h3>
        <ol className="space-y-4 border-l-2 border-[var(--rd-line)] pl-4">
          {steps.map((s) => (
            <li key={s.id} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full",
                  s.done ? "bg-[var(--rd-forest)]" : "bg-[var(--rd-line)]",
                )}
              />
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-[var(--rd-muted)]">
                {s.at}
                {s.by ? ` · ${s.by}` : ""}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
