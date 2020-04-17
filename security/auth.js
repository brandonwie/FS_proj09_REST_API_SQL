const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User, Course } = require("../models");

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
        "firstName",
        "lastName",
        "emailAddress",
        "password",
      ],
      include: [
        {
          model: Course,
          attributes: ["title"],
        },
      ],
    });
    //! if a user is found,
    if (dbUser) {
      const dbUserObj = dbUser.dataValues;
      console.log(dbUserObj);
      const dbUserPassword = dbUserObj.password;
      //! check passwords match.
      const passwordSync = bcrypt.compareSync(
        credentials.pass,
        dbUserPassword
      );
      //! if password match,
      if (passwordSync) {
        // create empty req.user to pass
        req.user = {};
        //! remove password from being exposed & pass it via req.user
        Object.entries(dbUserObj).forEach(
          ([key, value]) => {
            if (key !== "password") {
              req.user[key] = value;
            }
          }
        );
        next();
      } else {
        //! PASSWORD INCORRECT
        res.status(400).json({
          message:
            "The email or password you entered is incorrect.",
        });
      }
    } else {
      //! USERNAME INCORRECT
      res.status(400).json({
        message:
          "The email or password you entered is incorrect.",
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
