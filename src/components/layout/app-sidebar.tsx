"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "대시보드", href: "/" },
  { label: "컨트롤", href: "/controls" },
  { label: "태스크", href: "/tasks" },
  { label: "문서", href: "/documents" },
  { label: "설정", href: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-6">
        <Link href="/" className="text-lg font-bold gradient-text">
          ISO Compliance Hub
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-xs text-muted-foreground">ISO 27001:2022</p>
          <p className="text-sm font-medium text-foreground">내부 사용</p>
        </div>
      </div>
    </aside>
  );
}
