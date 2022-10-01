const express = require('express');
const { getPostsByTagName } = require('../db');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', (req, res) => {
    res.send({
      "tags": []
    });
  });
  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const tagName = req.param.tagName
    try {
      res.send({posts: getPostsByTagName(tagName)})
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
      next({name, message})
    }
  });

module.exports = tagsRouter;