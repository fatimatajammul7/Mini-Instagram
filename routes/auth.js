const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth');

router.post('/login',[
    body('username').isAlphanumeric().notEmpty(),
    body('password').isLength({min: 8}).notEmpty()
],
authController.login); 

router.post('/signup',[
    body('username').isAlphanumeric().notEmpty(),
    body('password').isLength({min: 8}).notEmpty()
], authController.signUp);

module.exports = router;