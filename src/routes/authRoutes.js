const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/checkLogin', authController.checkLogin);

router.post('/register', authController.register);

module.exports = router;
