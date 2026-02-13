"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MagicCard } from "@/components/ui/magic-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { companyProfiles, companySizeOptions, type CompanySize } from "@/data/company-profiles";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  taskReminders: boolean;
  deadlineAlerts: boolean;
  weeklyReport: boolean;
}

export default function SettingsPage() {
  const [companySize, setCompanySize] = useState<CompanySize>("startup");
  const [companyName, setCompanyName] = useState("내 회사");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "홍길동",
    email: "admin@company.com",
    role: "정보보호관리자",
    department: "보안팀",
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    taskReminders: true,
    deadlineAlerts: true,
    weeklyReport: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleExportData = () => {
    // Create export data
    const exportData = {
      companyName,
      companySize,
      userProfile,
      notifications,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iso-compliance-settings-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentProfile = companyProfiles[companySize];

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-64 h-screen flex flex-col">
        <AppHeader title="설정" />

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Company Settings */}
          <MagicCard
            className="rounded-xl"
            gradientFrom="#8b5cf6"
            gradientTo="#5e5ce6"
            gradientColor="#1c1c1f"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>조직 설정</CardTitle>
                <CardDescription>
                  조직 정보와 인증 범위를 설정합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">조직명</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="조직명을 입력하세요"
                    className="max-w-md"
                  />
                </div>

                {/* Company Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">조직 규모</label>
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-48 justify-between">
                          {currentProfile.nameKo}
                          <Badge variant="secondary" className="ml-2">
                            {currentProfile.annexAControls.length + currentProfile.managementClauses.length}개 항목
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {companySizeOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setCompanySize(option.value)}
                            className={cn(
                              "cursor-pointer",
                              companySize === option.value && "bg-accent"
                            )}
                          >
                            <div className="flex-1">
                              <p className="font-medium">{option.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {companyProfiles[option.value].descriptionKo}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    선택한 규모에 따라 필수 통제항목 수가 달라집니다
                  </p>
                </div>

                <Separator />

                {/* Scope Summary */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">인증 범위 요약</label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground">관리체계 (Clause 4-10)</p>
                      <p className="text-2xl font-bold">{currentProfile.managementClauses.length}개</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground">Annex A 통제</p>
                      <p className="text-2xl font-bold">{currentProfile.annexAControls.length}개</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MagicCard>

          {/* User Profile */}
          <MagicCard
            className="rounded-xl"
            gradientFrom="#8b5cf6"
            gradientTo="#5e5ce6"
            gradientColor="#1c1c1f"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>사용자 프로필</CardTitle>
                <CardDescription>
                  개인 정보를 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">이름</label>
                    <Input
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      placeholder="이름"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">이메일</label>
                    <Input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      placeholder="이메일"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">역할</label>
                    <Input
                      value={userProfile.role}
                      onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
                      placeholder="역할"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">부서</label>
                    <Input
                      value={userProfile.department}
                      onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })}
                      placeholder="부서"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </MagicCard>

          {/* Notification Settings */}
          <MagicCard
            className="rounded-xl"
            gradientFrom="#8b5cf6"
            gradientTo="#5e5ce6"
            gradientColor="#1c1c1f"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
                <CardDescription>
                  알림 수신 방법을 설정합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "emailNotifications", label: "이메일 알림", description: "중요 업데이트를 이메일로 받습니다" },
                  { key: "taskReminders", label: "태스크 리마인더", description: "할당된 태스크에 대한 알림을 받습니다" },
                  { key: "deadlineAlerts", label: "마감일 알림", description: "마감일 3일 전에 알림을 받습니다" },
                  { key: "weeklyReport", label: "주간 리포트", description: "매주 월요일에 진행 상황 리포트를 받습니다" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Button
                      variant={notifications[item.key as keyof NotificationSettings] ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof NotificationSettings],
                        })
                      }
                    >
                      {notifications[item.key as keyof NotificationSettings] ? "켜짐" : "꺼짐"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </MagicCard>

          {/* Data Management */}
          <MagicCard
            className="rounded-xl"
            gradientFrom="#8b5cf6"
            gradientTo="#5e5ce6"
            gradientColor="#1c1c1f"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>데이터 관리</CardTitle>
                <CardDescription>
                  데이터 내보내기 및 백업을 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium">설정 내보내기</p>
                    <p className="text-xs text-muted-foreground">현재 설정을 JSON 파일로 내보냅니다</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    내보내기
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium">전체 데이터 초기화</p>
                    <p className="text-xs text-muted-foreground">모든 데이터를 삭제하고 초기 상태로 되돌립니다</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    초기화
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MagicCard>

          {/* About */}
          <MagicCard
            className="rounded-xl"
            gradientFrom="#8b5cf6"
            gradientTo="#5e5ce6"
            gradientColor="#1c1c1f"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>정보</CardTitle>
                <CardDescription>
                  애플리케이션 정보
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground">버전</p>
                    <p className="text-sm font-medium">1.0.0</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground">표준</p>
                    <p className="text-sm font-medium">ISO 27001:2022</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground">최종 업데이트</p>
                    <p className="text-sm font-medium">2026-02-13</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MagicCard>

          {/* Save Button */}
          <div className="flex justify-end pb-8">
            <Button onClick={handleSave} disabled={isSaving} className="w-32">
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
