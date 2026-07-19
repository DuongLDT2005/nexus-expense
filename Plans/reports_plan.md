# Feature Plan: Reports Screen Implementation

This plan outlines the detailed structure and step-by-step phases to build the Reports screen, conforming to the Hook Pattern (UI/Logic separation) and Tailwind CSS design styling.

## 📅 Phases of Implementation

### Phase 1: Logic Integration (`useReportsScreen.ts`)
In this phase, we will implement the calculation hooks and Redux selectors.

1. **State & Redux Selectors:**
   - Retrieve the current user (`selectUser`) to check permissions and settings.
   - Retrieve all expenses (`selectTransactions`) and the selected month (`selectSelectedMonth`) from the `transactionSlice`.
2. **Analytics & Calculations:**
   - Filter transactions based on the selected month format `YYYY-MM`.
   - Calculate total expenses for the selected month.
   - Group expenses by category (e.g. iterate over expenses, look up their category name, color, and icon).
   - For each category, compute its total spending and percentage: `(categoryTotal / totalExpense) * 100`.
   - Sort the categories list in descending order of total spending.
3. **Month Selector Handling:**
   - Implement handlers to cycle the selected month forward or backward using Redux action `setSelectedMonth`.

---

### Phase 2: Reports Base UI Setup (`index.tsx`)
Set up the framework layout and base cards.

1. **Screen Layout (Khuôn mẫu 1 - Tab Screen):**
   - Wrapper component: `<PrimaryView useSidePadding={false} style={{ paddingTop: 0 }}>`.
   - Custom Header: `<HeaderContainer>` to show the header title and user initials icon.
2. **Month Navigation Bar:**
   - Render a date selection row at the top with left/right Chevron buttons and the current month name display (e.g., "Tháng 07, 2026").
3. **Analytics Card:**
   - Renders a prominent card displaying "Tổng chi tiêu" (Total Expenses) formatted with the currency symbol (retrieved from Redux `selectCurrency`).

---

### Phase 3: Custom Category Breakdown Chart (Custom UI)
Since the project has no native chart dependency (such as `react-native-chart-kit`), we will create a high-fidelity custom visual list using Tailwind progress bars.

1. **Progress Bar Component (rendered per category):**
   - Left side: Category icon circle with icon and category color tint background.
   - Middle: Category Name, percentage share, and a horizontal progress track containing a colored bar indicating the category's percentage width (`style={{ width: `${percent}%` }}`).
   - Right side: Total amount spent in that category.
2. **Glassmorphism Styling:**
   - Wrap the chart and list inside a container card styled with a light border, subtle shadows, and rounded corners (`bg-surface-lowest border border-outline-variant/30 rounded-3xl p-5 shadow-sm`).

---

### Phase 4: Empty States and Loaders
Gracefully handle loading states and empty transaction months.

1. **Empty State:**
   - When total expenses are 0, hide the chart and show `<EmptyState type="Insights" message="Chưa có dữ liệu chi tiêu cho tháng này." />`.
2. **Loading State:**
   - Show `<CustomLoader>` when data is being processed or fetched from the server.

---

## 🛠️ Planned Files to Modify

*   `src/screens/ReportsScreen/index.tsx`
*   `src/screens/ReportsScreen/useReportsScreen.ts`
