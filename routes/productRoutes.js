const express = require('express');
const mongoose = require('mongoose');
const controller = require('../controllers/productController');

const router = express.Router();

// ตรวจรูปแบบ :id ก่อนส่งไปให้ Controller
router.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send('ไม่พบสินค้า');
  }

  next();
});

// เมื่อ app.js ติดตั้งที่ /products:
// '/' จึงหมายถึง /products
router.get('/', controller.listProducts);
router.post('/', controller.createProduct);

// เส้นทาง /new ต้องอยู่ก่อนเส้นทางที่มี :id
router.get('/new', controller.newForm);

router.get('/:id/edit', controller.editForm);
router.post('/:id/update', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);
router.get('/:id', controller.showProduct);

module.exports = router;