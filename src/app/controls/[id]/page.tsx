"use client";

import { useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { annexAControls, type AnnexAControl, type ControlStatus } from "@/data/annex-a-controls";
import { managementClauses, type ManagementClause } from "@/data/management-system";
import type { Task } from "@/data/tasks";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

const statusConfig: Record<ControlStatus, { label: string; color: string }> = {
  not_started: { label: "시작 전", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "진행 중", color: "bg-blue-500/20 text-blue-400" },
  completed: { label: "완료", color: "bg-green-500/20 text-green-400" },
  not_applicable: { label: "해당없음", color: "bg-zinc-500/20 text-zinc-400" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function ControlDetailPage() {
  const params = useParams();
  const router = useRouter();
  const controlId = decodeURIComponent(params.id as string);

  const [status, setStatus] = useState<ControlStatus>("not_started");
  const [progress] = useState(0);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find the control or clause
  const item = useMemo(() => {
    // First check Annex A controls
    const annexControl = annexAControls.find((c) => c.id === controlId);
    if (annexControl) return { ...annexControl, type: "annex-a" as const };

    // Then check management clauses
    const clause = managementClauses.find((c) => c.id === controlId);
    if (clause) return { ...clause, type: "clause" as const };

    return null;
  }, [controlId]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <main className="ml-64 h-screen flex flex-col">
          <AppHeader title="컨트롤" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">컨트롤을 찾을 수 없습니다</p>
              <Button variant="outline" onClick={() => router.push("/controls")}>
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tip = (item as AnnexAControl & { tip?: string }).tip || (item as ManagementClause).tip;
  const evidence = (item as AnnexAControl & { evidence?: string }).evidence || (item as ManagementClause).evidence;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${item.id}-${Date.now()}`,
        title: newTaskTitle.trim(),
        status: "todo",
        priority: "medium",
        controlId: item.id,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        id: `${item.id}-${Date.now()}-${index}`,
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
      <AppSidebar />

      <main className="ml-64 h-screen flex flex-col">
        <AppHeader title="컨트롤 상세" />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-8 space-y-8">
            {/* Back Button & Header */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/controls")}
                className="-ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                목록으로
              </Button>

              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">{item.id}</p>
                <h1 className="text-3xl font-bold">{item.titleKo}</h1>
              </div>
            </div>

            {/* Progress */}
            {status === "in_progress" && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">진행률</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <Separator />
              </>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">설명</h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.descriptionKo}
              </p>
            </div>

            <Separator />

            {/* Tip */}
            {tip && (
              <>
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">따라하기</h2>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-6">
                    <div className="space-y-3 text-foreground">
                      {tip.split('\n').map((line, index) => {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) return null;

                        const isMainStep = /^\d+\./.test(trimmedLine);
                        const isSubItem = /^[-•]/.test(trimmedLine) || trimmedLine.startsWith('   -');

                        return (
                          <p
                            key={index}
                            className={cn(
                              "leading-relaxed",
                              isMainStep && "font-medium",
                              isSubItem && "pl-4 text-muted-foreground"
                            )}
                          >
                            {trimmedLine}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Evidence */}
            {evidence && (
              <>
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">필요 증빙</h2>
                  <div className="rounded-lg bg-muted/50 p-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {evidence}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Category */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">카테고리</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {item.type === "annex-a"
                    ? (item as AnnexAControl).category
                    : `Clause ${(item as ManagementClause).clause}`}
                </Badge>
                <span className="text-muted-foreground">
                  {item.categoryKo}
                </span>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">상태 변경</h2>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(statusConfig) as ControlStatus[]).map((s) => (
                  <Button
                    key={s}
                    variant={status === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus(s)}
                  >
                    {statusConfig[s].label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Evidence Upload */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">증빙 자료</h2>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.uploadedAt}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileDelete(file.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={handleFileSelect}
              >
                <div className="text-center">
                  <p className="text-muted-foreground">
                    {uploadedFiles.length === 0
                      ? "업로드된 증빙 자료가 없습니다"
                      : "추가 파일 업로드"}
                  </p>
                  <Button variant="link" size="sm" className="mt-1">
                    파일 선택
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <Separator />

            {/* Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">관련 태스크</h2>
                {!isAddingTask && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingTask(true)}
                  >
                    태스크 추가
                  </Button>
                )}
              </div>

              {isAddingTask && (
                <div className="flex gap-2">
                  <Input
                    placeholder="태스크 제목 입력..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTask();
                      if (e.key === "Escape") {
                        setIsAddingTask(false);
                        setNewTaskTitle("");
                      }
                    }}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                    추가
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTaskTitle("");
                    }}
                  >
                    취소
                  </Button>
                </div>
              )}

              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{task.title}</p>
                        {task.assignee && (
                          <p className="text-sm text-muted-foreground">{task.assignee}</p>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "shrink-0 ml-2",
                          task.status === "completed" && "bg-green-500/20 text-green-400",
                          task.status === "in_progress" && "bg-blue-500/20 text-blue-400",
                          task.status === "todo" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {task.status === "completed" ? "완료" : task.status === "in_progress" ? "진행 중" : "할 일"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                !isAddingTask && (
                  <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-muted-foreground">연결된 태스크가 없습니다</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
