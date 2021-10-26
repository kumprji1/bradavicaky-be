const express = require('express');

const authCtrl = require('../controllers/authCtrl')

const router = express.Router();

router.post('/login', authCtrl.postLogin)
router.post('/register-admin', authCtrl.postRegisterAdmin)

module.exports = router;