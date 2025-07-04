# Quản Lý Tài Chính - React Native App

Ứng dụng quản lý tài chính cá nhân được phát triển bằng React Native, dựa trên tệp HTML gốc.

## Tính năng

- ✅ Thêm giao dịch thu/chi với mô tả và số tiền
- ✅ Hiển thị số dư hiện tại
- ✅ Tổng kết thu nhập và chi tiêu
- ✅ Lọc giao dịch theo loại (Tất cả, Thu, Chi)
- ✅ Xóa giao dịch với xác nhận
- ✅ Lưu trữ dữ liệu cục bộ (AsyncStorage)
- ✅ Giao diện tiếng Việt
- ✅ Responsive design cho mobile

## Yêu cầu hệ thống

- Node.js (>= 18)
- React Native CLI
- Android Studio (cho Android)
- JDK 17+

## Cài đặt

1. Clone repository và di chuyển vào thư mục FinanceApp:
```bash
cd FinanceApp
npm install
```

2. Cài đặt dependencies cho Android:
```bash
npx react-native doctor
```

## Chạy ứng dụng

### Android
```bash
# Khởi động Metro bundler
npm start

# Chạy trên Android (trong terminal khác)
npm run android
```

### iOS (chỉ trên macOS)
```bash
cd ios && pod install && cd ..
npm run ios
```

## Tạo APK cho Android

### 1. APK Debug (cho testing)
```bash
cd android
./gradlew assembleDebug
```
APK sẽ được tạo tại: `android/app/build/outputs/apk/debug/app-debug.apk`

### 2. APK Release (cho production)

#### Tạo keystore (chỉ cần làm một lần):
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### Cấu hình signing trong `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=****
MYAPP_UPLOAD_KEY_PASSWORD=****
```

#### Cập nhật `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

#### Tạo APK release:
```bash
cd android
./gradlew assembleRelease
```
APK sẽ được tạo tại: `android/app/build/outputs/apk/release/app-release.apk`

## Cấu trúc dự án

```
FinanceApp/
├── App.tsx                 # Component chính với toàn bộ logic
├── android/                # Cấu hình Android
├── ios/                    # Cấu hình iOS
├── package.json           # Dependencies
└── README.md              # Hướng dẫn này
```

## Tính năng chính trong App.tsx

- **Transaction Management**: Thêm, xóa giao dịch
- **Data Persistence**: Sử dụng AsyncStorage để lưu dữ liệu
- **State Management**: React hooks (useState, useEffect)
- **UI Components**: Styled components tương tự HTML gốc
- **Vietnamese Localization**: Định dạng số tiền và ngày tháng

## Khác biệt so với HTML gốc

| Tính năng | HTML | React Native |
|-----------|------|--------------|
| Storage | localStorage | AsyncStorage |
| Styling | CSS | StyleSheet |
| Navigation | DOM manipulation | React state |
| Platform | Web only | iOS & Android |

## Troubleshooting

### Lỗi build Android:
```bash
# Dọn dẹp cache
cd android
./gradlew clean

# Kiểm tra Java version
java -version

# Kiểm tra Android SDK
npx react-native doctor
```

### Lỗi Metro bundler:
```bash
# Dọn dẹp cache Metro
npx react-native start --reset-cache
```

### Lỗi dependencies:
```bash
# Cài đặt lại node_modules
rm -rf node_modules package-lock.json
npm install
```

## Demo

App bao gồm:
1. **Màn hình chính** với form thêm giao dịch
2. **Hiển thị số dư** và tổng kết thu/chi
3. **Danh sách giao dịch** với khả năng lọc
4. **Chức năng xóa** với dialog xác nhận
5. **Lưu trữ dữ liệu** persistent qua các lần mở app

Giao diện được thiết kế responsive và tối ưu cho điện thoại di động.

---

## Original React Native Project Setup

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
