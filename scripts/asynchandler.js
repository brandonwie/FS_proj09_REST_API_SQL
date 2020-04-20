const asyncHandler = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (err) {
      if (
        err.name === "SequelizeValidationError"
      ) {
        const errorMessages = err.errors.map(
          (err) => err.message
        );
        res.status(400).json({
          errors: errorMessages,
        });
      } else {
        res.status(500).json(err);
      }
    }
  };
};

module.exports = asyncHandler;
