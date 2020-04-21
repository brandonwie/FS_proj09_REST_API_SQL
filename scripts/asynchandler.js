const asyncHandler = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (err) {
      //! Use the Express next() function in each route handler to pass any Sequelize validation errors to the global error handler.
      if (
        err.name === "SequelizeValidationError"
      ) {
        next(err);
      } else if (
        err.name ===
        "SequelizeUniqueConstraintError"
      ) {
        err.errors.map((err) => {
          err.message =
            "The email is already taken. Try another.";
        });
        next(err);
      } else {
        res.status(500).json("Unknown Error");
      }
    }
  };
};

module.exports = asyncHandler;
