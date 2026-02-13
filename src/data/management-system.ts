export type ClauseStatus = "not_started" | "in_progress" | "completed" | "not_applicable";

export interface ManagementClause {
  id: string;
  clause: string;
  category: string;
  categoryKo: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  tip?: string;
  evidence?: string;
}

export const clauseCategories = [
  { id: "4", name: "Context of the Organization", nameKo: "조직 상황", count: 4 },
  { id: "5", name: "Leadership", nameKo: "리더십", count: 3 },
  { id: "6", name: "Planning", nameKo: "기획", count: 3 },
  { id: "7", name: "Support", nameKo: "지원", count: 5 },
  { id: "8", name: "Operation", nameKo: "운영", count: 3 },
  { id: "9", name: "Performance Evaluation", nameKo: "성과 평가", count: 3 },
  { id: "10", name: "Improvement", nameKo: "개선", count: 2 },
];

export const managementClauses: ManagementClause[] = [
  // Clause 4: Context of the Organization
  {
    id: "4.1",
    clause: "4",
    category: "Context of the Organization",
    categoryKo: "조직 상황",
    title: "Understanding the organization and its context",
    titleKo: "조직과 조직 상황의 이해",
    description: "The organization shall determine external and internal issues that are relevant to its purpose and that affect its ability to achieve the intended outcome(s) of its information security management system.",
    descriptionKo: "조직은 조직의 목적과 관련이 있고 정보보안경영시스템의 의도된 결과를 달성하는 능력에 영향을 미치는 외부 및 내부 이슈를 결정해야 한다.",
    tip: "노션 페이지에 표를 만들고 내부 이슈(인력 부족 등), 외부 이슈(고객사 인증 요구 등)를 나열하세요.",
    evidence: "조직 현황 분석서",
  },
  {
    id: "4.2",
    clause: "4",
    category: "Context of the Organization",
    categoryKo: "조직 상황",
    title: "Understanding the needs and expectations of interested parties",
    titleKo: "이해관계자의 니즈와 기대 이해",
    description: "The organization shall determine interested parties that are relevant to the information security management system and the requirements of these interested parties relevant to information security.",
    descriptionKo: "조직은 정보보안경영시스템과 관련된 이해관계자와 정보보안과 관련된 이해관계자의 요구사항을 결정해야 한다.",
    tip: "고객, 파트너사, 규제기관(정부), 임직원의 보안 요구사항을 식별하세요.",
    evidence: "이해관계자 요구사항 목록",
  },
  {
    id: "4.3",
    clause: "4",
    category: "Context of the Organization",
    categoryKo: "조직 상황",
    title: "Determining the scope of the ISMS",
    titleKo: "ISMS 적용 범위 결정",
    description: "The organization shall determine the boundaries and applicability of the information security management system to establish its scope.",
    descriptionKo: "조직은 정보보안경영시스템의 적용 범위를 확립하기 위해 경계와 적용성을 결정해야 한다.",
    tip: "'전사'보다는 'SaaS 서비스 개발 및 운영 조직'으로 범위를 구체화하는 것이 초기 심사에 유리합니다.",
    evidence: "인증 범위가 명시된 문서, 네트워크 구성도에 범위 표시",
  },
  {
    id: "4.4",
    clause: "4",
    category: "Context of the Organization",
    categoryKo: "조직 상황",
    title: "Information security management system",
    titleKo: "정보보안경영시스템",
    description: "The organization shall establish, implement, maintain and continually improve an information security management system.",
    descriptionKo: "조직은 정보보안경영시스템을 수립, 구현, 유지 및 지속적으로 개선해야 한다.",
    tip: "ISMS 운영 계획서를 작성하고 경영진 승인을 받으세요.",
    evidence: "ISMS 운영 계획서",
  },

  // Clause 5: Leadership
  {
    id: "5.1",
    clause: "5",
    category: "Leadership",
    categoryKo: "리더십",
    title: "Leadership and commitment",
    titleKo: "리더십과 의지",
    description: "Top management shall demonstrate leadership and commitment with respect to the information security management system.",
    descriptionKo: "최고경영진은 정보보안경영시스템에 대한 리더십과 의지를 보여야 한다.",
    tip: "CEO가 정보보호 정책서에 서명하고, 보안 예산을 승인한 증거를 남기세요.",
    evidence: "CEO 서명이 있는 정보보호 정책서, 보안 예산 승인 문서",
  },
  {
    id: "5.2",
    clause: "5",
    category: "Leadership",
    categoryKo: "리더십",
    title: "Policy",
    titleKo: "정책",
    description: "Top management shall establish an information security policy that is appropriate to the purpose of the organization.",
    descriptionKo: "최고경영진은 조직의 목적에 적합한 정보보안 정책을 수립해야 한다.",
    tip: "KISA 보호나라의 정보보호 정책서 예시를 다운받아 회사명만 바꾸세요.",
    evidence: "대표이사 서명이 있는 정보보호 정책서",
  },
  {
    id: "5.3",
    clause: "5",
    category: "Leadership",
    categoryKo: "리더십",
    title: "Organizational roles, responsibilities and authorities",
    titleKo: "조직의 역할, 책임 및 권한",
    description: "Top management shall ensure that the responsibilities and authorities for roles relevant to information security are assigned and communicated.",
    descriptionKo: "최고경영진은 정보보안과 관련된 역할에 대한 책임과 권한이 할당되고 전달되도록 해야 한다.",
    tip: "조직도에 정보보호최고책임자(CISO)와 정보보호관리자를 표기하세요. 스타트업은 보통 CTO가 겸임합니다.",
    evidence: "보안 역할이 표기된 최신 조직도",
  },

  // Clause 6: Planning
  {
    id: "6.1",
    clause: "6",
    category: "Planning",
    categoryKo: "기획",
    title: "Actions to address risks and opportunities",
    titleKo: "위험과 기회를 다루기 위한 조치",
    description: "When planning for the ISMS, the organization shall consider the issues and requirements and determine the risks and opportunities that need to be addressed.",
    descriptionKo: "ISMS 기획 시, 조직은 이슈와 요구사항을 고려하고 다루어야 할 위험과 기회를 결정해야 한다.",
    tip: "복잡한 수식 대신 3x3 매트릭스(상/중/하)를 사용하세요. 위험도가 '상'인 항목에 대해서만 조치 계획을 세우세요.",
    evidence: "위험 평가표 (엑셀 또는 노션 DB), 위험 처리 계획서",
  },
  {
    id: "6.2",
    clause: "6",
    category: "Planning",
    categoryKo: "기획",
    title: "Information security objectives and planning to achieve them",
    titleKo: "정보보안 목표 및 달성 계획",
    description: "The organization shall establish information security objectives at relevant functions and levels.",
    descriptionKo: "조직은 관련 기능과 수준에서 정보보안 목표를 수립해야 한다.",
    tip: "연간 보안 목표를 3~5개 정하고, 각 목표별 달성 계획과 담당자를 명시하세요.",
    evidence: "연간 정보보안 목표 및 추진 계획서",
  },
  {
    id: "6.3",
    clause: "6",
    category: "Planning",
    categoryKo: "기획",
    title: "Planning of changes",
    titleKo: "변경 계획",
    description: "When the organization determines the need for changes to the ISMS, the changes shall be carried out in a planned manner.",
    descriptionKo: "조직이 ISMS 변경의 필요성을 결정할 때, 변경은 계획적인 방식으로 수행되어야 한다.",
    tip: "ISMS 변경 시 변경 요청서를 작성하고 승인을 받는 절차를 마련하세요.",
    evidence: "ISMS 변경 관리 절차서",
  },

  // Clause 7: Support
  {
    id: "7.1",
    clause: "7",
    category: "Support",
    categoryKo: "지원",
    title: "Resources",
    titleKo: "자원",
    description: "The organization shall determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the ISMS.",
    descriptionKo: "조직은 ISMS의 수립, 구현, 유지 및 지속적 개선에 필요한 자원을 결정하고 제공해야 한다.",
    tip: "AWS Security Hub 등 보안 도구 비용, 컨설팅 비용 등을 품의서로 결재받으세요.",
    evidence: "보안 관련 지출 결의서, 품의서",
  },
  {
    id: "7.2",
    clause: "7",
    category: "Support",
    categoryKo: "지원",
    title: "Competence",
    titleKo: "역량",
    description: "The organization shall determine the necessary competence of person(s) doing work under its control that affects its information security performance.",
    descriptionKo: "조직은 정보보안 성과에 영향을 미치는 업무를 수행하는 인원의 필요한 역량을 결정해야 한다.",
    tip: "보안 담당자의 자격증(CISSP, 정보보안기사 등)이나 교육 이수 내역을 정리하세요.",
    evidence: "보안 담당자 자격/역량 현황표",
  },
  {
    id: "7.3",
    clause: "7",
    category: "Support",
    categoryKo: "지원",
    title: "Awareness",
    titleKo: "인식",
    description: "Persons doing work under the organization's control shall be aware of the information security policy and their contribution to the effectiveness of the ISMS.",
    descriptionKo: "조직의 통제 하에 업무를 수행하는 인원은 정보보안 정책과 ISMS 효과성에 대한 자신의 기여를 인식해야 한다.",
    tip: "개인정보보호 포털의 무료 교육 자료를 슬랙에 배포하고, 구글 폼으로 간단한 퀴즈(5문제)를 풀게 하세요.",
    evidence: "교육 자료, 구글 폼 응답 결과 엑셀 파일",
  },
  {
    id: "7.4",
    clause: "7",
    category: "Support",
    categoryKo: "지원",
    title: "Communication",
    titleKo: "의사소통",
    description: "The organization shall determine the need for internal and external communications relevant to the ISMS.",
    descriptionKo: "조직은 ISMS와 관련된 내부 및 외부 의사소통의 필요성을 결정해야 한다.",
    tip: "보안 공지를 위한 슬랙 채널을 만들고, 정기적으로 보안 관련 공지를 올리세요.",
    evidence: "보안 공지 채널 및 공지 이력",
  },
  {
    id: "7.5",
    clause: "7",
    category: "Support",
    categoryKo: "지원",
    title: "Documented information",
    titleKo: "문서화된 정보",
    description: "The organization's ISMS shall include documented information required by this document and determined by the organization as being necessary for the effectiveness of the ISMS.",
    descriptionKo: "조직의 ISMS는 이 문서에서 요구하는 문서화된 정보와 ISMS 효과성을 위해 조직이 필요하다고 결정한 문서화된 정보를 포함해야 한다.",
    tip: "노션 Security 페이지에 정책/지침을 모아두고 '여기가 최신본입니다'라고 공지하세요.",
    evidence: "노션 페이지 트리 구조 캡처, 문서 목록",
  },

  // Clause 8: Operation
  {
    id: "8.1",
    clause: "8",
    category: "Operation",
    categoryKo: "운영",
    title: "Operational planning and control",
    titleKo: "운영 계획 및 통제",
    description: "The organization shall plan, implement and control the processes needed to meet information security requirements and to implement the actions determined in 6.1.",
    descriptionKo: "조직은 정보보안 요구사항을 충족하고 6.1에서 결정된 조치를 구현하기 위해 필요한 프로세스를 계획, 구현 및 통제해야 한다.",
    tip: "위험 처리 계획에 따른 보안 활동이 실제로 이행되고 기록(Log, 문서)으로 남겨야 합니다.",
    evidence: "보안 활동 수행 기록, 보안 점검 결과서",
  },
  {
    id: "8.2",
    clause: "8",
    category: "Operation",
    categoryKo: "운영",
    title: "Information security risk assessment",
    titleKo: "정보보안 위험 평가",
    description: "The organization shall perform information security risk assessments at planned intervals or when significant changes are proposed or occur.",
    descriptionKo: "조직은 계획된 주기 또는 중요한 변경이 제안되거나 발생할 때 정보보안 위험 평가를 수행해야 한다.",
    tip: "연 1회 이상 위험 평가를 수행하고, 신규 시스템 도입 시에도 평가하세요.",
    evidence: "위험 평가 수행 기록, 위험 평가 결과서",
  },
  {
    id: "8.3",
    clause: "8",
    category: "Operation",
    categoryKo: "운영",
    title: "Information security risk treatment",
    titleKo: "정보보안 위험 처리",
    description: "The organization shall implement the information security risk treatment plan.",
    descriptionKo: "조직은 정보보안 위험 처리 계획을 구현해야 한다.",
    tip: "위험 평가 결과 도출된 위험에 대해 처리 계획을 수립하고 이행하세요.",
    evidence: "위험 처리 계획서, 조치 완료 보고서",
  },

  // Clause 9: Performance Evaluation
  {
    id: "9.1",
    clause: "9",
    category: "Performance Evaluation",
    categoryKo: "성과 평가",
    title: "Monitoring, measurement, analysis and evaluation",
    titleKo: "모니터링, 측정, 분석 및 평가",
    description: "The organization shall evaluate the information security performance and the effectiveness of the ISMS.",
    descriptionKo: "조직은 정보보안 성과와 ISMS의 효과성을 평가해야 한다.",
    tip: "보안 목표 달성률, 사고 발생 건수 등의 KPI를 설정하고 정기적으로 측정하세요.",
    evidence: "정보보안 KPI 측정 결과서",
  },
  {
    id: "9.2",
    clause: "9",
    category: "Performance Evaluation",
    categoryKo: "성과 평가",
    title: "Internal audit",
    titleKo: "내부 심사",
    description: "The organization shall conduct internal audits at planned intervals to provide information on whether the ISMS conforms to the organization's own requirements and requirements of this document.",
    descriptionKo: "조직은 ISMS가 조직 자체 요구사항과 이 문서의 요구사항에 적합한지에 대한 정보를 제공하기 위해 계획된 주기로 내부 심사를 수행해야 한다.",
    tip: "연 1회 내부 심사를 수행하세요. 체크리스트를 만들어 각 항목별로 적합/부적합을 판정합니다.",
    evidence: "내부 심사 계획서, 내부 심사 보고서",
  },
  {
    id: "9.3",
    clause: "9",
    category: "Performance Evaluation",
    categoryKo: "성과 평가",
    title: "Management review",
    titleKo: "경영 검토",
    description: "Top management shall review the organization's ISMS at planned intervals to ensure its continuing suitability, adequacy and effectiveness.",
    descriptionKo: "최고경영진은 ISMS의 지속적인 적합성, 충족성 및 효과성을 보장하기 위해 계획된 주기로 조직의 ISMS를 검토해야 한다.",
    tip: "CEO에게 보안 현황을 보고하고 '승인합니다' 답장 또는 서명을 받으세요.",
    evidence: "경영 검토 회의록 (CEO 서명 필수)",
  },

  // Clause 10: Improvement
  {
    id: "10.1",
    clause: "10",
    category: "Improvement",
    categoryKo: "개선",
    title: "Continual improvement",
    titleKo: "지속적 개선",
    description: "The organization shall continually improve the suitability, adequacy and effectiveness of the ISMS.",
    descriptionKo: "조직은 ISMS의 적합성, 충족성 및 효과성을 지속적으로 개선해야 한다.",
    tip: "내부 심사, 경영 검토 결과를 바탕으로 개선 과제를 도출하고 추진하세요.",
    evidence: "개선 과제 목록, 개선 조치 완료 보고서",
  },
  {
    id: "10.2",
    clause: "10",
    category: "Improvement",
    categoryKo: "개선",
    title: "Nonconformity and corrective action",
    titleKo: "부적합 및 시정 조치",
    description: "When a nonconformity occurs, the organization shall react to the nonconformity, take action to control and correct it, and deal with the consequences.",
    descriptionKo: "부적합이 발생하면, 조직은 부적합에 대응하고, 이를 통제하고 시정하기 위한 조치를 취하며, 결과를 처리해야 한다.",
    tip: "작은 장애나 보안 이슈도 숨기지 말고 Jira에 기록하세요. 원인 분석 후 '조치 완료' 상태로 변경된 이력이 중요합니다.",
    evidence: "부적합 보고서, 시정 조치 완료된 이슈 티켓",
  },
];

// Helper functions
export function getClausesByCategory(categoryId: string): ManagementClause[] {
  return managementClauses.filter((clause) => clause.clause === categoryId);
}

export function getTotalClauseCount(): number {
  return managementClauses.length;
}
