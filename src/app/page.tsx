"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { companyProfiles, type CompanySize } from "@/data/company-profiles";
import { sampleTasks } from "@/data/tasks";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  controlId?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  showBeam?: boolean;
  href?: string;
  onClick?: () => void;
}

function StatCard({ title, value, suffix, prefix, description, showBeam, href, onClick }: StatCardProps) {
  const content = (
    <MagicCard
      className="relative overflow-hidden rounded-xl cursor-pointer transition-transform hover:scale-[1.02]"
      gradientFrom="#8b5cf6"
      gradientTo="#5e5ce6"
      gradientColor="#1c1c1f"
      onClick={onClick}
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

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DashboardPage() {
  const [companySize] = useState<CompanySize>("startup");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = companyProfiles[companySize];
  const totalControls = profile.annexAControls.length + profile.managementClauses.length;

  // Calculate task stats
  const completedTasks = sampleTasks.filter((t) => t.status === "completed").length;
  const totalTasks = sampleTasks.length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Find next deadline
  const upcomingTasks = sampleTasks
    .filter((t) => t.dueDate && t.status !== "completed")
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  const nextDeadline = upcomingTasks[0];
  const daysUntilDeadline = nextDeadline?.dueDate
    ? Math.max(0, Math.ceil((new Date(nextDeadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleDateString("ko-KR"),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileDelete = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <AppHeader
          title="대시보드"
          description="ISO 27001 컴플라이언스 현황을 확인하세요"
        />

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="관리 중인 항목"
              value={totalControls}
              suffix="개"
              showBeam
              href="/controls"
            />
            <StatCard
              title="완료된 태스크"
              value={taskPercentage}
              suffix="%"
              href="/tasks"
            />
            <StatCard
              title="업로드된 증빙"
              value={uploadedFiles.length}
              suffix="건"
              href="/documents"
            />
            <StatCard
              title="다음 마감일"
              value={daysUntilDeadline}
              prefix="D-"
              href="/tasks"
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
                    {totalControls}개 항목의 진행 상황
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">0/{totalControls}</span>
                    <span className="text-sm text-muted-foreground">완료됨</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <Link href="/controls">
                    <Button variant="outline" className="w-full">
                      컨트롤 관리하기
                    </Button>
                  </Link>
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
                  {sampleTasks.filter((t) => t.status === "in_progress").slice(0, 2).length > 0 ? (
                    <div className="space-y-2">
                      {sampleTasks
                        .filter((t) => t.status === "in_progress")
                        .slice(0, 2)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{task.title}</p>
                              {task.assignee && (
                                <p className="text-xs text-muted-foreground">{task.assignee}</p>
                              )}
                            </div>
                            <Badge variant="secondary" className="shrink-0 ml-2 bg-blue-500/20 text-blue-400">
                              진행 중
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">
                        진행 중인 태스크가 없습니다
                      </p>
                    </div>
                  )}
                  <Link href="/tasks">
                    <Button variant="outline" className="w-full">
                      태스크 보기
                    </Button>
                  </Link>
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
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-2 max-h-[120px] overflow-y-auto">
                      {uploadedFiles.slice(-3).map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} • {file.uploadedAt}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileDelete(file.id)}
                            className="text-xs text-muted-foreground hover:text-destructive shrink-0 ml-2 h-6 px-2"
                          >
                            삭제
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">
                        업로드된 문서가 없습니다
                      </p>
                    </div>
                  )}
                  <Button variant="outline" className="w-full" onClick={handleFileSelect}>
                    문서 업로드
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </CardContent>
              </Card>
            </MagicCard>
          </div>

          {/* Upcoming Deadlines */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">다가오는 마감일</h2>
            <Card>
              <CardContent className="py-4">
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTasks.slice(0, 5).map((task) => {
                      const daysLeft = Math.ceil(
                        (new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      const isOverdue = daysLeft < 0;
                      const isUrgent = daysLeft <= 3 && daysLeft >= 0;

                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.assignee} • {task.dueDate}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              isOverdue
                                ? "bg-red-500/20 text-red-400"
                                : isUrgent
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {isOverdue ? "마감일 지남" : `D-${daysLeft}`}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-[100px] items-center justify-center">
                    <p className="text-muted-foreground">예정된 마감일이 없습니다</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
