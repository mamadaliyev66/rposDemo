export default {
  // Dastur bo'ylab ishlatiladigan umumiy so'z va iboralar
  common: {
    // Umumiy
    all: 'Barchasi',
    error: 'Xatolik',
    success: 'Muvaffaqiyatli',
    cancel: 'Bekor qilish',
    delete: "O'chirish",
    retry: 'Qayta urinish',
    loading: 'Yuklanmoqda...',
    unknown: "Noma'lum",
    notAvailable: 'Mavjud Emas',
    // Rollar
    admin: 'Admin',
    waiter: 'Ofitsiant',
    cashier: 'Kassir',
    // To'lov
    cash: 'Naqd',
    card: 'Karta',
    uzs: "so'm",
    // Holatlar
    status: 'Holati',
    status_new: 'Yangi',
    status_preparing: 'Tayyorlanmoqda',
    status_served: 'Yetkazildi',
    status_paid: "To'landi",
    // Stollar holati
    table_available: "Bo'sh",
    table_occupied: 'Band',
    table_reserved: 'Zaxira',
  },

  // Ekranga xos matnlar
  screens: {
    // Avtorizatsiya
    login_welcome: 'Xush kelibsiz!',
    login_subtitle: "Tizimga kirish uchun ma'lumotlarni to'ldiring.",
    login_email_placeholder: 'Email',
    login_password_placeholder: 'Parol',
    login_button: 'Kirish',

    // Admin -> Taomnomani Boshqarish
    menu_management_title: 'Taomnomani Boshqarish',
    menu_list_no_items: "Taomnoma bo'sh.",
    menu_list_add_prompt: "Yangi taom qo'shish uchun '+' tugmasini bosing!",
    add_item_title: "Yangi Taom Qo'shish",
    edit_item_title: 'Taomni Tahrirlash',
    item_form_name_placeholder: "Taom nomi (masalan, Osh)",
    item_form_desc_placeholder: 'Tavsifi',
    item_form_price_placeholder: "Narxi (masalan, 30000)",
    item_form_category_placeholder: "Kategoriya (masalan, Issiq ovqatlar)",
    item_form_select_image: 'Rasm Tanlash',
    item_form_change_image: "Rasmni O'zgartirish",
    item_form_add_button: "Taomni Qo'shish",
    item_form_update_button: 'Yangilash',

    // Admin -> Foydalanuvchilarni Boshqarish
    user_management_title: 'Foydalanuvchilarni Boshqarish',
    user_list_no_users: 'Foydalanuvchilar topilmadi.',
    add_user_title: "Yangi Foydalanuvchi Qo'shish",
    user_form_name_placeholder: "To'liq ismi (masalan, Anvar Anvarov)",
    user_form_password_placeholder: 'Parol (kamida 6 belgi)',
    user_form_assign_role: 'Rol Tayinlash',
    user_form_create_button: 'Foydalanuvchi Yaratish',
    user_roles_title: 'Rollarni Boshqarish',
    user_roles_no_staff: 'Xodimlar topilmadi.',
    
    // Admin -> Hisobotlar
    reports_title: 'Hisobotlar',
    reports_sales_title: 'Savdo Hisoboti',
    reports_sales_desc: 'Tushum, tranzaksiyalar va savdo trendlarini tahlil qilish.',
    reports_staff_title: 'Xodimlar Hisoboti',
    reports_staff_desc: "Har bir ofitsiantning buyurtmalari va savdo hajmini kuzatish.",
    reports_table_title: 'Stollar Hisoboti',
    reports_table_desc: "Har bir stolning bandligi va tushum statistikasini ko'rish.",
    report_from: 'Dan:',
    report_to: 'Gacha:',
    report_total_revenue: 'Jami Tushum',
    report_total_transactions: 'Jami Tranzaksiyalar',
    report_avg_transaction: "O'rtacha Tranzaksiya",
    report_sales_trend: 'Savdo Trendi',
    report_no_sales_data: "Tanlangan davr uchun savdo ma'lumotlari yo'q.",
    report_transactions: 'Tranzaksiyalar',
    report_order_id: 'Buyurtma IDsi:',
    report_no_staff_data: "Bu davr uchun xodimlar hisoboti topilmadi.",
    report_total_orders: 'Jami Buyurtmalar:',
    report_total_sales: 'Jami Savdo:',
    report_table_num: 'Stol #',
    report_num_orders: 'Buyurtmalar soni',
    report_no_table_data: "Bu davr uchun ma'lumot topilmadi.",

    // Admin -> Sozlamalar
    settings_title: 'Sozlamalar',
    settings_account: 'Profil',
    settings_restaurant_profile: 'Restoran Profili',
    settings_general: 'Umumiy',
    settings_appearance: "Ko'rinish",
    settings_language: 'Til',
    settings_about: 'Dastur haqida',
    settings_app_version: 'Dastur versiyasi',
    settings_logout: 'Tizimdan chiqish',
    
    // Ofitsiant
    waiter_tables_title: 'Stollar Holati',
    waiter_menu_title: 'Stol #{tableNumber} - Taomnoma',
    waiter_cart_title: 'Joriy Buyurtma',
    waiter_cart_empty: "Savatcha bo'sh",
    waiter_place_order_button: 'Buyurtma Berish',
    waiter_history_title: 'Bugungi Buyurtmalarim',
    waiter_history_empty: "Bugun uchun buyurtmalaringiz yo'q.",
    waiter_order_details_title: 'Buyurtma Detallari',
    waiter_order_items: 'Mahsulotlar',
    waiter_order_time: 'Vaqti:',
    waiter_order_total: 'Jami Summa:',

    // Kassir
    cashier_daily_transactions_title: "Bugungi Tushumlar",
    cashier_total_revenue: 'Jami Tushum',
    cashier_no_payments_today: "Bugun uchun to'lovlar mavjud emas.",
    cashier_orders_for_payment_title: "To'lov Uchun Buyurtmalar",
    cashier_no_orders_for_payment: "Hozircha to'lov uchun buyurtmalar yo'q.",
    cashier_confirm_payment_title: "To'lovni Tasdiqlash",
    cashier_order_contents: 'Buyurtma tarkibi',
    cashier_payment_method: 'To\'lov usuli',
    cashier_confirm_payment_button: "To'lovni Tasdiqlash",
  },

  // Ogohlantirish xabarlari
  alerts: {
    // Umumiy
    error_title: 'Xatolik',
    error_unknown: "Noma'lum xatolik yuz berdi.",
    // Kirish
    login_failed_title: 'Kirishda Xatolik',
    login_validation_error_title: "Ma'lumotlar To'liq Emas",
    login_validation_error_message: 'Iltimos, email va parolni to\'liq kiriting.',
    error_invalid_credentials: "Noto'g'ri email yoki parol.",
    error_invalid_email_format: "Email manzili noto'g'ri formatda.",
    error_login_generic: "Tizimga kirishda xatolik yuz berdi.",
    error_logout_generic: "Tizimdan chiqishda xatolik yuz berdi.",
    error_user_data_not_found: "Foydalanuvchi ma'lumotlari bazada topilmadi.",
    // Menyu
    menu_incomplete_form_title: "Forma To'liq Emas",
    menu_incomplete_form_message: "Iltimos, barcha maydonlarni to'ldiring va rasm tanlang.",
    menu_upload_error_title: 'Yuklashda Xatolik',
    menu_upload_error_message: "Rasmni yuklab bo'lmadi. Iltimos, qayta urining.",
    menu_add_error: "Taomni qo'shishda xatolik yuz berdi.",
    menu_add_success: "Taom muvaffaqiyatli qo'shildi!",
    menu_fetch_error: "Taom ma'lumotlarini olib bo'lmadi.",
    menu_update_success: "Taom muvaffaqiyatli yangilandi!",
    menu_delete_title: "Taomni O'chirish",
    menu_delete_confirm: '"{itemName}" nomli taomni o\'chirmoqchimisiz? Bu amalni bekor qilib bo\'lmaydi.',
    menu_delete_success: '"{itemName}" o\'chirildi.',
    menu_delete_error: "Taomni o'chirishda xatolik yuz berdi.",
    // Foydalanuvchi
    user_add_incomplete_form: "Iltimos, barcha maydonlarni to'ldiring.",
    user_add_invalid_email: "Iltimos, to'g'ri email manzil kiriting.",
    user_add_weak_password: "Parol kamida 6 belgidan iborat bo'lishi kerak.",
    user_add_success: '"{userName}" ismli foydalanuvchi {role} sifatida muvaffaqiyatli yaratildi.',
    user_add_failed_title: 'Yaratishda Xatolik',
    user_add_email_in_use: "Bu email manzil allaqachon ro'yxatdan o'tgan.",
    user_delete_confirm_title: "O'chirishni Tasdiqlash",
    user_delete_confirm_message: '"{userName}" ismli foydalanuvchini o\'chirmoqchimisiz?',
    user_delete_record_deleted_title: "Yozuv O'chirildi",
    user_delete_record_deleted_message: '{email} uchun Firestore yozuvi o\'chirildi.\n\nDIQQAT: Foydalanuvchining kirish huquqini to\'liq olib tashlash uchun endi uni Firebase Konsolining "Authentication" bo\'limidan qo\'lda o\'chirib yuborishingiz kerak.',
    // Buyurtma
    order_empty_title: "Bo'sh Buyurtma",
    order_empty_message: 'Buyurtma berish uchun kamida bitta mahsulot tanlang.',
    order_placed_success: 'Buyurtma oshxonaga yuborildi.',
    // To'lov
    payment_missing_order: "Buyurtma ma'lumotlari yetishmayapti.",
    payment_success: "To'lov muvaffaqiyatli amalga oshirildi!",
    payment_error: "To'lovni amalga oshirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
    // Sozlamalar
    feature_not_implemented_title: 'Funksiya Mavjud Emas',
    feature_not_implemented_message: '"{screenName}" sahifasiga o\'tish hali sozlanmagan.',
    logout_confirm_title: 'Tizimdan Chiqish',
    logout_confirm_message: "Haqiqatan ham tizimdan chiqmoqchimisiz?",
  }
};