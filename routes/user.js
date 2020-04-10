const express = require("express");
const router = express.Router();
const { User } = require("../models");
const authUser = require("../auth");
const bcryptjs = require("bcryptjs");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

router.get(
  "/",
  authUser,
  asyncHandler(async (req, res) => {
    console.log(req.dbUser);
    res.status(200).json(req.reqUser);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const user = req.body;
    console.log(user);
    await User.create(user);
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
