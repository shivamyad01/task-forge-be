const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware

// Get all profiles
router.get('/', profileController.getAllProfiles);

// Add a new profile
router.post('/', auth, profileController.addProfile);

// Update a profile
router.put('/:id', profileController.updateProfile);

// Remove a profile
router.delete('/:id', profileController.removeProfile);

module.exports = router;
