"use client";

import { useState, useRef, useMemo } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MagicCard } from "@/components/ui/magic-card";
import { Card, CardContent } from "@/components/ui/card";
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

type FileCategory = "all" | "policy" | "evidence" | "report" | "other";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  category: FileCategory;
  controlId?: string;
  description?: string;
}

const fileCategoryConfig: Record<FileCategory, { label: string; color: string }> = {
  all: { label: "전체", color: "bg-muted text-muted-foreground" },
  policy: { label: "정책/지침", color: "bg-blue-500/20 text-blue-400" },
  evidence: { label: "증빙자료", color: "bg-green-500/20 text-green-400" },
  report: { label: "보고서", color: "bg-purple-500/20 text-purple-400" },
  other: { label: "기타", color: "bg-zinc-500/20 text-zinc-400" },
};

// Sample documents for demonstration
const sampleDocuments: UploadedFile[] = [
  {
    id: "doc-1",
    name: "정보보호 정책서 v2.1.pdf",
    size: 2456000,
    uploadedAt: "2026-02-10",
    category: "policy",
    controlId: "A.5.1",
    description: "CEO 서명 포함 정보보호 정책",
  },
  {
    id: "doc-2",
    name: "위험평가표_2026.xlsx",
    size: 156000,
    uploadedAt: "2026-02-08",
    category: "evidence",
    controlId: "6.1",
    description: "연간 위험 평가 결과",
  },
  {
    id: "doc-3",
    name: "보안교육_이수현황.pdf",
    size: 890000,
    uploadedAt: "2026-02-05",
    category: "evidence",
    controlId: "A.6.3",
  },
  {
    id: "doc-4",
    name: "내부심사_보고서_2026Q1.docx",
    size: 1234000,
    uploadedAt: "2026-02-01",
    category: "report",
    controlId: "9.2",
  },
  {
    id: "doc-5",
    name: "접근권한_검토결과.xlsx",
    size: 234000,
    uploadedAt: "2026-01-28",
    category: "evidence",
    controlId: "A.5.15",
  },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() || "FILE";
}

function getFileTypeColor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "bg-red-500/20 text-red-400";
    case "xlsx":
    case "xls":
      return "bg-green-500/20 text-green-400";
    case "docx":
    case "doc":
      return "bg-blue-500/20 text-blue-400";
    case "pptx":
    case "ppt":
      return "bg-orange-500/20 text-orange-400";
    case "png":
    case "jpg":
    case "jpeg":
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-zinc-500/20 text-zinc-400";
  }
}

interface DocumentCardProps {
  file: UploadedFile;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: FileCategory) => void;
}

function DocumentCard({ file, onDelete, onCategoryChange }: DocumentCardProps) {
  return (
    <MagicCard
      className="rounded-xl"
      gradientFrom="#8b5cf6"
      gradientTo="#5e5ce6"
      gradientColor="#1c1c1f"
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* File Type Icon */}
            <div className={cn("shrink-0 rounded-lg px-3 py-2 text-xs font-bold", getFileTypeColor(file.name))}>
              {getFileExtension(file.name)}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <p className="text-sm font-medium truncate">{file.name}</p>
                {file.description && (
                  <p className="text-xs text-muted-foreground truncate">{file.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant="secondary"
                      className={cn("cursor-pointer hover:opacity-80", fileCategoryConfig[file.category].color)}
                    >
                      {fileCategoryConfig[file.category].label}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {(Object.keys(fileCategoryConfig) as FileCategory[])
                      .filter((c) => c !== "all")
                      .map((cat) => (
                        <DropdownMenuItem
                          key={cat}
                          onClick={() => onCategoryChange(file.id, cat)}
                          className="cursor-pointer"
                        >
                          {fileCategoryConfig[cat].label}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {file.controlId && (
                  <Badge variant="outline" className="text-xs text-primary">
                    {file.controlId}
                  </Badge>
                )}

                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {file.uploadedAt}
                </span>
              </div>
            </div>

            {/* Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(file.id)}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </MagicCard>
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<UploadedFile[]>(sampleDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FileCategory>("all");
  const [uploadCategory, setUploadCategory] = useState<FileCategory>("evidence");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleDateString("ko-KR"),
        category: uploadCategory,
      }));
      setDocuments((prev) => [...newFiles, ...prev]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCategoryChange = (id: string, category: FileCategory) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, category } : d))
    );
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (categoryFilter !== "all" && doc.category !== categoryFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          doc.name.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.controlId?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [documents, searchQuery, categoryFilter]);

  const stats = useMemo(() => {
    const total = documents.length;
    const byCategory = {
      policy: documents.filter((d) => d.category === "policy").length,
      evidence: documents.filter((d) => d.category === "evidence").length,
      report: documents.filter((d) => d.category === "report").length,
      other: documents.filter((d) => d.category === "other").length,
    };
    const totalSize = documents.reduce((acc, d) => acc + d.size, 0);
    return { total, byCategory, totalSize };
  }, [documents]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-64 h-screen flex flex-col">
        <AppHeader title="문서" />

        <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-6">
          {/* Stats */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-muted-foreground">전체 문서</p>
                <p className="text-2xl font-bold">{stats.total}개</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">총 용량</p>
                <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    카테고리: {fileCategoryConfig[uploadCategory].label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(Object.keys(fileCategoryConfig) as FileCategory[])
                    .filter((c) => c !== "all")
                    .map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => setUploadCategory(cat)}
                        className="cursor-pointer"
                      >
                        {fileCategoryConfig[cat].label}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={handleFileSelect}>
                파일 업로드
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Input
              placeholder="문서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-80"
            />
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(fileCategoryConfig) as FileCategory[]).map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                >
                  {fileCategoryConfig[cat].label}
                  {cat !== "all" && (
                    <span className="ml-1 text-xs opacity-70">
                      ({cat === "policy" ? stats.byCategory.policy :
                        cat === "evidence" ? stats.byCategory.evidence :
                        cat === "report" ? stats.byCategory.report :
                        stats.byCategory.other})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground shrink-0">
            {filteredDocuments.length}개 문서
          </p>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-3 pb-4">
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  file={doc}
                  onDelete={handleDelete}
                  onCategoryChange={handleCategoryChange}
                />
              ))}

              {filteredDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    {documents.length === 0 ? "업로드된 문서가 없습니다" : "검색 결과가 없습니다"}
                  </p>
                  {documents.length === 0 ? (
                    <Button variant="link" onClick={handleFileSelect}>
                      첫 문서 업로드하기
                    </Button>
                  ) : (
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("all");
                      }}
                    >
                      필터 초기화
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
