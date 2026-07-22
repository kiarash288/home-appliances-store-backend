require('dotenv').config(); // این خط کلید حل مشکلته! فایل env. رو می‌خونه

const app = require('./app');
const db = require('./models');

// خط const express و const config رو کلاً پاک کردم چون اینجا بهشون نیازی نیست

async function startServer() {
  try {
    // ۱. تست اتصال به دیتابیس
    await db.sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // ۲. ساخت جدول‌ها
    await db.sequelize.sync({ alter: true });
    console.log('✅ Database & tables created!');

    // ۳. اجرای سرور
    const port = process.env.PORT || 3000; // اگر پورت تو env نبود، پیش‌فرض 3000 بذاره
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();