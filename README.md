# GoLang - LLM 기반 외국어 학습 웹 애플리케이션

> "외국어 공부하러 가자" - Go Stady Language

## 프로젝트 소개

GoLang은 AI를 활용한 외국어 학습 웹 애플리케이션입니다.

### 주요 기능
- **독해 연습**: Gemini API로 맞춤형 외국어 지문 생성 + 문제 풀이
- **작문 첨삭**: AI 기반 외국어 작문 피드백 및 문법 교정
- **어휘 학습**: 간격 반복 알고리즘 기반 플래시카드 복습 시스템

## 기술 스택

- **Framework**: NestJS 11 + TypeScript
- **ORM**: Prisma 6.2.11
- **Database**: PostgreSQL
- **Authentication**: Passport.js (Google OAuth 2.0) + JWT
- **LLM**: Gemini 2.5 Pro / Gemini 3.0 Flash
- **Deployment**: GCP Compute Engine + Docker Compose

## 개발 방식

이 프로젝트는 **AI 페어 프로그래밍(AI Pair Programming)** 방식으로 개발되었습니다.

### AI 활용 범위
- **초기 구현**: Claude를 활용하여 아키텍처 설계, API 구조, UI 컴포넌트 초안 작성
- **코드 리뷰 & 개선**: 생성된 코드를 직접 리뷰하고 리팩토링
- **비즈니스 로직**: AI가 제안한 로직을 검증하고 최적화하여 재작성
- **문제 해결**: 에러 발생 시 원인 분석 및 해결 방안 결정

### 개발자의 역할
- 모든 코드에 대해 설명 가능할 정도로 충분한 이해
- 아키텍처 및 기술 스택 선정 결정
- AI가 생성한 코드의 품질 검증 및 개선
- 테스트, 디버깅, 배포 전 과정 주도

> AI를 보조 도구로 활용하여 개발 속도를 높이고, 더 많은 시간을 설계와 최적화에 집중할 수 있었습니다. 이는 실무에서 AI 도구를 효과적으로 활용하는 역량을 보여줍니다.