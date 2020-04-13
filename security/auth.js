const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

// authenticate user function
const authenticator = async (req, res, next) => {
  //* credentials returns an object named Credentials with two key-value pairs name: username, pass: password
  const credentials = auth(req);
  // if all credential values exist,
  if (credentials.name && credentials.pass) {
    // find a user matches email
    const dbUser = await User.findOne({
      // find a user data where the email-address given matches username
      where: {
        emailAddress: credentials.name,
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "emailAddress",
        "password",
      ],
    });
    // if there's a matching user,
    console.log(
      "dbUser: ",
      typeof dbUser,
      dbUser
    );
    if (dbUser) {
      const dbUserObj = dbUser.dataValues;
      const dbUserPassword = dbUserObj.password;
      // sync the passwords
      const passwordSync = bcrypt.compareSync(
        credentials.pass,
        dbUserPassword
      );
      // if the password matches,
      if (passwordSync) {
        // create empty req.user to pass
        req.currentUser = {};
        // to remove password from being exposed
        Object.entries(dbUserObj).forEach(
          ([key, value]) => {
            if (key !== "password") {
              req.currentUser[key] = value;
            }
          }
        );
        next();
      } else {
        res.status(400).json({
          message: "The password doesn't match",
        });
      }
    } else {
      res.status(400).json({
        message: "The username doesn't exist",
      });
    }
  } else if (
    !credentials.name &&
    credentials.pass
  ) {
    res
      .status(400)
      .json({ message: "Please enter username" });
  } else if (
    credentials.name &&
    !credentials.pass
  ) {
    res
      .status(400)
      .json({ message: "Please enter password" });
  } else {
    res.status(400).json({
      message:
        "Please enter username and password",
    });
  }
};
module.exports = { authenticator };
