const express = require('express');
const { signUp, login, getUserById } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/get/:id', getUserById);

module.exports = router;