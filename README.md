# Full Stack JavaScript Techdegree v2 - REST API Project

## Overview of the Provided Project Files

We've supplied the following files for you to use:

- The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
- We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
- The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
- The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
- The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
- The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```terminal
npm install

```

Second, seed the SQLite database.

```terminal
npm run seed
```

And lastly, start the application.

```terminal
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).

## Version Note

- 1.0.0

  - Ready to submit
  - Exceed Expectations Features

    1. Add additional user email address validations to the POST /api/users route.

    - `scripts/validator.js` `line 15`
    - `routes/user.js` `line 44`

    2. Ensure that a user can only edit and delete their own courses.

    - `routes/course.js` `line 106, 143`

    3. Update the Sequelize model queries for the Courses endpoint GET routes to filter out the following properties.

    - `routes/course.js` `line 46`
    - `scripts/auth.js` `line 20`

- 0.5.0

  - Finish Exceed Expectation features

- 0.4.0

  - The `POST` route in `routes/course.js` authenticates users => take the user's ID(the data passed from `scripts/auth.js`) as "userId"

- 0.3.0

  - TODO: fix authenticator to apply to 4 different routes
  - Setup Course routes and functions

- 0.2.0

  - Finish setting up `./routes/user.js`
  - Build authenticator(`./scripts/auth.js`), user form validator (`./scripts/validator.js`)
  - User get/post routes works as expected

- 0.1.0

  - setup routers (`./routes`)
  - connect DB and app (checked using [Postman](https://www.postman.com/))
