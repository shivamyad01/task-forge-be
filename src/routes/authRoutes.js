const express = require('express');
const { checkLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/checkLogin', checkLogin);

module.exports = router;
