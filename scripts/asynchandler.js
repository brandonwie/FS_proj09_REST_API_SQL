const asyncHandler = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (err) {
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
