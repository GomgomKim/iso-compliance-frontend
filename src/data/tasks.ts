export type TaskStatus = "todo" | "in_progress" | "review" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  controlId?: string; // Related Annex A control
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export const taskStatusConfig: Record<TaskStatus, { label: string; labelKo: string; color: string }> = {
  todo: { label: "To Do", labelKo: "할 일", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", labelKo: "진행 중", color: "bg-blue-500/20 text-blue-400" },
  review: { label: "Review", labelKo: "검토 중", color: "bg-yellow-500/20 text-yellow-400" },
  completed: { label: "Completed", labelKo: "완료", color: "bg-green-500/20 text-green-400" },
};

export const taskPriorityConfig: Record<TaskPriority, { label: string; labelKo: string; color: string }> = {
  low: { label: "Low", labelKo: "낮음", color: "bg-zinc-500/20 text-zinc-400" },
  medium: { label: "Medium", labelKo: "보통", color: "bg-blue-500/20 text-blue-400" },
  high: { label: "High", labelKo: "높음", color: "bg-orange-500/20 text-orange-400" },
  urgent: { label: "Urgent", labelKo: "긴급", color: "bg-red-500/20 text-red-400" },
};

// Sample tasks for demonstration
export const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "정보보안 정책 문서 작성",
    description: "조직의 정보보안 정책을 수립하고 문서화합니다.",
    status: "in_progress",
    priority: "high",
    controlId: "A.5.1",
    assignee: "김보안",
    dueDate: "2026-02-28",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-10",
    tags: ["문서화", "정책"],
  },
  {
    id: "task-2",
    title: "접근 권한 검토",
    description: "모든 시스템의 접근 권한을 검토하고 불필요한 권한을 제거합니다.",
    status: "todo",
    priority: "medium",
    controlId: "A.5.15",
    assignee: "이관리",
    dueDate: "2026-03-15",
    createdAt: "2026-02-05",
    updatedAt: "2026-02-05",
    tags: ["접근권한", "검토"],
  },
  {
    id: "task-3",
    title: "보안 인식 교육 계획 수립",
    description: "전 직원 대상 보안 인식 교육 프로그램을 계획합니다.",
    status: "review",
    priority: "medium",
    controlId: "A.6.3",
    assignee: "박교육",
    dueDate: "2026-02-20",
    createdAt: "2026-02-03",
    updatedAt: "2026-02-12",
    tags: ["교육", "인식"],
  },
  {
    id: "task-4",
    title: "암호화 정책 검토",
    description: "데이터 암호화 정책 및 구현 현황을 검토합니다.",
    status: "completed",
    priority: "high",
    controlId: "A.8.24",
    assignee: "최암호",
    dueDate: "2026-02-10",
    createdAt: "2026-01-25",
    updatedAt: "2026-02-10",
    tags: ["암호화", "기술"],
  },
  {
    id: "task-5",
    title: "외부 공급업체 보안 평가",
    description: "주요 외부 공급업체의 보안 수준을 평가합니다.",
    status: "todo",
    priority: "urgent",
    controlId: "A.5.22",
    assignee: "정외부",
    dueDate: "2026-02-25",
    createdAt: "2026-02-08",
    updatedAt: "2026-02-08",
    tags: ["공급망", "평가"],
  },
  {
    id: "task-6",
    title: "물리적 보안 점검",
    description: "사무실 및 데이터센터의 물리적 보안 상태를 점검합니다.",
    status: "in_progress",
    priority: "medium",
    controlId: "A.7.1",
    assignee: "강물리",
    dueDate: "2026-03-01",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-13",
    tags: ["물리보안", "점검"],
  },
  {
    id: "task-7",
    title: "취약점 스캔 결과 분석",
    description: "최근 취약점 스캔 결과를 분석하고 조치 계획을 수립합니다.",
    status: "todo",
    priority: "high",
    controlId: "A.8.8",
    assignee: "송취약",
    dueDate: "2026-02-18",
    createdAt: "2026-02-11",
    updatedAt: "2026-02-11",
    tags: ["취약점", "분석"],
  },
  {
    id: "task-8",
    title: "백업 절차 테스트",
    description: "데이터 백업 및 복구 절차를 테스트합니다.",
    status: "review",
    priority: "medium",
    controlId: "A.8.13",
    assignee: "윤백업",
    dueDate: "2026-02-22",
    createdAt: "2026-02-06",
    updatedAt: "2026-02-13",
    tags: ["백업", "테스트"],
  },
];
