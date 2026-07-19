# Feature Plan: Update Profile

This plan outlines the implementation of the **Update Profile** feature, allowing users to modify their full name and email address from the Settings screen.

## 📅 Phases of Implementation

### Phase 1: Update Profile Logic Integration (`useSettingsScreen.ts`)
Set up logic to handle inputs, validations, and database updates for profile modifications.

1. **State Management:**
   - Add state variables:
     - `isProfileModalVisible` (boolean) to manage modal overlay.
     - `editName` (string) to bind name input.
     - `editEmail` (string) to bind email input.
     - `profileError` (string) to display validation errors.
2. **Handlers:**
   - `openProfileModal()`: Sets `editName` and `editEmail` to the current user's values from Redux, resets any error messages, and sets visibility to true.
   - `closeProfileModal()`: Clears validation errors and hides the modal overlay.
   - `saveProfile()`:
     - Trim inputs.
     - Validate that the name is at least 3 characters and contains only letters and spaces using `nameSchema` from `validationSchema.ts`.
     - Validate that email is not empty and conforms to basic email regex.
     - Send a PATCH request to update the user in the database: `updateUserById(user.id, { fullName: editName, email: editEmail })`.
     - Dispatch Redux action `updateUser({ fullName: editName, email: editEmail })` to update the profile card across all screens (like HomeScreen).
     - Close modal on successful update.

---

### Phase 2: Update Profile UI Modal (`index.tsx`)
Create a high-fidelity modal dialog for editing profile information.

1. **Profile Card Edit Button:**
   - Add a small edit pen icon button on the top-right of the User Profile Card inside `SettingsScreen`.
   - Binds to `openProfileModal()`.
2. **Interactive Form Overlay (Modal):**
   - Create a popup modal using React Native's `<Modal>` or a custom sheet component.
   - Style the modal using Glassmorphic panels with dark backgrounds (`bg-surface-lowest border border-outline-variant/30 rounded-3xl p-6`).
   - Add form input controls:
     - Full Name: `<CustomInput input={editName} setInput={setEditName} label="Full Name" leftIcon="user" />`.
     - Email: `<CustomInput input={editEmail} setInput={setEditEmail} label="Email Address" leftIcon="mail" />`.
   - Error Banner: Display `profileError` if validation fails.
   - Action Buttons:
     - **Save**: Calls `saveProfile()`.
     - **Cancel**: Calls `closeProfileModal()`.

---

## 🛠️ Planned Files to Modify

*   `src/screens/SettingsScreen/index.tsx`
*   `src/screens/SettingsScreen/useSettingsScreen.ts`
