const Product = require('../models/product');

// อ่านและจัดรูปข้อมูลจากฟอร์ม
function readForm(body) {
  const name =
    typeof body.name === 'string' ? body.name.trim() : '';

  const price =
    typeof body.price === 'string' ? body.price.trim() : '';

  return { name, price };
}

// ตรวจข้อมูลฝั่ง server ด้วย เพราะ required ใน HTML ถูกข้ามได้
function validProduct(data) {
  return (
    data.name !== '' &&
    data.price !== '' &&
    Number.isFinite(Number(data.price)) &&
    Number(data.price) >= 0
  );
}

// แสดงฟอร์มเดิมพร้อมข้อความผิดพลาด
function showBadForm(res, title, action, product) {
  return res.status(400).render('products/form', {
    title,
    action,
    product,
    error: 'กรุณากรอกชื่อสินค้าและราคาที่เป็นเลขตั้งแต่ 0 ขึ้นไป'
  });
}

// READ: แสดงสินค้าทั้งหมด
async function listProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.render('products/index', {
      title: 'รายการสินค้า',
      products
    });
  } catch (error) {
    next(error);
  }
}

// CREATE: เปิดฟอร์มเพิ่ม
function newForm(req, res) {
  res.render('products/form', {
    title: 'เพิ่มสินค้า',
    action: '/products',
    product: { name: '', price: '' },
    error: null
  });
}

// CREATE: รับข้อมูลจากฟอร์มแล้วบันทึก
async function createProduct(req, res, next) {
  const data = readForm(req.body);

  if (!validProduct(data)) {
    return showBadForm(res, 'เพิ่มสินค้า', '/products', data);
  }

  try {
    await Product.create({
      name: data.name,
      price: Number(data.price)
    });

    // 303 ให้ browser กลับไปดึงหน้ารายการด้วย GET
    res.redirect(303, '/products');
  } catch (error) {
    next(error);
  }
}

// READ: แสดงสินค้าหนึ่งชิ้นตาม _id
async function showProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('ไม่พบสินค้า');
    }

    res.render('products/show', {
      title: 'รายละเอียดสินค้า',
      product
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE: เปิดฟอร์มโดยใส่ข้อมูลเดิมไว้ก่อน
async function editForm(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('ไม่พบสินค้า');
    }

    res.render('products/form', {
      title: 'แก้ไขสินค้า',
      action: `/products/${product._id}/update`,
      product,
      error: null
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE: รับข้อมูลใหม่แล้วแก้ไขเอกสารใน MongoDB
async function updateProduct(req, res, next) {
  const data = readForm(req.body);
  const action = `/products/${req.params.id}/update`;

  if (!validProduct(data)) {
    return showBadForm(res, 'แก้ไขสินค้า', action, {
      _id: req.params.id,
      ...data
    });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: data.name,
        price: Number(data.price)
      },
      {
        // เปิดการตรวจ Schema ตอน update
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).send('ไม่พบสินค้า');
    }

    res.redirect(303, `/products/${req.params.id}`);
  } catch (error) {
    next(error);
  }
}

// DELETE: ลบสินค้าแล้วส่ง JSON ให้ JavaScript ฝั่ง browser
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'ไม่พบสินค้า' });
    }

    res.json({ redirect: '/products' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  newForm,
  createProduct,
  showProduct,
  editForm,
  updateProduct,
  deleteProduct
};