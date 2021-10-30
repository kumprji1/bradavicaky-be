const express = require('express');

const adminCtrl = require('../controllers/adminCtrl');

const router = express.Router();

router.get('/pupils', adminCtrl.getPupils)

router.post('/register-pupil', adminCtrl.postRegisterPupil)

router.patch('/add-points', adminCtrl.patchAddPointsById)
router.patch('/remove-points', adminCtrl.patchRemovePointsById)


module.exports = router;