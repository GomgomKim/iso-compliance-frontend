"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AnnexAControl, ControlStatus } from "@/data/annex-a-controls";
import type { ManagementClause } from "@/data/management-system";
import type { Task } from "@/data/tasks";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

interface ControlDetailSheetProps {
  control: AnnexAControl | null;
  clause?: ManagementClause | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: ControlStatus;
  progress?: number;
  onStatusChange?: (status: ControlStatus) => void;
  tasks?: Task[];
  onAddTask?: (title: string) => void;
  uploadedFiles?: UploadedFile[];
  onFileUpload?: (files: FileList) => void;
  onFileDelete?: (fileId: string) => void;
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

export function ControlDetailSheet({
  control,
  clause,
  open,
  onOpenChange,
  status = "not_started",
  progress = 0,
  onStatusChange,
  tasks = [],
  onAddTask,
  uploadedFiles = [],
  onFileUpload,
  onFileDelete,
}: ControlDetailSheetProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use clause data if provided, otherwise use control data
  const item: AnnexAControl | ManagementClause | null = clause || control;
  if (!item) return null;

  const handleAddTask = () => {
    if (newTaskTitle.trim() && onAddTask) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const router = useRouter();

  // Get tip and evidence from clause or control
  const tip = clause?.tip || (control as AnnexAControl & { tip?: string })?.tip;
  const evidence = clause?.evidence || (control as AnnexAControl & { evidence?: string })?.evidence;

  const handleFullView = () => {
    onOpenChange(false);
    router.push(`/controls/${encodeURIComponent(item.id)}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFullView}
          className="absolute right-12 top-4 h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-accent"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <div className="px-6 pt-6 pb-2">
          <SheetHeader className="space-y-1 text-left p-0 pr-16">
            <p className="text-sm font-medium text-primary">{item.id}</p>
            <SheetTitle className="text-xl leading-tight text-left p-0">
              {item.titleKo}
            </SheetTitle>
          </SheetHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
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
            <h3 className="text-sm font-semibold text-foreground">설명</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.descriptionKo}
            </p>
          </div>

          <Separator />

          {/* Key Summary / Tip - 핵심요약/따라하기 */}
          {tip && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">따라하기</h3>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <div className="space-y-3 text-sm text-foreground">
                    {tip.split('\n').map((line, index) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;

                      // Check if line starts with a number (e.g., "1.", "2.")
                      const isMainStep = /^\d+\./.test(trimmedLine);
                      // Check if line starts with dash or bullet
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

          {/* Evidence - 증빙 예시 */}
          {evidence && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">필요 증빙</h3>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evidence}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Category */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">카테고리</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {"category" in item ? (item as AnnexAControl).category : `Clause ${(item as ManagementClause).clause}`}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {item.categoryKo}
              </span>
            </div>
          </div>

          <Separator />

          {/* Status Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">상태 변경</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(statusConfig) as ControlStatus[]).map((s) => (
                <Button
                  key={s}
                  variant={status === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange?.(s)}
                >
                  {statusConfig[s].label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Evidence Upload Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">증빙 자료</h3>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadedAt}
                      </p>
                    </div>
                    {onFileDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFileDelete(file.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div
              className="flex min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={handleFileSelect}
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
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

          {/* Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">관련 태스크</h3>
              {!isAddingTask && onAddTask && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingTask(true)}
                >
                  태스크 추가
                </Button>
              )}
            </div>

            {/* Add Task Form */}
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

            {/* Task List */}
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => (
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
                <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">연결된 태스크가 없습니다</p>
                </div>
              )
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
