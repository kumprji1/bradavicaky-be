const express = require("express");

const authCtrl = require("../controllers/authCtrl");
const authVldt = require("../validations/authVlds");

const router = express.Router();

router.post("/login", authVldt.postLogin, authCtrl.postLogin);
router.post(
  "/register-admin",
  authVldt.postRegisterAdmin,
  authCtrl.postRegisterAdmin
);

module.exports = router;
