const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/', profileController.getAllProfiles);
router.post('/', profileController.addProfile);
router.put('/:id', profileController.updateProfile);
router.delete('/:id', profileController.removeProfile);

module.exports = router;
