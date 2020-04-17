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

//* GET: User who is authenticated
router.get(
  "/",
  authenticator,
  asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
  })
);

// router.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const user = await User.findAll({
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//       include: [
//         {
//           model: Course,
//           attributes: ["title"],
//         },
//       ],
//     });
//     res.status(200).json(user);
//   })
// );

// POST: new user
router.post(
  "/",
  validator,
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
      //! EXCEED EXPECTATION : find the email address already exist
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
        .json({ msg: "User not found" });
    }
  })
);

module.exports = router;
