"use client";

import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { SpotlightCard } from "@/shared/ui/spotlight-card";
import { GradientBorder } from "@/shared/ui/gradient-border";
import { CircularProgress } from "@/shared/ui/progress";
import { StatCard } from "@/shared/ui/animated-counter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient mesh */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(at 80% 20%, rgba(94, 92, 230, 0.2) 0%, transparent 50%),
              radial-gradient(at 40% 80%, rgba(124, 58, 237, 0.2) 0%, transparent 50%)
            `,
          }}
        />

        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-foreground"
          >
            <span className="gradient-text">ISO Compliance Hub</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button variant="ghost">로그인</Button>
            <Button variant="glow">시작하기</Button>
          </motion.div>
        </nav>

        <div className="relative z-10 mx-auto max-w-6xl px-8 py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl"
          >
            ISO 27001 인증을
            <br />
            <span className="gradient-text">더 쉽게</span> 관리하세요
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-foreground-secondary"
          >
            컨트롤 체크리스트, 증빙 문서 관리, 마감일 알림까지.
            <br />
            모든 컴플라이언스 업무를 한 곳에서 관리하세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Button size="lg" variant="glow">
              무료로 시작하기
            </Button>
            <Button size="lg" variant="outline">
              데모 보기
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="mx-auto max-w-6xl px-8 py-16">
        <div className="grid gap-6 md:grid-cols-4">
          <StatCard label="관리 중인 컨트롤" value={114} suffix="개" />
          <StatCard label="완료된 태스크" value={87} suffix="%" trend={{ value: 12, isPositive: true }} />
          <StatCard label="업로드된 증빙" value={256} suffix="건" />
          <StatCard label="다음 마감일" value={7} prefix="D-" />
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            모든 기능을 <span className="gradient-text">한 곳에서</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground-secondary">
            ISO 27001 인증 준비에 필요한 모든 도구를 제공합니다
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <SpotlightCard className="p-6">
            <h3 className="text-xl font-semibold text-foreground">컨트롤 체크리스트</h3>
            <p className="mt-2 text-foreground-secondary">
              114개 Annex A 컨트롤을 체계적으로 관리하고 진행 상황을 한눈에 파악하세요.
            </p>
            <div className="mt-6">
              <CircularProgress value={67} size={80} strokeWidth={6} />
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <h3 className="text-xl font-semibold text-foreground">증빙 문서 관리</h3>
            <p className="mt-2 text-foreground-secondary">
              드래그 앤 드롭으로 간편하게 업로드하고, 컨트롤별로 자동 분류됩니다.
            </p>
            <div className="mt-6 space-y-2">
              {["정보보안정책.pdf", "접근권한현황.xlsx", "감사로그.csv"].map((file) => (
                <div
                  key={file}
                  className="rounded-lg bg-background-tertiary px-3 py-2 text-sm text-foreground-secondary"
                >
                  {file}
                </div>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <h3 className="text-xl font-semibold text-foreground">마감일 알림</h3>
            <p className="mt-2 text-foreground-secondary">
              D-30, D-7, D-Day 자동 알림으로 중요한 일정을 놓치지 마세요.
            </p>
            <div className="mt-6 space-y-2">
              {[
                { task: "보안 교육 완료", dday: "D-7" },
                { task: "취약점 점검", dday: "D-14" },
                { task: "정책 검토", dday: "D-30" },
              ].map((item) => (
                <div
                  key={item.task}
                  className="flex items-center justify-between rounded-lg bg-background-tertiary px-3 py-2"
                >
                  <span className="text-sm text-foreground-secondary">{item.task}</span>
                  <span className="text-sm font-medium text-primary">{item.dday}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-8 py-24">
        <GradientBorder animate className="p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground-secondary">
            14일 무료 체험 후 결정하세요. 신용카드 없이 시작할 수 있습니다.
          </p>
          <div className="mt-8">
            <Button size="xl" variant="glow">
              무료 체험 시작
            </Button>
          </div>
        </GradientBorder>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background-secondary px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="text-foreground-secondary">
              © 2024 ISO Compliance Hub. All rights reserved.
            </span>
            <div className="flex gap-6 text-sm text-foreground-muted">
              <a href="#" className="hover:text-foreground">이용약관</a>
              <a href="#" className="hover:text-foreground">개인정보처리방침</a>
              <a href="#" className="hover:text-foreground">문의하기</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
