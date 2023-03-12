const {
    client,
    getAllUsers,
    createUser,
    updateUser,
    getAllPosts,
    getPostsByUser,
    getUserById,
    createPost,
    updatePost
} = require("./index");

async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!");
    } catch (error) {
        console.log("Error dropping tables");
        throw error;
    }
}

async function createTables () {
    try {
        console.log("Starting to build tables...");
        await client.query(`
            CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
            );
            CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
            );
      `);
        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
  }

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Austrailia' });
        const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Just Sandra', location: "Ain't tellin'" });
        const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side' });
        // console.log(albert);
        // console.log(sandra);
        // console.log(glamgal);
        console.log("Finished creating users!");
    } catch(error) {
        console.error("Error creating users!");
        throw error;
    }
}  

async function createInitialPosts() {
    try {
        console.log("Starting createInitialPosts func...");
        const [albert, sandra, glamgal] = await getAllUsers();
  
        await createPost({
            authorId: albert.id,
            title: "Albert's First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love reading them."
        });

        await createPost({
            authorId: sandra.id,
            title: "Sandra's First Post",
            content: "Hello posts table."
          });
        
        await createPost({
            authorId: glamgal.id,
            title: "GG - Joshua",
            content: "Test post number 1."
        });
        console.log("Finished creating posts!");
    } catch (error) {
      throw error;
    }
}

async function rebuildDB () {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        console.log(error);
    }
}

async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "Updated Post",
        content: "Updated Content from testDB"
      });
      console.log("Result:", updatePostResult);
  
      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());