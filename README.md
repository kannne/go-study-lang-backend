# GoLang - LLM 기반 외국어 학습 웹 애플리케이션

> "외국어 공부하러 가자" - Go Stady Language

## 📖 프로젝트 소개

GoLang은 LLM을 활용한 외국어 학습 웹 애플리케이션입니다.

### 주요 기능
- **독해 연습**: Gemini API로 맞춤형 외국어 지문 생성 + 문제 풀이
- **작문 첨삭**: LLM 기반 외국어 작문 피드백 및 문법 교정
- **어휘 학습**: 간격 반복 알고리즘 기반 플래시카드 복습 시스템

## 🛠️ 기술 스택

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Nest.js 11 + TypeScript
- **Styling**: Tailwind CSS 3.4.1 + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **LLM**: Gemini 2.5 Pro / Flash
- **일본어 처리**: Kuroshiro, wanakana
- **Deployment**: GCP Compute Engine + Docker Compose