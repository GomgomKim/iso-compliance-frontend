"use client";

interface AppHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AppHeader({ title, description, actions }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-8">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <span className="text-sm text-muted-foreground">내부 사용자</span>
        </div>
      </div>
      {description && (
        <div className="px-8 pb-4">
          <p className="text-muted-foreground">{description}</p>
        </div>
      )}
    </header>
  );
}
