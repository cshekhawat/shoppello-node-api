const User = require("../../models/user.model");
const { getRandomString } = require("../../utils/helper.utils");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  User.findOne({ email }).exec((error, user) => {
    if (user)
      return res.status(400).json({ message: "Admin already registered" });
  });
  const _user = new User({
    firstName,
    lastName,
    email,
    password,
    role: "admin",
    username: getRandomString(8)
  });
  _user.save((error, response) => {
    if (error) {
      return res.status(400).json({
        status: "E",
        message: "Something went wrong. Please contact admnistrator."
      });
    }

    res.status(200).json({
      data: { user: response },
      message: "Admin User created successfully",
      status: "S"
    });
  });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then(user => {
      if (user) {
        if (user && user.authenticate(password) && user.role === "admin") {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
          });
          const { firstName, lastName, email, role, fullName } = user;
          res.status(200).json({
            data: {
              token,
              user: { firstName, lastName, email, role, fullName }
            },
            message: "Sign in success",
            status: "S"
          });
        } else {
          res.status(400).json({
            message: "Invalid password",
            status: "F"
          });
        }
      } else {
        res.status(400).json({
          message: "Something went wrong. Please contact administrator",
          status: "F"
        });
      }
    })
    .catch(error => {
      return res.status(400).json({ message: "Error signing in" });
    });
};
