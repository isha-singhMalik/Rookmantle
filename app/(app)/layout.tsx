import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { MobileNav } from "@/components/mobile-nav";
import { db } from "@/lib/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav businessName={db.business.name} />
        <div className="hidden md:block">
          <Topbar />
        </div>
        {/* extra bottom padding on phones so content clears the tab bar */}
        <main className="flex-1 p-5 pb-28 md:p-8 md:pb-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
