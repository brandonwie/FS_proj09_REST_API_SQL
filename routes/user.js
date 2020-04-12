const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  validationResult,
} = require("express-validator");
const { User } = require("../models");
const {
  authenticator,
} = require("../security/auth");
const {
  validator,
} = require("../security/validator");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      console.log(
        "An error has caught in asyncHandler function"
      );
      res.status(500).json(error);
    }
  };
}

// TODO
router.get(
  "/",
  authenticator,
  asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
  })
);

// POST: new user
router.post(
  "/",
  validator,
  asyncHandler(async (req, res) => {
    //* newUser to assign in User.create()
    const newUser = {};
    //* Catch validation results
    const errors = validationResult(req);
    //! errors returns an object named 'Result', has two key-value pairs; 'formatter' & 'errors'
    if (!errors.isEmpty()) {
      //! error.array() method filters and returns an array of 'errors'
      const errorMessages = errors
        .array()
        .map((err) => err.msg);
      res
        .status(400)
        .json({ errors: errorMessages });
    } else {
      //* user => an object with key-value pair
      const user = req.body;
      //! EXCEED EXPECTATION : find the email address already exist
      const findEmail = await User.findOne({
        where: {
          emailAddress: `${req.body.emailAddress}`,
        },
      });
      if (findEmail) {
        res.status(400).json({
          errors: "The email already exist",
        });
      } else {
        //! Object.entries(obj) outputs an array that has arrays of key-value pairs
        Object.entries(user).forEach(
          ([key, value]) => {
            if (key === "password") {
              //! obj[string] format
              newUser[key] = bcrypt.hashSync(
                value
              );
            } else {
              newUser[key] = value;
            }
          }
        );
        await User.create(newUser);
        res
          .status(201)
          .set("Location", "/")
          .end();
      }
    }
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(
      req.params.id
    );
    if (user) {
      await user.destroy();
      res
        .status(204)
        .json({ msg: "Delete Successful!" });
    } else {
      res
        .status(400)
        .json({ msg: "user not found" });
    }
  })
);

module.exports = router;
