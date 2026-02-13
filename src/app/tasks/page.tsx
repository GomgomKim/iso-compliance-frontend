"use client";

import { useState, useMemo } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MagicCard } from "@/components/ui/magic-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  sampleTasks,
  taskStatusConfig,
  taskPriorityConfig,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from "@/data/tasks";
import { annexAControls } from "@/data/annex-a-controls";

type ViewMode = "list" | "board";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onStatusChange?: (status: TaskStatus) => void;
}

function TaskStatusBadge({ status, onStatusChange }: TaskStatusBadgeProps) {
  const statusInfo = taskStatusConfig[status];

  if (!onStatusChange) {
    return (
      <Badge variant="secondary" className={cn("shrink-0", statusInfo.color)}>
        {statusInfo.labelKo}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className={cn("shrink-0 cursor-pointer hover:opacity-80 transition-opacity", statusInfo.color)}
        >
          {statusInfo.labelKo}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(taskStatusConfig) as TaskStatus[]).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onStatusChange(s)}
            className={cn("cursor-pointer", status === s && "bg-accent")}
          >
            <span className={cn("mr-2 h-2 w-2 rounded-full", taskStatusConfig[s].color.split(" ")[0])} />
            {taskStatusConfig[s].labelKo}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const priorityInfo = taskPriorityConfig[priority];

  return (
    <Badge variant="outline" className={cn("shrink-0 text-xs", priorityInfo.color)}>
      {priorityInfo.labelKo}
    </Badge>
  );
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onClick: () => void;
}

function TaskCard({ task, onStatusChange, onClick }: TaskCardProps) {
  const control = task.controlId
    ? annexAControls.find((c) => c.id === task.controlId)
    : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";
  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <MagicCard
      className="rounded-xl cursor-pointer transition-transform hover:scale-[1.01]"
      gradientFrom="#8b5cf6"
      gradientTo="#5e5ce6"
      gradientColor="#1c1c1f"
      onClick={onClick}
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium leading-snug truncate">
                {task.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <TaskPriorityBadge priority={task.priority} />
              <TaskStatusBadge
                status={task.status}
                onStatusChange={(status) => onStatusChange(task.id, status)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {task.description && (
            <CardDescription className="line-clamp-2 text-xs">
              {task.description}
            </CardDescription>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {control && (
                <Badge variant="outline" className="text-xs text-primary">
                  {control.id}
                </Badge>
              )}
              {task.assignee && (
                <span className="text-muted-foreground">{task.assignee}</span>
              )}
            </div>
            {task.dueDate && (
              <span className={cn(
                "text-muted-foreground",
                isOverdue && "text-red-400"
              )}>
                {isOverdue
                  ? "마감일 지남"
                  : daysLeft === 0
                  ? "오늘 마감"
                  : daysLeft === 1
                  ? "내일 마감"
                  : daysLeft && daysLeft > 0
                  ? `D-${daysLeft}`
                  : task.dueDate}
              </span>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </MagicCard>
  );
}

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

function BoardColumn({ status, tasks, onStatusChange, onTaskClick }: BoardColumnProps) {
  const statusInfo = taskStatusConfig[status];

  return (
    <div className="flex-1 min-w-[300px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className={cn("h-2 w-2 rounded-full", statusInfo.color.split(" ")[0])} />
        <h3 className="text-sm font-medium">{statusInfo.labelKo}</h3>
        <span className="text-xs text-muted-foreground">({tasks.length})</span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-1 pt-1 pb-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-border">
            <p className="text-xs text-muted-foreground">태스크 없음</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] }
          : task
      )
    );
  };

  const handleTaskClick = (task: Task) => {
    // TODO: Open task detail sheet
    console.log("Task clicked:", task);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.controlId?.toLowerCase().includes(query) ||
          task.assignee?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    const result: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      completed: [],
    };
    filteredTasks.forEach((task) => {
      result[task.status].push(task);
    });
    return result;
  }, [filteredTasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
    ).length;
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-64 h-screen flex flex-col">
        <AppHeader title="태스크" />

        <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-6">
          {/* Stats + View Toggle */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-muted-foreground">전체</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">완료</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">진행 중</p>
                <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
              </div>
              {stats.overdue > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">지연</p>
                  <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "board" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("board")}
              >
                보드
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                리스트
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Input
              placeholder="태스크 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-80"
            />
            <div className="flex gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    상태: {statusFilter === "all" ? "전체" : taskStatusConfig[statusFilter].labelKo}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    전체
                  </DropdownMenuItem>
                  {(Object.keys(taskStatusConfig) as TaskStatus[]).map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                      {taskStatusConfig[status].labelKo}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    우선순위: {priorityFilter === "all" ? "전체" : taskPriorityConfig[priorityFilter].labelKo}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                    전체
                  </DropdownMenuItem>
                  {(Object.keys(taskPriorityConfig) as TaskPriority[]).map((priority) => (
                    <DropdownMenuItem key={priority} onClick={() => setPriorityFilter(priority)}>
                      {taskPriorityConfig[priority].labelKo}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="default" size="sm">
                태스크 추가
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground shrink-0">
            {filteredTasks.length}개 태스크
          </p>

          {/* Content */}
          {viewMode === "board" ? (
            <div className="flex-1 overflow-x-auto min-h-0 -mx-2 px-2">
              <div className="flex gap-6 h-full py-2 pb-4">
                {(Object.keys(taskStatusConfig) as TaskStatus[]).map((status) => (
                  <BoardColumn
                    key={status}
                    status={status}
                    tasks={tasksByStatus[status]}
                    onStatusChange={handleStatusChange}
                    onTaskClick={handleTaskClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2">
              <div className="space-y-3 pt-1 pb-4 px-1">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
                {filteredTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">검색 결과가 없습니다</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setPriorityFilter("all");
                      }}
                    >
                      필터 초기화
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
