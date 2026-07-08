# Feature Plan: Change Password

This plan outlines the implementation of the **Change Password** feature, allowing users to update their credentials securely.

## 📅 Phases of Implementation

### Phase 1: Password Logic & Validation (`useSettingsScreen.ts`)
Set up validation checks and password saving handlers.

1. **State Management:**
   - Add state variables:
     - `isPasswordModalVisible` (boolean) to control password modal display.
     - `currentPassword` (string) for validating ownership.
     - `newPassword` (string) for the new password.
     - `confirmPassword` (string) for verifying new password input.
     - `passwordError` (string) for validation feedback.
2. **Handlers:**
   - `openPasswordModal()`: Clears password input states, resets errors, and opens the modal.
   - `closePasswordModal()`: Resets all input states and closes the modal.
   - `savePassword()`:
     - Validate that `currentPassword` matches the active user's current password (from the authenticated Redux user model).
     - Validate that `newPassword` is at least 6 characters.
     - Validate that `newPassword` matches `confirmPassword`.
     - Perform DB update PATCH request: `updateUserById(user.id, { password: newPassword })`.
     - Dispatch Redux state change `updateUser({ password: newPassword })`.
     - Close modal and display a success toast/alert.

---

### Phase 2: Change Password UI Modal (`index.tsx`)
Create a modal dialog overlay for password configuration.

1. **Option Entry List Item:**
   - Add a list row titled "Đổi mật khẩu" (Change Password) with a key/lock icon in the Settings options list.
   - Triggers `openPasswordModal()` on press.
2. **Interactive Form Modal:**
   - Create a overlay panel with input fields:
     - Current Password: `<CustomInput input={currentPassword} setInput={setCurrentPassword} label="Current Password" secureTextEntry leftIcon="lock" />`.
     - New Password: `<CustomInput input={newPassword} setInput={setNewPassword} label="New Password" secureTextEntry leftIcon="lock" />`.
     - Confirm New Password: `<CustomInput input={confirmPassword} setInput={setConfirmPassword} label="Confirm New Password" secureTextEntry leftIcon="lock" />`.
   - Error label: Dynamic rendering of `passwordError`.
   - Actions buttons: "Thay đổi" (Change) and "Hủy" (Cancel).

---

## 🛠️ Planned Files to Modify

*   `src/screens/SettingsScreen/index.tsx`
*   `src/screens/SettingsScreen/useSettingsScreen.ts`
