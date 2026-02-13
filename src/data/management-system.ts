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
    titleKo: "이해관계자 및 보안 요구사항 식별서",
    description: "The organization shall determine external and internal issues that are relevant to its purpose and that affect its ability to achieve the intended outcome(s) of its information security management system.",
    descriptionKo: "고객, 정부, 임직원, 주주가 우리 회사 보안에 대해 무엇을 요구하는지 정리한 표입니다.",
    tip: "1. 표 만들기: 노션이나 엑셀에 아래 컬럼으로 표를 만듭니다.\n   - 구분: 고객 / 정부 / 임직원 / 주주\n   - 이해관계자: (예: B2B 고객사, KISA, 개인정보보호위원회, 직원 전체)\n   - 요구사항: (예: '서비스 중단 없는 안정성(SLA)', '개인정보보호법 준수', '연봉 정보 비밀 유지')\n   - 관련 문서: (예: 서비스 이용약관, 취업규칙)\n2. 내용 채우기: 위 예시를 참고하여 3~4줄 정도만 채워 넣습니다.\n3. 증적 저장: 작성된 표를 PDF로 내보내기 하여 저장 (4.1_이해관계자_요구사항.pdf)",
    evidence: "이해관계자 요구사항 표 PDF",
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
    titleKo: "정보보호 정책서",
    description: "Top management shall establish an information security policy that is appropriate to the purpose of the organization.",
    descriptionKo: "회사의 정보보호 방침과 원칙을 문서화한 최상위 정책 문서입니다.",
    tip: "1. 정책서 작성: 노션에 '정보보호 정책서' 페이지를 만들고 다음 내용을 포함합니다.\n   - 정보보호 목표 및 원칙\n   - 적용 범위 (전 임직원, 시스템 등)\n   - 경영진 의지 표명\n2. 네트워크 구성도 작성: AWS VPC 안에 Web Server, WAS, DB 등을 그리고, 전체를 감싸는 점선 박스에 'ISMS 인증 범위'라고 표시합니다.\n3. 증적 저장: 정책서 PDF 및 범위가 표시된 네트워크 구성도 이미지",
    evidence: "정보보호 정책서 PDF, ISMS 인증 범위 네트워크 구성도",
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
    titleKo: "정보보호 위험 평가표",
    description: "When planning for the ISMS, the organization shall consider the issues and requirements and determine the risks and opportunities that need to be addressed.",
    descriptionKo: "우리 회사의 자산(노트북, 서버)이 털렸을 때 얼마나 위험한지 점수(Risk Score)를 매기는 과정입니다.",
    tip: "1. 엑셀 표 작성:\n   - 자산명: 대표이사 노트북 / AWS 운영 DB / 개발자 노트북\n   - 위협: 분실 / 해킹 / 파손\n   - 가능성(A): 1(낮음) ~ 3(높음)\n   - 피해규모(B): 1(낮음) ~ 3(높음)\n   - 위험도(A x B): 1 ~ 9점\n2. 평가: 예를 들어 'AWS 운영 DB'가 '해킹'당하면 피해가 크므로(3), 가능성이 낮아도(1) 위험도는 3점입니다.\n3. DOA 설정: '위험도 6점 이상은 무조건 조치한다'는 기준(수용 가능 위험 수준)을 정해둡니다.\n4. 증적 저장: 작성된 위험 평가 엑셀 파일",
    evidence: "위험 평가표 엑셀 파일",
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
    titleKo: "정보보호 자원 및 예산 할당 내역",
    description: "The organization shall determine the necessary competence of person(s) doing work under its control that affects its information security performance.",
    descriptionKo: "'보안 하라고 말만 하지 않고, 돈(예산)과 사람을 썼다'는 것을 증명합니다.",
    tip: "1. 예산 내역 정리: 보안 관련 지출 내역을 정리합니다.\n   - 보안 소프트웨어 구매비 (백신, 방화벽 등)\n   - 보안 교육비\n   - 외부 컨설팅비\n2. 인력 현황: 보안 업무 담당 인원 및 역할을 문서화합니다.\n3. 증적 저장: 예산 집행 내역서, 조직도 또는 R&R 문서",
    evidence: "보안 예산 집행 내역서, 보안 인력 R&R 문서",
  },
  {
    id: "7.3",
    clause: "7",
    category: "Support",
    categoryKo: "지원",
    title: "Awareness",
    titleKo: "정기 정보보호 교육 결과",
    description: "Persons doing work under the organization's control shall be aware of the information security policy and their contribution to the effectiveness of the ISMS.",
    descriptionKo: "전 직원이 1년에 1회 이상 보안 교육을 듣고, 퀴즈를 풀어 내용을 숙지했음을 증명합니다.",
    tip: "1. 교육 실시: 개인정보보호포털 등의 무료 온라인 교육 링크를 슬랙에 배포하고 '이번 주까지 들으세요' 공지합니다.\n2. 퀴즈 및 서명: 구글 폼(Google Forms)을 만들어 배포합니다.\n   - 내용: 이름, 부서, 교육 이수 여부(O/X), 간단한 OX 퀴즈 5문제, 서명(이름 입력)\n3. 결과 보관: 구글 폼 응답 결과(스프레드시트)를 PDF로 변환하여 저장합니다. (누가 언제 냈는지 타임스탬프가 찍혀 있어야 함)\n4. 증적 저장: 연도_전사_보안교육_결과보고서.pdf",
    evidence: "보안교육 결과보고서 PDF, 구글 폼 응답 스프레드시트",
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
