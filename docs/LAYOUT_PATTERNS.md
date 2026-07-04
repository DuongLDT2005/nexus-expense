# CẤU TRÚC LAYOUT — So Sánh zero Và nexus-expense

Tài liệu này phân tích cấu trúc dựng khung hình (Layout) từ dự án mẫu **zero** và cách chuyển đổi sang cấu trúc chuẩn mới dùng Tailwind CSS trên dự án **nexus-expense**.

---

## 🛠️ Nguyên Lý Layout Nhóm (Cách 2: Dùng Stack.Group)

Thay vì bọc một Layout chung cưỡng ép cho toàn bộ mọi màn hình (khiến khó tùy biến), chúng ta áp dụng **Cách 2** bằng việc gom nhóm các màn hình có chung đặc tính hoạt động trong file điều hướng `HomeStack.tsx`:

1. **Nhóm Standard (Màn hình thường / chi tiết)**: 
   - Không cấu hình gì đặc biệt trong `Stack.Group`.
   - Hiệu ứng chuyển động là trượt từ phải sang (mặc định của hệ điều hành).
   - Phù hợp với Layout xem thông tin, cấu hình, danh sách tổng quát.

2. **Nhóm Modal (Màn hình Thêm / Sửa)**:
   - Được bọc trong `<Stack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>`.
   - Khi mở các màn hình này lên, chúng sẽ trượt từ dưới lên dạng Modal.

---

## Các Khuôn Mẫu Layout Phân Theo Điều Hướng (Navigation)

### 1. Khuôn Mẫu 1: Layout Cho Các Màn HÌnh Thuộc Tab Navigator (HomeScreen, ReportsScreen, CategoryScreen, DebtsScreen)
- **Vị trí**: Các màn hình nằm trong Tab Bar ở màn hình chính.
- **Thành phần bao ngoài (Wrapper)**: `<PrimaryView useSidePadding={false}>` để nội dung danh sách (FlatList/ScrollView) có thể tràn viền hai bên màn hình.
- **Thanh tiêu đề (Header)**: `<HeaderContainer>` nằm ở trên cùng để hiển thị ảnh đại diện và nút Settings.
- **Nút hành động nổi (FAB)**: Một nút bấm tròn dạng `absolute` cố định ở góc dưới cùng bên phải màn hình để thực hiện hành động nhanh (thêm giao dịch). **Lưu ý**: Bắt buộc phải sử dụng component `<Icon name="plus-circle" />` đã đăng ký trong `IconRegistry.ts` thay thế hoàn toàn cho việc sử dụng ảnh tĩnh (Image) hoặc icon SVG tùy tiện.

#### zero (code cũ):
```tsx
return (
  <>
    <PrimaryView colors={colors} useSidePadding={false} useBottomPadding={false}>
      <View style={[gs.px16, gs.mb15]}>
        <HeaderContainer headerText="Hey, User" />
      </View>
      <TransactionList ... />
    </PrimaryView>
    <View style={[gs.absolute, gs.bottom15, gs.right15]}>
      <TouchableOpacity onPress={() => navigate('AddTransactionsScreen')}>
        <Icon name="plus-circle" size={30} />
      </TouchableOpacity>
    </View>
  </>
);
```

#### nexus-expense (chuyển đổi chuẩn mới):
```tsx
return (
  <>
    <PrimaryView useSidePadding={false} style={{ paddingTop: 0 }}>
      <HeaderContainer headerText="Hey, User" />
      <View className="flex-1 mt-6 px-6">
        <FlatList ... />
      </View>
    </PrimaryView>
    <View className="absolute bottom-4 right-4">
      <TouchableOpacity onPress={() => navigation.navigate('AddTransactionsScreen')}>
        <Icon name="plus-circle" size={30} color={isDark ? "#c3c0ff" : "#4f46e5"} />
      </TouchableOpacity>
    </View>
  </>
);
```

---

### 2. Khuôn Mẫu 2: Layout Cho Màn Hình Thuộc Stack Group 1 - Standard / Detail (SettingsScreen, EverydayTransactionScreen, CategoryTransactionScreen, IndividualDebtsScreen)
- **Vị trí**: Các màn hình xem chi tiết hoặc cấu hình, chuyển cảnh trượt từ phải sang.
- **Thành phần bao ngoài (Wrapper)**: `<PrimaryView>` (Mặc định tự căn đệm lề trái phải).
- **Thanh tiêu đề (Header)**: `<AppHeader>` có nút quay lại (Back) và có thể kèm theo một nút chức năng phụ bên phải (`rightAction`).
- **Phần thân (Body)**: Sử dụng các FlatList hoặc ScrollView hiển thị thông tin chi tiết.

#### zero (code cũ):
```tsx
return (
  <PrimaryView colors={colors}>
    <AppHeader
      onPress={goBack}
      text="Settings"
      colors={colors}
      rightAction={<SomeButton />}
    />
    <ScrollView>
      ...
    </ScrollView>
  </PrimaryView>
);
```

#### nexus-expense (chuyển đổi chuẩn mới):
```tsx
return (
  <PrimaryView useSidePadding={false} style={{ paddingTop: 0 }}>
    <AppHeader
      onPress={() => navigation.goBack()}
      text="Settings"
      rightAction={<SomeButton />}
    />
    <ScrollView
      className="bg-surface-low"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 24,
        justifyContent: "space-between",
      }}
    >
      ...
    </ScrollView>
  </PrimaryView>
);
```

---

### 3. Khuôn Mẫu 3: Layout Cho Màn HÌnh Thuộc Stack Group 2 - Modal Form Entry (Add/Update Screens)
- **Vị trí**: Các màn hình điền thông tin và lưu dữ liệu, chuyển cảnh trượt từ dưới lên dạng Modal.
- **Thành phần bao ngoài (Wrapper)**: `<PrimaryView dismissKeyboardOnTouch>` giúp ẩn bàn phím khi bấm ra ngoài các ô nhập.
- **Thanh tiêu đề (Header)**: `<AppHeader>` có nút Back ở góc trái.
- **Phần thân (Body)**: `<ScrollView>` chứa các ô nhập `<CustomInput>`.
- **Chân trang (Footer)**: Nút hành động chính `<PrimaryButton buttonTitle="Lưu" />` đặt cố định ở dưới cùng.

#### zero (code cũ):
```tsx
return (
  <PrimaryView colors={colors} dismissKeyboardOnTouch>
    <AppHeader onPress={goBack} text="Add Transaction" colors={colors} />
    <ScrollView>
      <CustomInput ... />
    </ScrollView>
    <PrimaryButton onPress={handleSave} colors={colors} buttonTitle="Save" />
  </PrimaryView>
);
```

#### nexus-expense (chuyển đổi chuẩn mới):
```tsx
return (
  <PrimaryView dismissKeyboardOnTouch>
    <AppHeader onPress={() => navigation.goBack()} text="Add Transaction" />
    <ScrollView className="flex-1">
      <CustomInput ... />
    </ScrollView>
    <PrimaryButton onPress={handleSave} buttonTitle="Save" />
  </PrimaryView>
);
```

---

### 4. Khuôn Mẫu 4: Layout Màn Hình Khởi Động / Giới Thiệu (OnboardingStack - WelcomeScreen, PersonalizeScreen, ChooseCurrencyScreen)
- **Vị trí**: Các màn hình chào mừng người dùng mới, hiển thị trước khi vào giao diện chính.
- **Thành phần bao ngoài (Wrapper)**: `<PrimaryView className="justify-between">` phân bố đều khoảng cách các phần tử theo chiều dọc.
- **Bố cục (Layout)**: Tiêu đề ở trên cùng, ảnh hoặc Carousel ở giữa, và các nút điều hướng tiếp tục ở dưới cùng.

#### zero (code cũ):
```tsx
return (
  <PrimaryView colors={colors} style={gs.justifyBetween}>
    <View style={gs.pt15p}>
      <PrimaryText size={28} weight="bold">Welcome</PrimaryText>
    </View>
    <Carousel />
    <View style={gs.gap12}>
      <PrimaryButton ... />
    </View>
  </PrimaryView>
);
```

#### nexus-expense (chuyển đổi chuẩn mới):
```tsx
return (
  <PrimaryView className="justify-between">
    <View className="pt-[15%]">
      <PrimaryText className="text-3xl font-bold text-on-surface">Welcome</PrimaryText>
    </View>
    <Carousel />
    <View className="gap-3">
      <PrimaryButton ... />
    </View>
  </PrimaryView>
);
```

---

## Bảng Tra Cứu Chuyển Đổi Style `gs` Sang Class Tailwind

Dưới đây là bảng ánh xạ giúp bạn tra cứu nhanh khi chuyển đổi các Style cũ của zero sang Class của Tailwind trên nexus-expense:

| Style cũ (`gs.xxx`) | Class Tailwind tương đương | Ý nghĩa |
|---|---|---|
| `gs.flex1` | `flex-1` | Chiếm toàn bộ không gian trống còn lại |
| `gs.row` | `flex-row` | Bố cục dạng dòng ngang |
| `gs.rowCenter` | `flex-row items-center` | Hàng ngang căn giữa theo chiều dọc |
| `gs.rowBetweenCenter` | `flex-row items-center justify-between` | Hàng ngang căn giữa dọc, giãn đều sang 2 bên |
| `gs.center` | `items-center justify-center` | Căn giữa tuyệt đối cả hai chiều dọc/ngang |
| `gs.gap10` | `gap-2.5` | Khoảng cách giữa các phần tử con là 10px |
| `gs.gap12` | `gap-3` | Khoảng cách giữa các phần tử con là 12px |
| `gs.gap6` | `gap-1.5` | Khoảng cách giữa các phần tử con là 6px |
| `gs.px14` | `px-3.5` | Đệm lề trái/phải 14px |
| `gs.px16` | `px-4` | Đệm lề trái/phải 16px |
| `gs.py12` | `py-3` | Đệm lề trên/dưới 12px |
| `gs.p14` | `p-3.5` | Đệm lề tất cả các hướng 14px |
| `gs.p10` | `p-2.5` | Đệm lề tất cả các hướng 10px |
| `gs.mt6` | `mt-1.5` | Khoảng cách lề trên 6px |
| `gs.mt10` | `mt-2.5` | Khoảng cách lề trên 10px |
| `gs.mt15` | `mt-3.5` | Khoảng cách lề trên 15px |
| `gs.mb5` | `mb-1` | Khoảng cách lề dưới 5px |
| `gs.mb10` | `mb-2.5` | Khoảng cách lề dưới 10px |
| `gs.mb15` | `mb-4` | Khoảng cách lề dưới 15px |
| `gs.mr10` | `mr-2.5` | Khoảng cách lề bên phải 10px |
| `gs.rounded8` | `rounded-lg` | Bo tròn góc 8px |
| `gs.rounded10` | `rounded-[10px]` | Bo tròn góc 10px |
| `gs.rounded12` | `rounded-xl` | Bo tròn góc 12px |
| `gs.roundedFull` | `rounded-full` | Bo tròn tuyệt đối dạng hình tròn |
| `gs.size30` | `w-8 h-8` | Kích thước phần tử vuông 32px |
| `gs.size40` | `w-10 h-10` | Kích thước phần tử vuông 40px |
| `gs.size50` | `w-12 h-12` | Kích thước phần tử vuông 48px |
| `gs.h48` | `h-12` | Chiều cao cố định 48px |
| `gs.h60` | `h-16` | Chiều cao cố định 64px |
| `gs.hFull` | `h-full` | Chiều cao tối đa 100% |
| `gs.wFull` | `w-full` | Chiều rộng tối đa 100% |
| `gs.absolute` | `absolute` | Định vị tuyệt đối phần tử |
| `gs.zIndex1` | `z-10` | Thứ tự hiển thị nổi lên trên |
| `gs.opacity60` | `opacity-60` | Độ trong suốt 60% |
| `gs.border2` | `border-2` | Độ dày viền khung 2px |
| `gs.justifyBetween` | `justify-between` | Căn các phần tử con cách xa nhau đều |
| `gs.pt15p` | `pt-[15%]` | Khoảng cách lề trên bằng 15% chiều rộng màn hình |
| `gs.mt30p` | `mt-[30%]` | Lề ngoài phía trên bằng 30% chiều rộng màn hình |
| `gs.pb80` | `pb-20` | Khoảng cách lề đệm phía dưới 80px |