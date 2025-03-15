const express = require('express');
const {
    getAllData,
    postData,
    getCategories,
    postCategory,
    deleteWord,
    getUpdateWord,
    updateWord,
} = require('../controllers/user');

const router = express.Router();
router.get('/yeni-kelime', getAllData);

router.post('/yeni-kelime', postData);

router.get('/kategori-ekle', getCategories);

router.post('/kategori-ekle', postCategory);

router.get('/delete-word/:id', deleteWord);

router.get('/update-word/:id', getUpdateWord);
router.post('/update-word/:id', updateWord);
module.exports = router;