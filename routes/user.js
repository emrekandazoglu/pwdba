const express = require('express');
const { getAllData, postData, getCategories,postCategory } = require('../controllers/user');

const router = express.Router();
router.get('/yeni-kelime', getAllData);

router.post('/yeni-kelime', postData);

router.get('/kategori-ekle', getCategories);

router.post('/kategori-ekle', postCategory);

module.exports = router;
