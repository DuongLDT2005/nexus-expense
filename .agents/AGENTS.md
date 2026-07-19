# AI Agent Rules for Nexus Expense Project

This file contains rules and guidelines that all AI agents must follow when writing code for this project.

## 📖 1. Core Rule & Documentation

- **Read Existing Documentation First:** Before implementing any feature, refactoring, or making modifications to the codebase, you MUST read and follow the rules, guidelines, patterns, and conventions defined in these files:
  - [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) - Project overview, features, and setup instructions.
  - [CODING_GUIDE.md](../docs/CODING_GUIDE.md) - Coding guidelines, Hook Pattern (UI/Logic separation), check list, and rules.
  - [LAYOUT_PATTERNS.md](../docs/LAYOUT_PATTERNS.md) - Cấu trúc layout, 4 khuôn mẫu dựng màn hình, và bảng chuyển đổi style Tailwind.
- **Refer to "zero" business logic:** When writing code or implementing features, you must read the corresponding business flows and logic in the sister project "zero" (located in the sibling directory `../zero`) to ensure correct business flow compliance. Do NOT write markdown links or direct paths pointing to the "zero" project in your code comments or documentation.

## ⚙️ 2. Build & Environment

- **Expo SDK 54 & TypeScript:** Keep TypeScript strict checks clean. Proactively run `npm run ts:check` to ensure no errors are introduced.

## 🎨 3. Stitch UI Design System Integration

- Always use the shared project ID `3176465779063770102` when working with Stitch MCP tools.
- **Typography Consistency:** Avoid using standard React Native `<Text>` components; always prefer the custom `<PrimaryText>` component for layout text to enforce uniform theme typography.
- **UI Screen Synchronization:** Keep major list screens (like `CategoryScreen` and `DebtsScreen`) synchronized in layout. They must feature:
  - Header title matching the screen's focus.
  - Bento-style summary cards at the top using matching borders, shadows (`bg-surface-lowest border border-surface-high rounded-md p-6 shadow-sm`), and clean spacing.
  - Lists rendered as swipeable cards (using `ReanimatedSwipeable`) supporting edit and delete actions.
  - Floating Action Buttons (FAB) styled consistently (`w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-90` with the `plus` icon).
