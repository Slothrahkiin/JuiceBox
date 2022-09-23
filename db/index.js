const { Client } = require('pg')

const client = new Client('postgres://localhost:5432/juicebox-dev');

module.exports = {
    client,
  }
  async function getAllUsers() {
    const { rows:[user] } = await client.query(
      `SELECT id, username, name, location, active 
      FROM users;
    `);
  
    return user;
  }
  async function getAllPosts() {
    const { rows:[post] } = await client.query(
      `SELECT id, username, name, location, active 
      FROM users;
    `);
  
    return post;
  }
  async function getPostsByUser(userId) {
    try {
      const { rows } = await client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }
  async function getUserById(userId) {
    const { rows:[user] } = await client.query(`
    SELECT id, username, name, location, active
    FROM users
    WHERE id=${ userId }
  `);
  if (!user) {
    return null
  }
  user.password = null
  user.posts = await getPostsByUser(userId)
  return user
  }
  
  // and export them
  async function createUser({ username, password, name, location }) {
      try {
          const {rows:[user]} = await client.query(`
          INSERT INTO users(username, password, name, location) 
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (username) DO NOTHING 
        RETURNING *;
          `, [ username, password, name, location ]);
          
          return user;
        } catch (error) {
            throw error;
        }
    }
    async function createPost({
        authorId,
        title,
        content
      }) {
        try {
            const {rows:[post]} = await client.query(`
            INSERT INTO post("authorId", title, content) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING 
          RETURNING *;
            `, [ authorId, title, content ]);
            return post;
        } catch (error) {
          throw error;
        }
      }
      async function updatePost(id, fields = {}) {
        // build the set string
        const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
      
        // return early if this is called without fields
        if (setString.length === 0) {
          return;
        }
      
        try {
          const { rows: [ post ] } = await client.query(`
            UPDATE posts
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
          `, Object.values(fields));
      
          return post;
        } catch (error) {
          throw error;
        }
      }
    async function updateUser(id, fields = {}) {
        // build the set string
        const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
      
        // return early if this is called without fields
        if (setString.length === 0) {
          return;
        }
      
        try {
          const {rows:[user]} = await client.query(`
            UPDATE users
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
          `, Object.values(fields));
      
          return user;
        } catch (error) {
          throw error;
        }
      }
    module.exports = {
      client,
      getAllUsers,
      createUser, 
      updateUser,
      createPost,
      updatePost
    }