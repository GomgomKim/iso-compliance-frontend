"use client";

import { useState, useMemo, useCallback } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  annexAControls,
  controlCategories,
  type AnnexAControl,
  type ControlStatus,
} from "@/data/annex-a-controls";
import { managementClauses, clauseCategories, type ManagementClause } from "@/data/management-system";
import { ControlDetailSheet } from "@/components/controls/control-detail-sheet";
import { companyProfiles } from "@/data/company-profiles";
import { useSettings } from "@/contexts/settings-context";
import type { Task } from "@/data/tasks";

type FilterStatus = "all" | ControlStatus;
type ControlType = "annex-a" | "clause";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

// Combined item type
type ControlItem = (AnnexAControl | ManagementClause) & { type: ControlType };

const statusConfig: Record<ControlStatus, { label: string; color: string }> = {
  not_started: { label: "시작 전", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "진행 중", color: "bg-blue-500/20 text-blue-400" },
  completed: { label: "완료", color: "bg-green-500/20 text-green-400" },
  not_applicable: { label: "해당없음", color: "bg-zinc-500/20 text-zinc-400" },
};

interface StatusBadgeProps {
  status: ControlStatus;
  onStatusChange: (status: ControlStatus) => void;
}

function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  const statusInfo = statusConfig[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className={cn("shrink-0 cursor-pointer hover:opacity-80 transition-opacity", statusInfo.color)}
          onClick={(e) => e.stopPropagation()}
        >
          {statusInfo.label}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {(Object.keys(statusConfig) as ControlStatus[]).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onStatusChange(s)}
            className={cn(
              "cursor-pointer",
              status === s && "bg-accent"
            )}
          >
            <span className={cn("mr-2 h-2 w-2 rounded-full", statusConfig[s].color.split(" ")[0])} />
            {statusConfig[s].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ControlCardProps {
  item: ControlItem;
  status: ControlStatus;
  progress: number;
  onClick?: () => void;
  onStatusChange: (status: ControlStatus) => void;
}

function ControlCard({ item, status, progress, onClick, onStatusChange }: ControlCardProps) {
  return (
    <MagicCard
      className="rounded-xl cursor-pointer transition-transform hover:scale-[1.02]"
      gradientFrom="#8b5cf6"
      gradientTo="#5e5ce6"
      gradientColor="#1c1c1f"
      onClick={onClick}
    >
      <Card className="border-0 bg-transparent shadow-none h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-primary">{item.id}</p>
              <CardTitle className="text-base leading-snug">{item.titleKo}</CardTitle>
            </div>
            <StatusBadge status={status} onStatusChange={onStatusChange} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription className="line-clamp-2 text-xs">
            {item.descriptionKo}
          </CardDescription>
          {status === "in_progress" && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">진행률</span>
                <span className="text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </MagicCard>
  );
}

interface CategoryStatsProps {
  items: ControlItem[];
  getStatus: (itemId: string) => { status: ControlStatus; progress: number };
  type: "annex-a" | "clause";
}

function CategoryStats({ items, getStatus, type }: CategoryStatsProps) {
  const categories = type === "annex-a" ? controlCategories : clauseCategories;

  const stats = categories.map((cat) => {
    const catItems = items.filter((item) => {
      if (type === "annex-a") {
        return (item as AnnexAControl).category === cat.id;
      } else {
        return (item as ManagementClause).clause === cat.id;
      }
    });
    const completed = catItems.filter((c) => getStatus(c.id).status === "completed").length;
    return {
      ...cat,
      completed,
      total: catItems.length,
      percentage: catItems.length > 0 ? Math.round((completed / catItems.length) * 100) : 0,
    };
  }).filter((stat) => stat.total > 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 py-1">
      {stats.map((stat) => (
        <MagicCard
          key={stat.id}
          className="rounded-xl"
          gradientFrom="#8b5cf6"
          gradientTo="#5e5ce6"
          gradientColor="#1c1c1f"
        >
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">
                {type === "clause" ? `Clause ${stat.id}` : stat.id}
              </CardDescription>
              <CardTitle className="text-sm">{stat.nameKo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <NumberTicker value={stat.completed} className="text-2xl font-bold" />
                <span className="text-muted-foreground">/ {stat.total}</span>
              </div>
              <Progress value={stat.percentage} className="mt-2 h-1" />
            </CardContent>
          </Card>
        </MagicCard>
      ))}
    </div>
  );
}

export default function ControlsPage() {
  const { companySize } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selectedItem, setSelectedItem] = useState<ControlItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [controlStatuses, setControlStatuses] = useState<Record<string, { status: ControlStatus; progress: number }>>({});
  const [controlType, setControlType] = useState<"all" | "annex-a" | "clause">("all");

  // File upload state (per control)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({});

  // Tasks state (per control)
  const [controlTasks, setControlTasks] = useState<Record<string, Task[]>>({});

  const handleItemClick = (item: ControlItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleStatusChange = (itemId: string, status: ControlStatus) => {
    setControlStatuses((prev) => ({
      ...prev,
      [itemId]: {
        status,
        progress: status === "completed" ? 100 : status === "not_started" ? 0 : prev[itemId]?.progress || 0,
      },
    }));
  };

  const handleSheetStatusChange = (status: ControlStatus) => {
    if (!selectedItem) return;
    handleStatusChange(selectedItem.id, status);
  };

  const handleFileUpload = (files: FileList) => {
    if (!selectedItem) return;
    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `${selectedItem.id}-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleDateString("ko-KR"),
    }));
    setUploadedFiles((prev) => ({
      ...prev,
      [selectedItem.id]: [...(prev[selectedItem.id] || []), ...newFiles],
    }));
  };

  const handleFileDelete = (fileId: string) => {
    if (!selectedItem) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [selectedItem.id]: (prev[selectedItem.id] || []).filter((f) => f.id !== fileId),
    }));
  };

  const handleAddTask = (title: string) => {
    if (!selectedItem) return;
    const newTask: Task = {
      id: `task-${selectedItem.id}-${Date.now()}`,
      title,
      status: "todo",
      priority: "medium",
      controlId: selectedItem.id,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setControlTasks((prev) => ({
      ...prev,
      [selectedItem.id]: [...(prev[selectedItem.id] || []), newTask],
    }));
  };

  const getControlStatusLocal = useCallback((itemId: string): { status: ControlStatus; progress: number } => {
    return controlStatuses[itemId] || { status: "not_started", progress: 0 };
  }, [controlStatuses]);

  // Filter controls based on company profile
  const profileItems = useMemo(() => {
    const profile = companyProfiles[companySize];

    const filteredAnnexA: ControlItem[] = annexAControls
      .filter((control) => profile.annexAControls.includes(control.id))
      .map((c) => ({ ...c, type: "annex-a" as const }));

    const filteredClauses: ControlItem[] = managementClauses
      .filter((clause) => profile.managementClauses.includes(clause.id))
      .map((c) => ({ ...c, type: "clause" as const }));

    return [...filteredClauses, ...filteredAnnexA];
  }, [companySize]);

  const annexAItems = useMemo(() => profileItems.filter((i) => i.type === "annex-a"), [profileItems]);
  const clauseItems = useMemo(() => profileItems.filter((i) => i.type === "clause"), [profileItems]);

  const displayItems = useMemo(() => {
    if (controlType === "annex-a") return annexAItems;
    if (controlType === "clause") return clauseItems;
    return profileItems;
  }, [controlType, profileItems, annexAItems, clauseItems]);

  const filteredItems = useMemo(() => {
    return displayItems.filter((item) => {
      // Category filter
      if (selectedCategory) {
        if (item.type === "annex-a") {
          if ((item as AnnexAControl).category !== selectedCategory) return false;
        } else {
          if ((item as ManagementClause).clause !== selectedCategory) return false;
        }
      }

      // Status filter
      if (statusFilter !== "all") {
        const { status } = getControlStatusLocal(item.id);
        if (status !== statusFilter) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(query) ||
          item.titleKo.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.descriptionKo.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory, statusFilter, displayItems, getControlStatusLocal]);

  const totalCompleted = displayItems.filter(
    (item) => getControlStatusLocal(item.id).status === "completed"
  ).length;
  const totalProgress = displayItems.length > 0
    ? Math.round((totalCompleted / displayItems.length) * 100)
    : 0;

  // Get available categories for current type
  const availableCategories = useMemo(() => {
    if (controlType === "clause") {
      const clauseIds = new Set(clauseItems.map((c) => (c as ManagementClause).clause));
      return clauseCategories.filter((cat) => clauseIds.has(cat.id));
    }
    if (controlType === "annex-a") {
      const categoryIds = new Set(annexAItems.map((c) => (c as AnnexAControl).category));
      return controlCategories.filter((cat) => categoryIds.has(cat.id));
    }
    // For "all", show both
    return [];
  }, [controlType, clauseItems, annexAItems]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-64 h-screen flex flex-col">
        <AppHeader title="컨트롤" />

        <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-2 shrink-0">
            <Button
              variant={controlType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setControlType("all");
                setSelectedCategory(null);
              }}
            >
              전체
            </Button>
            <Button
              variant={controlType === "clause" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setControlType("clause");
                setSelectedCategory(null);
              }}
            >
              관리체계 (Clause 4-10)
            </Button>
            <Button
              variant={controlType === "annex-a" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setControlType("annex-a");
                setSelectedCategory(null);
              }}
            >
              Annex A 통제
            </Button>
          </div>

          {/* Overall Progress */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <p className="text-muted-foreground">전체 진행률</p>
              <div className="flex items-baseline gap-2 mt-1">
                <NumberTicker value={totalCompleted} className="text-4xl font-bold" />
                <span className="text-muted-foreground text-lg">/ {displayItems.length} 항목</span>
              </div>
            </div>
            <div className="w-48">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">완료율</span>
                <span className="font-medium">{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>
          </div>

          {/* Category Stats */}
          {controlType !== "all" && (
            <div className="shrink-0 pt-1">
              <CategoryStats
                items={controlType === "annex-a" ? annexAItems : clauseItems}
                getStatus={getControlStatusLocal}
                type={controlType}
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Input
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-80"
            />
            {controlType !== "all" && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  전체
                </Button>
                {availableCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {controlType === "clause" ? `Clause ${cat.id}` : cat.id}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap shrink-0">
            <Button
              variant={statusFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              모든 상태
            </Button>
            {(Object.keys(statusConfig) as ControlStatus[]).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? statusConfig[status].color : ""}
              >
                {statusConfig[status].label}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground shrink-0">
            {filteredItems.length}개 항목
          </p>

          {/* Controls Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 py-2 pb-4">
              {filteredItems.map((item) => {
                const { status, progress } = getControlStatusLocal(item.id);
                return (
                  <ControlCard
                    key={item.id}
                    item={item}
                    status={status}
                    progress={progress}
                    onClick={() => handleItemClick(item)}
                    onStatusChange={(newStatus) => handleStatusChange(item.id, newStatus)}
                  />
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">검색 결과가 없습니다</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setStatusFilter("all");
                  }}
                >
                  필터 초기화
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Control Detail Sheet */}
      <ControlDetailSheet
        control={selectedItem?.type === "annex-a" ? (selectedItem as AnnexAControl) : null}
        clause={selectedItem?.type === "clause" ? (selectedItem as ManagementClause) : null}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        status={selectedItem ? getControlStatusLocal(selectedItem.id).status : "not_started"}
        progress={selectedItem ? getControlStatusLocal(selectedItem.id).progress : 0}
        onStatusChange={handleSheetStatusChange}
        tasks={selectedItem ? controlTasks[selectedItem.id] || [] : []}
        onAddTask={handleAddTask}
        uploadedFiles={selectedItem ? uploadedFiles[selectedItem.id] || [] : []}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
      />
    </div>
  );
}
