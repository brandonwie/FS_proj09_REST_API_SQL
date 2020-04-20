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
  check("password")
    .matches(/^(?=.*[!@#$%^&*]).+$/)
    .withMessage(
      "A password must contain at least 1 special charecter."
    )
    .matches(/^(?=.*[A-Z]).+$/)
    .withMessage(
      "A password must contain at least 1 uppercase letter."
    )
    .matches(/(?=.*[a-z]).+$/)
    .withMessage(
      "A password must contain at least 1 lowercase letter."
    )
    .matches(/^(?=.*[0-9]).+$/)
    .withMessage(
      "A password must contain at least 1 number."
    )
    .matches(/^(?=.{6,20}).*$/)
    .withMessage(
      "A password must be 6-20 charecters long."
    ),
];

module.exports = {
  userValidator,
};
