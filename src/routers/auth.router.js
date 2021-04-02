const express = require("express");
const { signUp, signIn } = require("../controller/auth.controller");
const requireSignin = require("../middlewares/common.middleware");
const {
  validateSignUpRequest,
  validateSignInRequest,
  isRequestValidated
} = require("../validators/auth.validators");

const router = express.Router();

router.post("/signUp", validateSignUpRequest, isRequestValidated, signUp);

router.post("/signIn", validateSignInRequest, isRequestValidated, signIn);

module.exports = router;
