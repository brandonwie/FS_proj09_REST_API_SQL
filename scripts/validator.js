const { check } = require("express-validator");

const userValidator = [
  check("firstName")
    .matches(/^[A-Z][a-zA-Z]+$/)
    .withMessage(
      "First name must contain letters only."
    ),
  check("lastName")
    .matches(/^[A-Z][a-zA-Z]+$/)
    .withMessage(
      "Last name must contain letters only."
    ),
  //! EXCEED EXPECTATION 1-1 : check if the email address given is valid
  check("emailAddress")
    .isEmail()
    .withMessage(
      "Please enter a valid email address."
    ),
];

module.exports = {
  userValidator,
};
