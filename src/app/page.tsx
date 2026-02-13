"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "대시보드", href: "/" },
  { label: "컨트롤", href: "/controls" },
  { label: "태스크", href: "/tasks" },
  { label: "문서", href: "/documents" },
  { label: "설정", href: "/settings" },
];

function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-6">
        <span className="text-lg font-bold gradient-text">ISO Compliance Hub</span>
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

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  showBeam?: boolean;
}

function StatCard({ title, value, suffix, prefix, description, showBeam }: StatCardProps) {
  return (
    <MagicCard
      className="relative overflow-hidden rounded-xl"
      gradientFrom="#8b5cf6"
      gradientTo="#5e5ce6"
      gradientColor="#1c1c1f"
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="pb-2">
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-lg text-muted-foreground">{prefix}</span>}
            <NumberTicker
              value={value}
              className="text-4xl font-bold text-foreground"
            />
            {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
          </div>
          {description && (
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>
      {showBeam && (
        <BorderBeam
          size={100}
          duration={8}
          colorFrom="#8b5cf6"
          colorTo="#5e5ce6"
          borderWidth={2}
        />
      )}
    </MagicCard>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-sm">
          <div>
            <h1 className="text-lg font-semibold text-foreground">대시보드</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">내부 사용자</span>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Page Description */}
          <p className="mb-8 text-muted-foreground">
            ISO 27001 컴플라이언스 현황을 확인하세요
          </p>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="관리 중인 컨트롤"
              value={114}
              suffix="개"
              showBeam
            />
            <StatCard
              title="완료된 태스크"
              value={0}
              suffix="%"
            />
            <StatCard
              title="업로드된 증빙"
              value={0}
              suffix="건"
            />
            <StatCard
              title="다음 마감일"
              value={0}
              prefix="D-"
            />
          </div>

          {/* Main Cards */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Controls Progress */}
            <MagicCard
              className="rounded-xl"
              gradientFrom="#8b5cf6"
              gradientTo="#5e5ce6"
              gradientColor="#1c1c1f"
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle>컨트롤 체크리스트</CardTitle>
                  <CardDescription>
                    114개 Annex A 컨트롤의 진행 상황
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">0/114</span>
                    <span className="text-sm text-muted-foreground">완료됨</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <Button variant="outline" className="w-full">
                    컨트롤 관리하기
                  </Button>
                </CardContent>
              </Card>
            </MagicCard>

            {/* Tasks */}
            <MagicCard
              className="rounded-xl"
              gradientFrom="#8b5cf6"
              gradientTo="#5e5ce6"
              gradientColor="#1c1c1f"
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle>진행 중인 태스크</CardTitle>
                  <CardDescription>
                    할당된 태스크를 확인하고 완료하세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                      진행 중인 태스크가 없습니다
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    태스크 보기
                  </Button>
                </CardContent>
              </Card>
            </MagicCard>

            {/* Recent Uploads */}
            <MagicCard
              className="rounded-xl"
              gradientFrom="#8b5cf6"
              gradientTo="#5e5ce6"
              gradientColor="#1c1c1f"
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle>최근 업로드</CardTitle>
                  <CardDescription>
                    증빙 문서 업로드 현황
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                      업로드된 문서가 없습니다
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    문서 업로드
                  </Button>
                </CardContent>
              </Card>
            </MagicCard>
          </div>

          {/* Upcoming Deadlines */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">다가오는 마감일</h2>
            <Card>
              <CardContent className="flex min-h-[100px] items-center justify-center py-8">
                <p className="text-muted-foreground">예정된 마감일이 없습니다</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
