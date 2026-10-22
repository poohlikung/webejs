const mongoose = require('mongoose');

// Schema กำหนดหน้าตาและกฎของข้อมูลสินค้า
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    // เพิ่ม createdAt และ updatedAt ให้อัตโนมัติ
    timestamps: true
  }
);

// Product คือ Model ที่ใช้สร้าง ค้นหา แก้ไข และลบข้อมูล
module.exports = mongoose.model('Product', productSchema);