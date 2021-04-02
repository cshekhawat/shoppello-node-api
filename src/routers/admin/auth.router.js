const express = require("express");

const { signUp, signIn } = require("../../controller/admin/auth.controller");
const {
  validateSignUpRequest,
  isRequestValidated,
  validateSignInRequest
} = require("../../validators/auth.validators");

const router = express.Router();

router.post("/signUp", validateSignUpRequest, isRequestValidated, signUp);

router.post("/signIn", validateSignInRequest, isRequestValidated, signIn);

module.exports = router;
