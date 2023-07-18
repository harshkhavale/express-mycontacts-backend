const express = require("express");
const router = express.Router();
const {
  getUser,
  registerUser,
  loginUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current").get(validateToken,getUser);

module.exports = router;
