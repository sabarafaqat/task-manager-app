const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, getUsers } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.get('/users', protect, getUsers);

module.exports = router;
