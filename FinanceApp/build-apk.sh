#!/bin/bash
# Script để tạo APK cho ứng dụng Quản Lý Tài Chính

echo "🏗️  Đang tạo APK cho ứng dụng Quản Lý Tài Chính..."

# Kiểm tra thư mục android
if [ ! -d "android" ]; then
    echo "❌ Không tìm thấy thư mục android. Vui lòng chạy script trong thư mục FinanceApp."
    exit 1
fi

# Dọn dẹp build cũ
echo "🧹 Dọn dẹp build cũ..."
cd android
./gradlew clean

# Tạo APK debug
echo "📱 Đang tạo APK debug..."
./gradlew assembleDebug

# Kiểm tra APK được tạo
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo "✅ APK debug đã được tạo thành công!"
    echo "📍 Đường dẫn: android/$APK_PATH"
    
    # Hiển thị thông tin APK
    APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
    echo "📊 Kích thước APK: $APK_SIZE"
    
    # Copy APK ra thư mục gốc
    cp "$APK_PATH" "../QuanLyTaiChinh-debug.apk"
    echo "📋 APK đã được copy ra: QuanLyTaiChinh-debug.apk"
else
    echo "❌ Không thể tạo APK. Vui lòng kiểm tra lỗi ở trên."
    exit 1
fi

echo ""
echo "🎉 Hoàn tất! Bạn có thể cài đặt APK trên thiết bị Android."
echo "💡 Lưu ý: Cần bật 'Unknown sources' trong Settings để cài đặt APK."