const express = require('express');

const adminCtrl = require('../controllers/adminCtrl');

const router = express.Router();

router.post('/register-pupil', adminCtrl.postRegisterPupil)

module.exports = router;