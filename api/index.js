const express = require('express');
const apiRouter = express.Router();

// JWT
const jwt = require('jsonwebtoken');
const { getUserById, getUserByUsername } = require('../db');
const { JWT_SECRET } = process.env;

// AUTHORIZATION MIDDLEWARE
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { username } = jwt.verify(token, JWT_SECRET);

      if (username) {
        req.user = await getUserByUsername(username);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
    next();
  });

// ROUTERS
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);

// ERROR HANDLER
apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
  });

// EXPORTS
module.exports = apiRouter;