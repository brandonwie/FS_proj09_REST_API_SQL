"use strict";

const {
  Sequelize,
  DataTypes,
} = require("sequelize");

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg:
              "Please provide a value for 'First Name'",
          },
          notEmpty: {
            msg:
              "Please provide a value for 'First Name'.",
          },
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg:
              "Please provide a value for 'Last Name'",
          },
          notEmpty: {
            msg:
              "Please provide a value for 'Last Name'.",
          },
        },
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        //! EXCEED EXPECTATION 1-2 : find the email address already exist
        unique: true,
        validate: {
          notNull: {
            msg:
              "Please provide a value for 'Email'",
          },
          notEmpty: {
            msg:
              "Please provide a value for 'Email'.",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg:
              "Please provide a value for 'Password'",
          },
          notEmpty: {
            msg:
              "Please provide a value for 'Password'.",
          },
        },
      },
    },
    { sequelize }
  );
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: "userId",
      allowNull: false,
    });
  };
  return User;
};
