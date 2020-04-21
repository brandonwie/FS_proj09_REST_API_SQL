const { check } = require("express-validator");

const validEmail = [
  //! EXCEED EXPECTATION 1-1 : check if the email address given is valid
  check("emailAddress")
    .isEmail()
    .withMessage(
      "Please enter a valid email address."
    ),
];

module.exports = { validEmail };
