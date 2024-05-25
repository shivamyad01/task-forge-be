const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

const auth = require('../middleware/auth')
// Get all profiles
router.get('/',auth, profileController.getAllProfiles);

// Add a new profile
router.post('/', auth, profileController.addProfile);

// Update a profile
router.put('/:id',auth, profileController.updateProfile);

// Remove a profile
router.delete('/:id',auth, profileController.removeProfile);

module.exports = router;
