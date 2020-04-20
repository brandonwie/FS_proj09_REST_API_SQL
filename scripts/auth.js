const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User, Course } = require("../models");

// authenticate user function
const authenticator = async (req, res, next) => {
  //* credentials returns an object named Credentials with two key-value pairs name: username, pass: password
  const credentials = auth(req);
  const name = credentials.name;
  const pass = credentials.pass;
  // if all credential values exist,
  if (name && pass) {
    // find a user matches email
    const dbUser = await User.findOne({
      // find a user data where the email-address given matches username
      where: {
        emailAddress: name,
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "emailAddress",
        "password",
      ],
      include: [
        {
          model: Course,
          attributes: [
            "id",
            "title",
            "description",
            "estimatedTime",
            "materialsNeeded",
          ],
        },
      ],
    });
    //! if a user is found,
    if (dbUser) {
      const dbUserObj = dbUser.dataValues;
      const dbUserPassword = dbUserObj.password;
      //! check passwords match.
      const passwordSync = bcrypt.compareSync(
        pass,
        dbUserPassword
      );
      //! if password match,
      if (passwordSync) {
        //! set the user on the request
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
        //! IF password is incorrect
        res.status(401).json({
          message:
            "The email or password you entered is incorrect.",
        });
      }
    } else {
      //! IF username is incorrect
      res.status(401).json({
        message:
          "The email or password you entered is incorrect.",
      });
    }
  } else if (!name && pass) {
    res.status(400).json({
      message: "Please enter 'username'",
    });
  } else if (name && !pass) {
    res.status(400).json({
      message: "Please enter 'password'",
    });
  } else {
    res.status(400).json({
      message:
        "Please enter 'username' and 'password'",
    });
  }
};

module.exports = { authenticator };
