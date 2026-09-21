import { db } from "@/lib/store";
import { LinkButton } from "@/components/ui/primitives";
import { Plus } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex items-center justify-between h-16 px-5 md:px-8 border-b border-line bg-paper">
      <div>
        <p className="text-xs text-ink-soft">Business</p>
        <p className="font-medium text-sm text-ink">{db.business.name}</p>
      </div>
      <LinkButton href="/employees/new" variant="primary" className="text-sm">
        <Plus size={15} />
        Deploy AI employee
      </LinkButton>
    </header>
  );
}
