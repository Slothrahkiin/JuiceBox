const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../db');
const usersRouter = express.Router();



usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get('/', (req, res) => {
    res.send({
      users: []
    });
  });

  usersRouter.post('/login', async (req, res, next) => {
    const { username, password, id } = req.body;
    
    const token = jwt.sign({id, username}, process.env.JWT_SECRET)
    
    
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
    
    try {
      const user = await getUserByUsername(username);
      
      if (user && user.password == password) {
        // create token & return to user
        res.send({ message: "you're logged in!", token });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
        
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

module.exports = usersRouter;