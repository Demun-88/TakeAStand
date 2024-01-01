const express = require('express');
const router = express.Router();
const orgController = require("../controller/organizer");
const authenticator = require('../middleware/auth')
const { body } = require('express-validator');

router.post('/signup',orgController.postSignup);
router.post('/login',orgController.postLogin);
router.get('/question',authenticator.authenticate,orgController.getQuestion);
router.post('/question',authenticator.authenticate,orgController.addQuestion);

module.exports = router;

// body('email').isEmail(),body('password').isEmpty().isLength({min:8})