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
const asyncHandler = require("../scripts/asynchandler");

//* GET: User who is authenticated
router.get(
  "/",
  authenticator,
  asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
  })
);

//* POST: Create a new user
router.post(
  "/",
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
        .json({ message: errorMessages });
    } else {
      const user = req.body;
      for (const key in user) {
        //* hash password
        if (key === "password") {
          user[key] = bcrypt.hashSync(user[key]);
        }
      }
      await User.create(user);
      res.status(201).set("Location", "/").end();
    }
  })
);

//? BUILT IT FOR TEST (WILL DELETE)
router.delete(
  "/:id",
  authenticator,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(
      req.params.id
    );
    await user.destroy();
    res.status(204).end();
  })
);

module.exports = router;
