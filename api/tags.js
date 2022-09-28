const express = require('express');
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get('/', (req, res) => {
    res.send({
      "tags": []
    });
  });

module.exports = usersRouter;