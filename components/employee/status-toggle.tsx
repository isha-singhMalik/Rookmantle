"use client";

import { useTransition } from "react";
import { updateEmployeeStatus } from "@/lib/actions";
import { EmployeeStatus } from "@/lib/types";
import { Button } from "@/components/ui/primitives";
import { Pause, Play } from "lucide-react";

export function StatusToggle({ employeeId, status }: { employeeId: string; status: EmployeeStatus }) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next: EmployeeStatus = status === "active" ? "paused" : "active";
    startTransition(() => updateEmployeeStatus(employeeId, next));
  }

  return (
    <Button variant="secondary" onClick={toggle} disabled={isPending}>
      {status === "active" ? <Pause size={14} /> : <Play size={14} />}
      {status === "active" ? "Pause employee" : "Resume employee"}
    </Button>
  );
}
