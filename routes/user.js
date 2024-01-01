const express = require('express');
const router = express.Router();
const userController = require('../controller/user')

router.get('/polls',userController.getPolls);
router.post('/updatepoll',userController.postQuestion);

module.exports = router;