# AI Agent Rules for Nexus Expense Project

This file contains rules and guidelines that all AI agents must follow when writing code for this project.

## 📖 1. Core Rule & Documentation

- **Read Existing Documentation First:** Before implementing any feature, refactoring, or making modifications to the codebase, you MUST read and follow the rules, guidelines, patterns, and conventions defined in these files:
  - [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) - Project overview, features, and setup instructions.
  - [CODING_GUIDE.md](../docs/CODING_GUIDE.md) - Coding guidelines, Hook Pattern (UI/Logic separation), check list, and rules.
  - [LAYOUT_PATTERNS.md](../docs/LAYOUT_PATTERNS.md) - Cấu trúc layout, 4 khuôn mẫu dựng màn hình, và bảng chuyển đổi style Tailwind.
- **Refer to "zero" business logic:** When writing code or implementing features, you must read the corresponding business flows and logic in the sister project "zero" (located in the sibling directory `../zero`) to ensure correct business flow compliance. Do NOT write markdown links or direct paths pointing to the "zero" project in your code comments or documentation.
- **Do NOT modify Welcome, Login, Register, Choose Currency screens:** The user has already finalized the logic and UI for: `WelcomeScreen`, `LoginScreen`, `RegisterScreen`, and `ChooseCurrencyScreen`. Under no circumstances should these 4 screens or their corresponding logic hooks (`useWelcomeScreen`, `useLoginScreen`, `useRegisterScreen`, `useChooseCurrencyScreen`) be modified.

## ⚙️ 2. Build & Environment

- **Expo SDK 54 & TypeScript:** Keep TypeScript strict checks clean. Proactively run `npm run ts:check` to ensure no errors are introduced.

## 🎨 3. Stitch UI Design System Integration

- **Shared Stitch Project:** Always use the shared project ID `3176465779063770102` when working with Stitch MCP tools.
