const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// บอก Express ว่าใช้ EJS และไฟล์หน้าเว็บอยู่ในโฟลเดอร์ views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// อ่านข้อมูลที่ส่งมาจาก HTML form ให้ใช้ผ่าน req.body ได้
app.use(express.urlencoded({ extended: false }));

// เปิดหน้าแรกแล้วส่งไปหน้ารายการสินค้า
app.get('/', (req, res) => {
    res.redirect('/products');
});

// ทุก route ใน productRoutes จะขึ้นต้นด้วย /products
app.use('/products', productRoutes);

// วาง 404 หลัง route ทั้งหมด
app.use((req, res) => {
    res.status(404).send('ไม่พบหน้านี้');
});

// รับข้อผิดพลาดที่ Controller ส่งมาด้วย next(error)
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('เซิร์ฟเวอร์เกิดข้อผิดพลาด');
});

const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/exam_products';

async function start() {
    try {
        // เชื่อมฐานข้อมูลให้สำเร็จก่อนเริ่มรับคำขอ
        await mongoose.connect(mongoUri);

        app.listen(3000, () => {
            console.log('เปิดเว็บที่ http://localhost:3000');
        });
    } catch (error) {
        console.error('เชื่อม MongoDB ไม่สำเร็จ:', error);
        process.exitCode = 1;
    }
}

start();