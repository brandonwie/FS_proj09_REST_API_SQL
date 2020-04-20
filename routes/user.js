const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  validationResult,
} = require("express-validator");
const { User } = require("../models");
const {
  authenticator,
} = require("../scripts/auth");
const {
  userValidator,
} = require("../scripts/validator");
const asyncHandler = require("../scripts/asynchandler");

//* GET: User who is authenticated
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
  userValidator,
  asyncHandler(async (req, res) => {
    //* Catch validation results
    const errors = validationResult(req);
    //! errors returns an object: 'Result' has two key-value pairs; 'formatter' & 'errors'
    if (!errors.isEmpty()) {
      //! error.array() method filters and returns an array of 'errors'
      const errorMessages = errors
        .array()
        .map((err) => err.msg);
      res
        .status(400)
        .json({ errors: errorMessages });
    } else {
      const user = req.body;
      //! EXCEED EXPECTATION 1-2 : find the email address already exist
      const findMatchingEmail = await User.findOne(
        {
          where: {
            emailAddress: `${req.body.emailAddress}`,
          },
        }
      );
      if (findMatchingEmail) {
        res.status(400).json({
          errors:
            "The email is taken. Try another.",
        });
      } else {
        for (const key in user) {
          // hash password
          if (key === "password") {
            user[key] = bcrypt.hashSync(
              user[key]
            );
          }
        }
        await User.create(user);
        res
          .status(201)
          .set("Location", "/")
          .end();
      }
    }
  })
);

//? BUILT IT FOR TEST (WILL DELETE)
router.delete(
  "/:id",
  authenticator,
  asyncHandler(async (req, res) => {
    console.log(req.user);
    if (req.user.id === req.params.id) {
      const user = await User.findByPk(
        req.params.id
      );
      if (user) {
        await user.destroy();
        res.status(204).json({
          message: "Delete Successful!",
        });
      } else {
        res
          .status(400)
          .json({ Error: "User not found" });
      }
    } else {
      // send error "unauthorized"
      res
        .status(401)
        .json({ Error: "Unauthorized" });
    }
  })
);

module.exports = router;
