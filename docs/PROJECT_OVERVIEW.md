# 🌟 NEXUS EXPENSE — TỔNG QUAN DỰ ÁN DÀNH CHO NGƯỜI MỚI BẮT ĐẦU

Chào mừng bạn đến với **Nexus Expense**! Tài liệu này được biên soạn để giúp một lập trình viên mới tiếp cận dự án có thể dễ dàng hiểu được cấu trúc, tính năng, kiến trúc kỹ thuật và cách vận hành dự án này từ con số 0.

---

## 1. Giới Thiệu Chung

**Nexus Expense** là một ứng dụng di động đa nền tảng (Android & iOS) được xây dựng bằng **React Native (Expo SDK 54)** và **TypeScript**.
Ứng dụng giúp người dùng:

- **Quản lý chi tiêu**: Ghi chép các khoản chi tiêu hàng ngày theo từng ngày cụ thể.
- **Quản lý danh mục**: Phân loại chi tiêu (Ăn uống, Mua sắm, Di chuyển...) với màu sắc và biểu tượng trực quan.
- **Quản lý nợ nần**: Theo dõi danh sách con nợ (`Debtor`) và chi tiết từng khoản nợ (`Debt`), phân biệt rõ ràng nợ vay/cho vay.

---

## 2. Công Nghệ Sử Dụng (Tech Stack)

- **Core**: [React Native](https://reactnative.dev/) (phiên bản 0.81) kết hợp với bộ công cụ phát triển [Expo](https://expo.dev/) (SDK 54).
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/) đảm bảo an toàn kiểu dữ liệu chặt chẽ.
- **Quản lý trạng thái (State Management)**: [Redux Toolkit](https://redux-toolkit.js.org/) để quản lý dữ liệu toàn cục (Danh mục, Chi tiêu, Khoản nợ, Cài đặt hệ thống).
- **Giao diện & Thiết kế**: [Tailwind CSS / NativeWind v4](https://www.nativewind.dev/) - Thiết kế giao diện hiện đại, sang trọng, hỗ trợ chế độ tối (Dark Mode) tự động.
- **Cơ sở dữ liệu mô phỏng**: [JSON Server](https://github.com/typicode/json-server) làm REST API giả lập lưu trữ dữ liệu tại chỗ qua các tệp tin JSON trong thư mục `db/`.

---

## 3. Cấu Trúc Thư Mục Dự Án

Dưới đây là sơ đồ tổ chức thư mục của dự án và ý nghĩa của từng phần:

```text
nexus-expense/
├── .agents/                 # Chứa các quy định tự động dành cho AI Assistant
├── assets/                  # Tài nguyên tĩnh: font chữ, hình ảnh, icon
├── db/                      # Cơ sở dữ liệu JSON và tập tin chạy JSON Server
│   ├── categories.json      # Danh sách danh mục chi tiêu
│   ├── currencies.json      # Danh sách tiền tệ hỗ trợ
│   ├── users.json           # Thông tin người dùng đăng nhập mẫu
│   └── server.js            # Node script khởi chạy mock database API (Port 5000)
├── docs/                    # Tài liệu hướng dẫn code và khuôn mẫu thiết kế
│   ├── CODING_GUIDE.md      # Quy tắc viết code
│   └── LAYOUT_PATTERNS.md   # Hướng dẫn chi tiết 4 khuôn mẫu dựng giao diện
├── src/                     # MÃ NGUỒN CHÍNH CỦA ỨNG DỤNG
│   ├── components/          # Các Component giao diện dùng chung
│   │   ├── atoms/           # Component nhỏ nhất (Button, Icon, Input, Text...)
│   │   └── molecules/       # Component lắp ghép (TransactionCard, AppHeader...)
│   ├── constants/           # Các hằng số cấu hình hệ thống
│   ├── navigation/          # Thiết lập điều hướng (Routing, Stack, Tab Navigator)
│   ├── redux/               # Nơi quản lý dữ liệu tập trung (Store & Slices)
│   ├── screens/             # Toàn bộ màn hình hiển thị trong App
│   ├── services/            # Hàm gọi API đến JSON Server để lấy/sửa dữ liệu
│   └── types/               # Khai báo kiểu dữ liệu TypeScript (Interfaces)
├── AGENTS.md                # Quy tắc viết code bắt buộc
├── package.json             # Khai báo các thư viện phụ thuộc (Dependencies)
├── tailwind.config.js       # File cấu hình màu sắc, phông chữ của Tailwind CSS
└── tsconfig.json            # Cấu hình kiểm lỗi biên dịch của TypeScript
```

---

## 4. Ba Nguyên Tắc Phát Triển Bắt Buộc (Conventions)

### 🔴 Nguyên tắc 1: Tách biệt Giao diện và Logic (Hook Pattern)

Khi tạo hoặc sửa một màn hình hiển thị (Screen), bạn không được viết các logic phức tạp (gọi API, quản lý State, xử lý logic tính toán...) chung với giao diện hiển thị JSX. Màn hình phải được tách đôi thành 2 file:

1. **File UI** (`src/screens/.../ScreenName/index.tsx`): Chỉ chứa mã JSX hiển thị giao diện dùng Tailwind class.
2. **File Logic** (`src/screens/.../ScreenName/useScreenName.ts`): Chứa toàn bộ React hooks, Redux selector/dispatch và các hàm xử lý hành động, sau đó trả về dữ liệu cho file UI sử dụng.

### 🟢 Nguyên tắc 2: Tự render Header và Footer (Tab Bar)

Ứng dụng sử dụng cấu trúc ẩn thanh tiêu đề hệ thống mặc định (`headerShown: false`) trên mọi Navigator:

- **Footer (Thanh công cụ Tab dưới cùng)**: Được điều khiển qua `Tab.Navigator` ở `HomeStack.tsx`.
- **Header (Thanh tiêu đề trên cùng)**: Được thiết kế riêng bằng các component atom `<AppHeader>` (nếu có nút quay lại) hoặc `<HeaderContainer>` (nếu là trang chính có ảnh đại diện) và đặt ngay bên trong file `index.tsx` của Screen đó.

### 🔵 Nguyên tắc 3: Sử dụng Icon đăng ký tập trung

Không sử dụng file ảnh tĩnh (`PNG`/`JPG`) hay code SVG trực tiếp để tạo icon. Ứng dụng đã có sẵn một hệ thống Lucide Icons đăng ký tập trung tại [IconRegistry.ts](file:///d:/Yna/Study/TERM_7/MMA301/sample/nexus-expense/src/components/atoms/IconRegistry.ts).

- Hãy dùng component `<Icon name="tên-icon" size={24} color="#..." />` từ [Icons.tsx](file:///d:/Yna/Study/TERM_7/MMA301/sample/nexus-expense/src/components/atoms/Icons.tsx) để hiển thị.

---

## 5. Hướng Dẫn Chạy Dự Án Cho Người Mới

Để khởi chạy dự án lần đầu trên máy tính của bạn, hãy thực hiện lần lượt các bước sau:

### Bước 1: Cài đặt thư viện

Mở Terminal tại thư mục dự án `nexus-expense` và chạy lệnh sau để tải các package cần thiết:

```bash
npm install
```

### Bước 2: Khởi động Mock Database (API Server)

Ứng dụng cần cơ sở dữ liệu giả lập chạy trước để có thể hiển thị dữ liệu lên màn hình. Hãy chạy lệnh:

```bash
npm run json-server
```

Lệnh này sẽ chạy một server Node.js tại địa chỉ `http://localhost:5000` quản lý các file trong thư mục `db/`.

### Bước 3: Khởi động Ứng dụng Expo

Mở thêm một cửa sổ Terminal mới tại thư mục `nexus-expense` và chạy:

```bash
npm run start
```

Quét mã QR hiển thị trên màn hình bằng ứng dụng **Expo Go** (trên điện thoại thật) hoặc khởi chạy giả lập Android/iOS trên máy tính để bắt đầu trải nghiệm ứng dụng.

### Bước 4: Kiểm tra lỗi TypeScript trước khi nộp bài

Trước khi lưu trữ hoặc nộp mã nguồn, hãy đảm bảo chạy lệnh kiểm tra lỗi TypeScript sau để tránh lỗi cú pháp:

```bash
npm run ts:check
```

Nếu lệnh chạy và không hiển thị thông báo lỗi nào, code của bạn đã hoàn toàn hợp lệ!

---

## 6. Sơ Đồ Điều Hướng & Luồng Di Chuyển Màn Hình (Screen Navigation Flow)

Hệ thống điều hướng trong **Nexus Expense** được chia thành 2 luồng stack chính thông qua [MainStack.tsx]:

1. **Onboarding / Authentication Flow ([OnboardingStack.tsx])**: Khi người dùng chưa đăng nhập.
2. **Main Application Flow [HomeStack.tsx]**: Khi người dùng đã đăng nhập thành công.

Dưới đây là chi tiết luồng di chuyển giữa các màn hình:

### 6.1. Luồng Xác Thực (Onboarding & Auth Flow)

- **WelcomeScreen (Màn hình chào mừng)**:
  - Nút "Get Started" ➔ Chuyển hướng đến **RegisterScreen**.
  - Nút "I already have an account" ➔ Chuyển hướng đến **LoginScreen**.
- **RegisterScreen (Đăng ký tài khoản)**:
  - Nhập thông tin & Click "Register" ➔ Đăng ký thành công, tự động lưu thông tin user vào Redux và chuyển trực tiếp sang **TabStack** (Main App).
  - _Lưu ý_: Sau khi register thành công và login lần đầu thì chuyển hướng qua **ChooseCurrencyScreen** trước khi vào Main App để người dùng thiết lập đơn vị tiền tệ mặc định.
  - Link "Already have an account? Log In" ➔ Chuyển hướng sang **LoginScreen**.
- **ChooseCurrencyScreen (Chọn tiền tệ mặc định)**:
  - Màn hình tuỳ chọn thiết lập đơn vị tiền tệ (USD, VND, EUR...) sau khi đăng ký hoặc có thể gọi từ **SettingsScreen** để thay đổi cấu hình tiền tệ.
- **LoginScreen (Đăng nhập)**:
  - Nhập thông tin & Click "Login" ➔ Đăng nhập thành công, cập nhật Redux state và tự động điều hướng sang **TabStack**.
  - Link "Don't have an account? Sign Up" ➔ Chuyển hướng sang **RegisterScreen**.

---

### 6.2. Luồng Trang Chính & Tabs (TabStack)

Sau khi đăng nhập, người dùng sẽ ở giao diện chính gồm thanh điều hướng dưới cùng (Bottom Tab Bar) chứa 4 tab chính:

1. **HomeScreen (Trang chủ)**: Hiển thị tổng quan số dư, biểu đồ chi tiêu gần đây, và danh sách các giao dịch.
2. **ReportsScreen (Báo cáo)**: Biểu đồ phân tích chi tiết thu nhập, chi tiêu theo tuần/tháng/năm.
3. **CategoryScreen (Danh mục)**: Quản lý các nhóm chi tiêu (Ăn uống, Giải trí...).
4. **DebtsScreen (Ghi nợ)**: Quản lý danh sách các con nợ và tình trạng nợ nần.

---

### 6.3. Chi Tiết Các Nhánh Di Chuyển Phụ (Sub-flows)

#### A. Từ Tab HomeScreen (Trang chủ)

- **Nút Settings (Icon bánh răng)** ➔ Điều hướng sang **SettingsScreen** (Cài đặt tiền tệ, đổi giao diện tối/sáng, đăng xuất).
- **Nút Add Transaction (Icon dấu +)** ➔ Điều hướng sang **AddTransactionsScreen** (Thêm giao dịch mới).
- **Click vào một giao dịch cụ thể** ➔ Điều hướng sang **UpdateTransactionScreen** (Sửa/Xóa giao dịch).
- **Click vào một ngày cụ thể trên danh sách** ➔ Điều hướng sang **EverydayTransactionScreen** (Xem toàn bộ giao dịch của ngày đó).

#### B. Từ Tab CategoryScreen (Quản lý Danh mục)

- **Nút Thêm danh mục (+)** ➔ Điều hướng sang **AddCategoryScreen** (Tạo danh mục mới kèm chọn icon & màu sắc).
- **Click vào biểu tượng sửa trên một danh mục** ➔ Điều hướng sang **UpdateCategoryScreen** (Chỉnh sửa tên, màu sắc, icon của danh mục hoặc vô hiệu hóa).
- **Click vào dòng danh mục** ➔ Điều hướng sang **CategoryTransactionScreen** (Xem danh sách tất cả giao dịch thuộc danh mục đó).

#### C. Từ Tab DebtsScreen (Quản lý Nợ)

- **Nút Thêm người nợ (+)** ➔ Điều hướng sang **AddDebtorScreen** (Tạo hồ sơ con nợ mới).
- **Click giữ hoặc bấm nút sửa con nợ** ➔ Điều hướng sang **UpdateDebtorScreen** (Sửa thông tin con nợ).
- **Click vào một con nợ cụ thể** ➔ Điều hướng sang **IndividualDebtsScreen** (Xem chi tiết tất cả các khoản nợ của người này).
  - **Tại IndividualDebtsScreen**:
    - **Nút thêm khoản nợ (+)** ➔ Điều hướng sang **AddDebtsScreen** (Tạo khoản nợ mới với người này).
    - **Click vào một khoản nợ** ➔ Điều hướng sang **UpdateDebtScreen** (Sửa/xóa thông tin chi tiết khoản nợ).

---
