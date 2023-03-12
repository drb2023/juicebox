const { Client } = require("pg");
const client = new Client('postgres://localhost:5432/juicebox-dev');

// -----USER METHODS-----
// -----CREATE A USER-----
async function createUser({
    username, 
    password,
    name,
    location
}) {
    try {
        const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password, name, location)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password, name, location]);
        return user;
    } catch (error) {
    throw error;
    }
}

// -----UPDATE A USER-----
async function updateUser(id, fields = {}) {
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ] } = await client.query(`
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

// -----GET ALL USERS-----
async function getAllUsers() {
    try{
        const { rows } = await client.query(`
            SELECT id, username, name, location, active
            FROM users;
        `);

        return rows;
    } catch (error) {
        throw error;
    }
}

// -----GET USER BY ID-----
async function getUserById(userId) {
    try {
        const { rows: [ user ] } = await client.query(`
            SELECT id, username, name, location, active
            FROM users
            WHERE id=${ userId }
        `);
  
        if (!user) {
            return null
        }
        user.posts = await getPostsByUser(userId);
  
        return user;
    } catch (error) {
        throw error;
    }
}


// -----POST METHODS-----
// -----CREATE A POST-----
async function createPost({
    authorId, 
    title,
    content
}) {
    try {
        const { rows: [ post ] } = await client.query(`
        INSERT INTO posts("authorId", title, content)
        VALUES ($1, $2, $3)
        RETURNING *;
        `, [authorId, title, content]);
        return post;
    } catch (error) {
    throw error;
    }
}

// -----UPDATE A POST-----
async function updatePost(id, fields = {}) {
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

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

// -----GET ALL POSTS-----
async function getAllPosts() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM posts;
        `);
  
        return rows;
    } catch (error) {
        throw error;
    }
}

// -----GET POSTS BY USER-----
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


// -----EXPORTS-----
module.exports = {
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser
}




// -----UPDATE A POST----- chase
// async function updatePost(id, {title, content}) {
//     try {
//         const {rows} = await client.query(`
//         UPDATE posts
//         SET title = $1, content = $2
//         WHERE id = $3
//         RETURNING *;
//         `,[title, content, id]);
//         return rows;
//     } catch (error) {
//         console.log(error);
//     }
// }

// -----GET ALL POSTS-----
// async function getAllPosts() {
//     const { rows } = await client.query(
//       `SELECT "authorId", title, content
//       FROM posts;
//     `);

//     return rows;
// }

// chase - kinda works
// async function getUserById(userId) {
//     try {
//         const {rows} = await client.query(`
//         SELECT * FROM users
//         WHERE id = ${userId};
//         `)
//         if(!rows.length) return null;
//         delete rows.password;
//         const posts = await getPostsByUser(userId);
//         rows.posts = posts
//         return rows;
//     } catch (error) {
//         console.log(error);
//     }
// }


// async function getUserById(userId) {
//     if (rows.length === 0) {
//         return null;
//       }
//     try {
//         const { rows: [ user ] } = await client.query(`
//             SELECT id, username, name, location
//             FROM users;
//             SELECT * FROM posts
//             WHERE "authorId"=${ userId };
//         `);
    
//         return user;
//       } catch (error) {
//         throw error;
//       }
    // first get the user (NOTE: Remember the query returns 
      // (1) an object that contains 
      // (2) a `rows` array that (in this case) will contain 
      // (3) one object, which is our user.
    // if it doesn't exist (if there are no `rows` or `rows.length`), return null
  
    // if it does:
    // delete the 'password' key from the returned object
    // get their posts (use getPostsByUser)
    // then add the posts to the user object with key 'posts'
    // return the user object
//   }