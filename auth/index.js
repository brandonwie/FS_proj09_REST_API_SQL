const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");
const { User } = require("../models");

// authenticate user function
const authUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  if (credentials) {
    const user = await User.findOne({
      // find a user data where the email-address given matches username
      where: {
        emailAddress: credentials.name,
      },
    });
    // if the user exist in DB, compare two passwords
    if (user) {
      console.log(user.dataValues);
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      // if authenticated, sign in user to credentials
      if (authenticated) {
        credentials = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }
  if (message) {
    console.warn(message);
    res
      .status(401)
      .json({ message: "Access Denied" });
  } else {
    next();
  }
};

module.exports = authUser;
