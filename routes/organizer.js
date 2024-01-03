const express = require('express');
const router = express.Router();
const orgController = require("../controller/organizer");
const authenticator = require('../middleware/auth')
const { body } = require('express-validator');

router.post('/signup',[
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().isLength({min:8}),
    body('confirmPassword').notEmpty().trim().isLength({min:8}),
    body('name').notEmpty().trim(),
    body('phone').notEmpty().trim().isLength({min:10,max:10})
],orgController.postSignup);
router.post('/login',[
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().isLength({min:8})
],orgController.postLogin);
router.get('/logout',authenticator.authenticate,orgController.getLogout);
router.put('/account',authenticator.authenticate,orgController.updateAccount);
router.delete('/account',authenticator.authenticate,orgController.deleteAccount);
router.get('/question',authenticator.authenticate,orgController.getQuestion);
router.post('/question',authenticator.authenticate,orgController.addQuestion);
router.put('/question',authenticator.authenticate,orgController.updateQuestion);
router.delete('/question',authenticator.authenticate,orgController.deleteQuestion);


module.exports = router;

