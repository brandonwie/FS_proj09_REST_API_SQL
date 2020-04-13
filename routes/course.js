const express = require("express");
const router = express.Router();
const { User, Course } = require("../models");

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

/**
 * @param {} - GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // returns an array
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          attributes: [
            "firstName",
            "lastName",
            "emailAddress",
          ],
        },
      ],
    });
    res.status(200).json(courses);
  })
);

/**
 * @param {id} - GET /api/courses/:id 200 - Returns a course (including the user that owns the course) for the provided course ID
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log(
      typeof req.params.id,
      req.params.id
    );
    const course = await Course.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        attributes: [
          "firstName",
          "lastName",
          "emailAddress",
        ],
      },
    });
    res.status(200).json(course);
  })
);

/**
 * @param {} - POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
 */

module.exports = router;
