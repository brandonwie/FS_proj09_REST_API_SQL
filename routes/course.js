const express = require("express");
const router = express.Router();
const { Course } = require("../models");

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
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    // console.log(users);
    res.status(200).json(courses);
  })
);

module.exports = router;
