# NEXUS-EXPENSE — Hướng Dẫn Code Cho Nhóm

> Tài liệu này dành cho tất cả thành viên trong nhóm khi bắt đầu lập trình màn hình giao diện (screen).
> Vui lòng đọc kỹ trước khi tạo file mới hoặc thực hiện thay đổi.

---

## 1. Cấu Trúc Dự Án Toàn Diện

```
nexus-expense/
├── .agents/                 <- Thư mục chứa cấu hình hướng dẫn tự động của AI Agent
│   └── AGENTS.md            <- Tệp quy chuẩn thiết lập AI Agent Rules
├── assets/                  <- Tài nguyên tĩnh (fonts, icons, images, jsons)
├── db/                      <- Hệ thống Mock Database giả lập qua JSON Server
│   ├── server.js            <- Script khởi chạy cổng dữ liệu API giả lập (Port 5000)
│   ├── users.json           <- Dữ liệu hạt giống cho bảng người dùng
│   ├── categories.json      <- Dữ liệu hạt giống cho bảng danh mục chi tiêu
│   ├── currencies.json      <- Dữ liệu hạt giống cho bảng tiền tệ
│   ├── debtors.json         <- Danh sách con nợ hạt giống (mặc định trống)
│   ├── debts.json           <- Danh sách khoản nợ hạt giống (mặc định trống)
│   └── expenses.json        <- Danh sách chi tiêu hạt giống (mặc định trống)
├── docs/                    <- Thư mục tài liệu hướng dẫn và khuôn mẫu dự án
│   ├── CODING_GUIDE.md      <- Tệp tài liệu hướng dẫn viết code này
│   └── LAYOUT_PATTERNS.md   <- Tài liệu mô tả các khuôn mẫu giao diện (Layout)
├── src/                     <- THƯ MỤC CHỨA TOÀN BỘ MÃ NGUỒN CHÍNH
│   ├── types/index.ts      <- Tất cả TypeScript interfaces (KHÔNG ĐỊNH NGHĨA TRÙNG)
│   ├── redux/
│   │   ├── slices/         <- 5 slices chính: auth, category, transaction, debt, settings
│   │   └── store.ts        <- Redux store (KHÔNG ĐƯỢC TỰ Ý SỬA)
│   ├── services/           <- Các hàm gọi API đến JSON Server (KHÔNG SỬA LOGIC CÓ SẴN)
│   ├── navigation/
│   │   ├── MainStack.tsx   <- Điều hướng gốc của ứng dụng (KHÔNG SỬA)
│   │   ├── HomeStack.tsx   <- Stack chính của ứng dụng sử dụng Stack.Group (CÓ THỂ SỬA GROUP)
│   │   └── OnboardingStack.tsx <- Stack giới thiệu và đăng nhập (KHÔNG SỬA)
│   ├── components/
│   │   ├── atoms/          <- Component giao diện cơ bản (CÓ THỂ SỬ DỤNG, KHÔNG SỬA NỘI DUNG)
│   │   └── molecules/      <- Component giao diện phức tạp dùng chung (CÓ THỂ SỬ DỤNG HOẶC THÊM MỚI KHI CẦN SHARE GIỮA CÁC MÀN HÌNH)
│   ├── hooks/              <- Custom Hooks dùng chung cho nhiều màn hình (VD: tính toán màu số tiền, xử lý giao diện tối...)
│   ├── screens/            <- MỖI THÀNH VIÊN SẼ LÀM VIỆC TRÊN MÀN HÌNH CỦA MÌNH TẠI ĐÂY
│   │   └── [ScreenName]/
│   │       ├── index.tsx   <- CHỈ chứa giao diện (JSX/UI) của màn hình đó
│   │       └── use[ScreenName].ts <- CHỈ chứa logic xử lý (Hook riêng của màn hình đó)
│   ├── utils/              <- Các hàm tiện ích hỗ trợ (CÓ THỂ DÙNG, KHÔNG SỬA)
│   └── constants/          <- Lưu trữ các hằng số cấu hình tĩnh (như categoryIcons.ts)
├── AGENTS.md                <- Tệp cấu hình AI Agent Rules gốc của dự án
├── App.tsx                  <- Component gốc bọc Providers và Navigation của ứng dụng
├── tailwind.config.js       <- File cấu hình các tokens giao diện, màu sắc của Tailwind/NativeWind
├── package.json             <- Danh sách dependencies và script chạy dự án
├── PROJECT_OVERVIEW.md      <- Tổng quan dự án dành cho lập trình viên mới bắt đầu
└── tsconfig.json            <- Cấu hình kiểm soát TypeScript
```

### 💡 Nguyên Tắc Tái Sử Dụng Code (Shared Components, Hooks, Utils, Constants):

- **Shared Components (`src/components/`)**:
  - **Atoms (`src/components/atoms/`)**: Chứa các component giao diện cơ bản nhất (như `Button`, `PrimaryText`, `CustomInput`, `Icons`). **KHÔNG ĐƯỢC** tự ý sửa đổi code bên trong các atoms này để tránh ảnh hưởng đến các màn hình khác.
  - **Molecules (`src/components/molecules/`)**: Chứa các component phức tạp kết hợp từ nhiều atoms (như `TransactionCard`, `HeaderContainer`). Nếu bạn tạo một component mới phục vụ cho **duy nhất 1 màn hình**, hãy khai báo dưới dạng component phụ ngay trong file `index.tsx` của màn hình đó. Nếu component đó **được tái sử dụng ở 2 màn hình trở lên**, hãy chuyển nó vào `src/components/molecules/` để dùng chung.

- **Shared Hooks (`src/hooks/`)**:
  - Nếu logic xử lý trạng thái chỉ phục vụ cho duy nhất 1 màn hình, hãy đặt tại file hook của màn hình đó (`use[ScreenName].ts`).
  - Nếu logic cần sử dụng trên nhiều màn hình (ví dụ: `useAmountColorClass`, `useColorScheme`), hãy khai báo trong thư mục `src/hooks/` và import để tái sử dụng.

- **Shared Utils (`src/utils/`)**:
  - Chứa các hàm logic thuần túy (helpers) không chứa giao diện (ví dụ: định dạng ngày tháng trong `dateUtils.ts`, định dạng số tiền, validation...).
  - **Cấm viết lặp lại** (duplicate) các hàm tính toán logic này trong màn hình, hãy luôn kiểm tra thư mục `src/utils/` và import hàm có sẵn để sử dụng.

- **Shared Constants (`src/constants/`)**:
  - Lưu trữ các biến hằng số, cấu hình tĩnh (ví dụ: danh sách tên icon, cấu hình màu sắc, các giá trị mặc định của hệ thống).
  - Không khai báo các giá trị tĩnh lặp đi lặp lại nhiều lần dưới dạng chuỗi cứng (magic strings/numbers) trong code của màn hình, hãy gom chúng vào thư mục `src/constants/`.

## 2. Cấu Trúc Điều Hướng (Stack Navigation) Và Layout Group

Ứng dụng của chúng ta sử dụng hệ thống React Navigation. Các màn hình trong stack chính (`HomeStack.tsx`) được tổ chức thành 2 nhóm (`Stack.Group`) để tối ưu hóa hiệu ứng chuyển động và định hình bố cục chung:

### ⚙️ Chi tiết mã nguồn điều hướng trong HomeStack.tsx:

```tsx
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Tab điều hướng chính (Home, Reports, Categories, Debts) */}
    <Stack.Screen name="TabNavigator" component={TabStack} />

    {/* Group 1: Các màn hình hiển thị Chi tiết (mặc định trượt từ phải sang) */}
    <Stack.Group>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="EverydayTransactionScreen"
        component={EverydayTransactionScreen}
      />
      <Stack.Screen
        name="CategoryTransactionScreen"
        component={CategoryTransactionScreen}
      />
      <Stack.Screen
        name="IndividualDebtsScreen"
        component={IndividualDebtsScreen}
      />
    </Stack.Group>

    {/* Group 2: Các màn hình Thêm/Sửa dạng Modal (trượt từ dưới lên) */}
    <Stack.Group
      screenOptions={{ presentation: "modal", animation: "slide_from_bottom" }}
    >
      <Stack.Screen
        name="AddTransactionsScreen"
        component={AddTransactionsScreen}
      />
      <Stack.Screen
        name="UpdateTransactionScreen"
        component={UpdateTransactionScreen}
      />
      <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} />
      <Stack.Screen
        name="UpdateCategoryScreen"
        component={UpdateCategoryScreen}
      />
      <Stack.Screen name="AddDebtorScreen" component={AddDebtorScreen} />
      <Stack.Screen name="UpdateDebtorScreen" component={UpdateDebtorScreen} />
      <Stack.Screen name="AddDebtsScreen" component={AddDebtsScreen} />
      <Stack.Screen name="UpdateDebtScreen" component={UpdateDebtScreen} />
    </Stack.Group>
  </Stack.Navigator>
);
```

### 📋 Phân loại nhiệm vụ từng màn hình:

#### Group 1 — Màn hình chi tiết (slide từ phải qua)

Nhóm màn hình hiển thị thông tin chi tiết hoặc cấu hình hệ thống.

- `SettingsScreen` : Màn hình cấu hình cá nhân của người dùng.
- `EverydayTransactionScreen` : Xem danh sách các khoản chi tiêu của một ngày.
- `CategoryTransactionScreen` : Xem danh sách các giao dịch thuộc một danh mục cụ thể.
- `IndividualDebtsScreen` : Xem chi tiết các khoản vay, trả của một người nợ.

#### Group 2 — Màn hình Thêm/Sửa (dạng Modal slide từ dưới lên)

Nhóm màn hình chứa biểu mẫu (form) để người dùng tạo mới hoặc cập nhật dữ liệu.

- `AddTransactionsScreen` / `UpdateTransactionScreen` : Thêm và cập nhật thông tin giao dịch.
- `AddCategoryScreen` / `UpdateCategoryScreen` : Thêm và cập nhật danh mục.
- `AddDebtorScreen` / `UpdateDebtorScreen` : Thêm và cập nhật người nợ.
- `AddDebtsScreen` / `UpdateDebtScreen` : Thêm và cập nhật khoản nợ cụ thể.

---

## 3. Mẫu Khai Báo Màn Hình Chuẩn

### `index.tsx` — Chỉ viết giao diện (UI)

```tsx
// src/screens/HomeScreen/index.tsx
import React from "react";
import { View } from "react-native";
import PrimaryView from "../../components/atoms/PrimaryView";
import HeaderContainer from "../../components/molecules/HeaderContainer";
import PrimaryText from "../../components/atoms/PrimaryText";
import { useHomeScreen } from "./useHomeScreen";

export default function HomeScreen() {
  const { transactions, isLoading, currencySymbol } = useHomeScreen();

  return (
    <PrimaryView useSidePadding={false} style={{ paddingTop: 0 }}>
      <HeaderContainer headerText="Hey, there" />
      <View className="flex-grow mt-6 px-6">
        <PrimaryText className="text-xl font-bold text-on-surface">
          Main content goes here
        </PrimaryText>
      </View>
    </PrimaryView>
  );
}
```

### `use[ScreenName].ts` — Chỉ viết logic (Hook)

```ts
// src/screens/HomeScreen/useHomeScreen.ts
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  selectTransactions,
  setTransactions,
} from "../../redux/slices/transactionSlice";
import { selectUser } from "../../redux/slices/authSlice";
import { selectCurrency } from "../../redux/slices/settingsSlice";
import { getAllExpensesByUserId } from "../../services";
import type { AppDispatch } from "../../redux/store";

export const useHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const transactions = useSelector(selectTransactions);
  const currency = useSelector(selectCurrency);

  useEffect(() => {
    if (!user) return;
    getAllExpensesByUserId(user.id).then((data) => {
      dispatch(setTransactions(data));
    });
  }, [user, dispatch]);

  return {
    transactions,
    currencySymbol: currency?.symbol ?? "$",
    isLoading: false,
  };
};
```

---

## 4. Các Quy Tắc BẮT BUỘC

### ❌ KHÔNG được làm:

1. **Không import từ** `redux/slice/` (thư mục cũ đã bị xóa).
2. **Không sử dụng** `useThemeColors()` để lấy màu tùy biến bằng code JavaScript. Phải sử dụng hoàn toàn `className` của Tailwind.
3. **Không import** `gs` từ `styles/globalStyles` (đã bị xóa bỏ hoàn toàn).
4. **Không truyền** thuộc tính `colors={colors}` vào các component nguyên tử (atom components) vì chúng đã được nâng cấp không dùng prop màu nữa.
5. **Không dùng** hàm `navigate()` từ `navigationUtils`. Hãy sử dụng hook `useNavigation()` chuẩn của React Navigation.
6. **Không import** `SheetManager` từ thư viện `react-native-actions-sheet`.
7. **Không được viết logic xử lý phức tạp** bên trong file `index.tsx`. Mọi logic xử lý sự kiện, lấy dữ liệu, vòng đời component phải viết ở hook tương ứng.
8. **Không sử dụng** `StyleSheet.create()` của React Native. Hãy thay thế bằng Tailwind CSS thông qua `className`.
9. **Không định nghĩa** thêm interface hoặc type riêng lẻ bên trong thư mục screen. Mọi kiểu dữ liệu dùng chung phải khai báo tập trung trong `src/types/index.ts`.

### ✅ ĐƯỢC PHÉP làm:

1. Thêm Tailwind `className` trực tiếp để tạo kiểu dáng (style) cho bất kỳ thẻ `View`, `Text`, `TouchableOpacity`, v.v.
2. Sử dụng tiền tố `dark:` để hỗ trợ hiển thị giao diện tối (Dark Mode). Ví dụ: `className="bg-white dark:bg-gray-900"`.
3. Sử dụng tự do các component chung có trong `components/atoms/` và `components/molecules/`.
4. Định nghĩa các component phụ trợ cực nhỏ ngay trong file `index.tsx` nếu component đó chỉ dùng riêng lẻ bên trong màn hình đó và không chứa logic phức tạp.
5. Sử dụng các hàm chọn dữ liệu (selectors) bên trong hook để lấy dữ liệu từ Redux Store.
6. Gọi trực tiếp các hàm API trong hook thông qua thư mục `services/`.

---

## 5. Cách Chuyển Đổi Giao Diện Từ zero Sang nexus-expense

### Bước 1 — Xóa bỏ các dòng import không còn sử dụng:

```diff
- import { gs, hitSlop } from '../../styles/globalStyles';
- import { Colors } from '../../hooks/useThemeColors';
- import { navigate } from '../../utils/navigationUtils';
```

### Bước 2 — Thay thế thuộc tính `style={gs.xxx}` bằng `className` của Tailwind:

```diff
- <View style={[gs.rowCenter, gs.gap10]}>
+ <View className="flex-row items-center gap-2.5">
```

### Bước 3 — Loại bỏ thuộc tính `colors` khỏi các component dùng chung:

```diff
- <PrimaryButton onPress={fn} colors={colors} buttonTitle="Lưu lại" />
+ <PrimaryButton onPress={fn} buttonTitle="Lưu lại" />
```

### Bước 4 — Chuyển cách điều hướng màn hình sang `useNavigation()`:

```tsx
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../../types";

const navigation =
  useNavigation<NativeStackNavigationProp<MainStackParamList>>();
navigation.navigate("AddTransactionsScreen");
```

### Bước 5 — Thay thế kiểu màu inline sang Tailwind:

```diff
- <Text style={{ color: colors.primaryText, fontSize: 16 }}>Xin chào</Text>
+ <PrimaryText className="text-base text-on-surface">Xin chào</PrimaryText>
```

---

## 6. Thiết Lập Thử Nghiệm Trên Expo Go Khi Dự Án Chưa Hoàn Thiện

### 6.1 Tạo màn hình tạm (WIP Screen) để không lỗi biên dịch:

```tsx
// src/screens/ReportsScreen/index.tsx
import React from "react";
import { View } from "react-native";
import PrimaryText from "../../components/atoms/PrimaryText";

export default function ReportsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-surface-lowest">
      <PrimaryText className="text-on-surface-variant font-inter">
        [Đang hoàn thiện] ReportsScreen
      </PrimaryText>
    </View>
  );
}
```

### 6.2 Khởi động môi trường kiểm thử:

```bash
# Terminal 1 — Khởi động Server giả lập dữ liệu JSON (Bắt buộc phải chạy)
npm run json-server

# Terminal 2 — Khởi động máy chủ Expo Bundler
npm run start
```

Ứng dụng tự động cấu hình địa chỉ IP động dựa trên kết nối của Expo Bundler thông qua thư viện `expo-constants` trong file `src/services/apiHelper.ts`. Bạn không cần phải sửa đổi IP thủ công khi chạy trên điện thoại thật hay máy ảo nữa.

### 7.3 Cách thiết lập chạy thử riêng màn hình đang code (Không được commit dòng này):

```tsx
// MainStack.tsx — Chỉ dùng tạm thời khi bạn cần test nhanh màn hình của mình
const MainStack = () => {
  return <AddTransactionsScreen />; // Gắn trực tiếp component của bạn ở đây để hiển thị ngay khi ứng dụng mở
};
```

---

## 7. Danh Sách Các Shared Components Bắt Buộc Sử Dụng

Để tránh việc viết các thẻ UI thô hoặc tự sinh ra các component riêng lẻ không nhất quán, mọi lập trình viên (hoặc AI) **bắt buộc** phải sử dụng các Component dùng chung dưới đây thay cho các thẻ React Native gốc:

### 1. Thẻ Chữ: `PrimaryText`

- **Vị trí**: `src/components/atoms/PrimaryText.tsx`
- **Thay thế cho**: Thẻ `<Text>` của React Native.
- **Cách sử dụng**:

  ```tsx
  import PrimaryText from '../../components/atoms/PrimaryText';

  // Dùng class Tailwind tự do (không bị đè kích thước/độ đậm chữ nếu không truyền prop size/weight)
  <PrimaryText className="text-xl font-bold text-primary">Nội dung</PrimaryText>

  // Hoặc dùng các prop cấu hình cụ thể
  <PrimaryText size={16} weight="semibold" color="#4f46e5" variant="number">
    123,450
  </PrimaryText>
  ```

- **Các Prop chính**:
  - `size?: number` (fontSize)
  - `weight?: 'regular' | 'medium' | 'semibold' | 'bold'`
  - `variant?: 'text' | 'number'` (Mặc định 'text' tự động áp dụng font Outfit, 'number' tự động áp dụng font Inter).
  - `color?: string` (Mã màu HEX ghi đè)
  - `onPress?: () => void` (Hỗ trợ click)

### 2. Nút Bấm: `PrimaryButton`

- **Vị trí**: `src/components/atoms/PrimaryButton.tsx`
- **Thay thế cho**: Thẻ `<Button>` hoặc các nút `<TouchableOpacity>` tự tạo.
- **Cách sử dụng**:

  ```tsx
  import PrimaryButton from "../../components/atoms/PrimaryButton";

  <PrimaryButton
    onPress={handleLogin}
    buttonTitle="Sign In"
    loading={isLoading}
    size="lg"
  />;
  ```

- **Các Prop chính**:
  - `buttonTitle: string` (Tiêu đề nút)
  - `onPress: () => void`
  - `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` (Mặc định 'primary')
  - `size?: 'sm' | 'md' | 'lg'` (Mặc định 'md')
  - `icon?: string` (Tên icon để hiển thị kèm)
  - `iconPosition?: 'left' | 'right'`
  - `fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold'`
  - `textColor?: string` (Ghi đè màu chữ và màu icon)

### 3. Ô Nhập Dữ Liệu: `CustomInput`

- **Vị trí**: `src/components/atoms/CustomInput.tsx`
- **Thay thế cho**: Thẻ `<TextInput>` thô.
- **Cách sử dụng**:

  ```tsx
  import CustomInput from "../../components/atoms/CustomInput";

  <CustomInput
    input={email}
    setInput={setEmail}
    placeholder="Enter your email"
    label="Email Address"
    leftIcon="mail"
  />;
  ```

- **Các Prop chính**:
  - `input: string` / `setInput: (val: string) => void`
  - `placeholder: string`
  - `label?: string` (Nhãn hiển thị phía trên ô nhập)
  - `schema?: ZodType<string>` (Lược đồ kiểm tra dữ liệu bằng Zod, lỗi sẽ tự động hiển thị ngay dưới ô nhập khi người dùng nhập sai).
  - `leftIcon?: string` / `rightIcon?: string` (Hiển thị icon kèm trong ô nhập)
  - `disabled?: boolean`

### 4. Thanh Tiêu Đề Màn Hình: `AppHeader`

- **Vị trí**: `src/components/atoms/AppHeader.tsx`
- **Thay thế cho**: Các thanh Header/NavBar tự chế ở đầu màn hình.
- **Cách sử dụng**:

  ```tsx
  import AppHeader from "../../components/atoms/AppHeader";

  <AppHeader onPress={() => navigation.goBack()} text="Settings" />;
  ```

- **Các Prop chính**:
  - `text: string` (Tiêu đề Header)
  - `onPress?: () => void` (Hành động khi nhấn nút quay lại. Nếu truyền, nút Back sẽ tự động xuất hiện).
  - `subtitle?: string` (Phụ đề hiển thị nhỏ phía dưới tiêu đề chính)

### 5. Bộ Khung Bao Màn Hình: `PrimaryView`

- **Vị trí**: `src/components/atoms/PrimaryView.tsx`
- **Thay thế cho**: Thẻ `<SafeAreaView>` hoặc `<View>` ngoài cùng của màn hình.
- **Đặc tính**: Tự động xử lý chiều cao tai thỏ (Safe Area) và hiển thị thanh trạng thái (StatusBar) đồng bộ.
- **Các Prop chính**:
  - `useSidePadding?: boolean` (Có đệm lề trái phải `px-[4%]` hay không)
  - `useBottomPadding?: boolean` (Có đệm lề dưới hay không)

### 6. Màn Hình Trống: `EmptyState`

- **Vị trí**: `src/components/atoms/EmptyState.tsx`
- **Thay thế cho**: Các giao diện báo trống tự viết.
- **Các Prop chính**:
  - `type: 'Transactions' | 'Insights' | 'Debts' | 'Categories'`
  - `message?: string` (Nội dung thông báo tùy biến)
  - `actionButton?: ReactNode` (Nút bấm hành động đi kèm)

### 7. Vòng Quay Tải Trang: `CustomLoader`

- **Vị trí**: `src/components/atoms/CustomLoader.tsx`
- **Thay thế cho**: Thẻ `<ActivityIndicator>` thô.
- **Các Prop chính**:
  - `message?: string` (Nội dung chữ hiển thị nhỏ phía dưới spinner)

---

## 8. Danh Sách Kiểm Tra (Checklist) Trước Khi Commit Code

- [ ] File `index.tsx` chỉ chứa thẻ giao diện hiển thị JSX, không chứa hook của React trực tiếp như `useState`, `useEffect`.
- [ ] File `use[ScreenName].ts` đảm nhận việc xử lý logic và cung cấp dữ liệu cho màn hình.
- [ ] Không còn sự xuất hiện của dòng import `gs` hoặc `Colors`.
- [ ] Không sử dụng thẻ style lồng ghép phức tạp, thay thế toàn bộ bằng `className`.
- [ ] Các kiểu dữ liệu khai báo mới đã được tích hợp đầy đủ vào `src/types/index.ts`.
- [ ] Lệnh kiểm tra lỗi biên dịch `npm run ts:check` chạy thành công không có bất kỳ lỗi nào.
- [ ] Màn hình tạm (Placeholder) của các thành viên khác không bị xóa bỏ.
