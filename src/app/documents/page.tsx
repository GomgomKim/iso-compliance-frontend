"use client";

import { useState, useRef, useMemo } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MagicCard } from "@/components/ui/magic-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useDocuments,
  useDirectUpload,
  useDeleteDocument,
  useDownloadUrl,
  type Document,
} from "@/hooks/use-documents";

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
  file: Document;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  isDeleting?: boolean;
}

function DocumentCard({ file, onDelete, onDownload, isDeleting }: DocumentCardProps) {
  return (
    <MagicCard
      className="rounded-xl cursor-pointer"
      gradientFrom="#8b5cf6"
      gradientTo="#5e5ce6"
      gradientColor="#1c1c1f"
      onClick={() => onDownload(file.id)}
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
                {file.control_id && (
                  <Badge variant="outline" className="text-xs text-primary">
                    {file.control_id}
                  </Badge>
                )}

                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.file_size)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(file.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
              }}
              disabled={isDeleting}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </MagicCard>
  );
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [controlFilter, setControlFilter] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: documents = [], isLoading, error } = useDocuments({
    controlId: controlFilter || undefined,
    search: searchQuery || undefined,
  });
  const uploadMutation = useDirectUpload();
  const deleteMutation = useDeleteDocument();
  const downloadMutation = useDownloadUrl();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        try {
          await uploadMutation.mutateAsync({ file });
          toast.success(`${file.name} 업로드 완료`);
        } catch {
          toast.error(`${file.name} 업로드 실패`);
        }
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("문서가 삭제되었습니다");
    } catch {
      toast.error("문서 삭제에 실패했습니다");
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const downloadUrl = await downloadMutation.mutateAsync(id);
      window.open(downloadUrl, "_blank");
    } catch {
      toast.error("다운로드 URL을 가져오는데 실패했습니다");
    }
  };

  const stats = useMemo(() => {
    const total = documents.length;
    const totalSize = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);
    return { total, totalSize };
  }, [documents]);

  // Get unique control IDs for filtering
  const controlIds = useMemo(() => {
    const ids = new Set<string>();
    documents.forEach((doc) => {
      if (doc.control_id) {
        ids.add(doc.control_id);
      }
    });
    return Array.from(ids).sort();
  }, [documents]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">문서를 불러오는데 실패했습니다</p>
          <p className="text-sm text-muted-foreground">백엔드 서버가 실행 중인지 확인해주세요</p>
        </div>
      </div>
    );
  }

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
              <Button
                onClick={handleFileSelect}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "업로드 중..." : "파일 업로드"}
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
            {controlIds.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={controlFilter === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setControlFilter("")}
                >
                  전체
                </Button>
                {controlIds.map((controlId) => (
                  <Button
                    key={controlId}
                    variant={controlFilter === controlId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setControlFilter(controlId)}
                  >
                    {controlId}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground shrink-0">
            {documents.length}개 문서
          </p>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">로딩 중...</p>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    file={doc}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}

                {documents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery || controlFilter
                        ? "검색 결과가 없습니다"
                        : "업로드된 문서가 없습니다"}
                    </p>
                    {searchQuery || controlFilter ? (
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchQuery("");
                          setControlFilter("");
                        }}
                      >
                        필터 초기화
                      </Button>
                    ) : (
                      <Button variant="link" onClick={handleFileSelect}>
                        첫 문서 업로드하기
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
