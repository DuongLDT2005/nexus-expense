# Feature Plan: Settings Screen

This plan outlines the implementation of the Settings screen UI and logic, following the Hook Pattern (UI/Logic separation) and Tailwind CSS styling.

## 📅 Phases of Implementation

### Phase 1: Settings Screen Refactoring (Hook Pattern & Base UI)
In this phase, we will refactor the existing Settings Screen to separate UI and logic completely.

1. **Logic (`useSettingsScreen.ts`):**
   - Extract settings state selection (user profile, currency code).
   - Implement the `handleLogout` function using the Redux action dispatch.
   - Return clean state properties and callback handlers.
2. **UI (`index.tsx`):**
   - Use returned values from `useSettingsScreen`.
   - Ensure the main container uses `<PrimaryView useSidePadding={false}>` and `<AppHeader>` (Khuôn mẫu 2).
   - Render the profile header card displaying user initials, full name, and email.
   - Render the list card with choices for:
     - **Primary Currency**: Displays active currency and navigates to `ChooseCurrencyScreen`.
     - **Appearance (Theme)**: Click displays options to change theme (Light / Dark / System).
     - **Update Profile** (Link to open profile edit).
     - **Change Password** (Link to open password change modal).
   - Render the custom red-tinted Log Out button using `<PrimaryButton>`.

---

### Phase 2: Dark Mode Theme Toggle
Allow users to switch between system, light, and dark modes.

1. **Logic (`useSettingsScreen.ts`):**
   - Add state: `themeSelectionVisible` (boolean) to show theme selection controls.
   - Implement `handleThemeChange(themeValue: 'light' | 'dark' | 'system')`:
     - Save theme value using `updateUserById(user.id, { theme: themeValue })` in database.
     - Dispatch `updateUser({ theme: themeValue })` to update Redux auth state.
     - Dispatch `setTheme(themeValue)` (settingsSlice) to update active system styling.
2. **UI (`index.tsx`):**
   - Add a "Giao diện (Theme)" option item in the settings card list with a sun/moon icon.
   - Render the selected theme text ("Sáng" / "Tối" / "Hệ thống").
   - Clicking opens an action overlay sheet or dropdown selector to choose the theme.

---

## 🛠️ Planned Files to Modify

*   `src/screens/SettingsScreen/index.tsx`
*   `src/screens/SettingsScreen/useSettingsScreen.ts`
