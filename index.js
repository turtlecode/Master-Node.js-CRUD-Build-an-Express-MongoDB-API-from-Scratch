const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());  // For parsing JSON data

const uri = "mongodb://localhost:27017";  // MongoDB connection string
const dbName = 'mydb';  // The database we will use
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);  // Selecting the 'mydb' database
    console.log('MongoDB connection successful');
  })
  .catch(err => {
    console.error('MongoDB connection failed', err);
  });

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js CRUD app with MongoDB!');
});

// Create a user (POST)
app.post('/users', (req, res) => {
  const user = req.body;  // User data in JSON format
  const collection = db.collection('users');  // Accessing the 'users' collection

  collection.insertOne(user)
    .then(result => {
      res.status(201).send(`User added: ${result.insertedId}`);
    })
    .catch(err => {
      res.status(500).send('An error occurred');
    });
});

// Get all users (GET)
app.get('/users', (req, res) => {
  const collection = db.collection('users');

  collection.find().toArray()
    .then(users => {
      res.json(users);  // Sending users as JSON
    })
    .catch(err => {
      res.status(500).send('An error occurred');
    });
});

// Get a user by id (GET)
app.get('/users/:id', (req, res) => {
  const { id } = req.params;  // Getting the user ID from params
  const collection = db.collection('users');

  collection.findOne({ _id: new ObjectId(id) })
    .then(user => {
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      res.json(user);  // Sending the user as JSON
    })
    .catch(err => {
      res.status(500).send('An error occurred');
    });
});

// Update a user (PUT)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;  // Updated user data
  const collection = db.collection('users');

  collection.updateOne(
    { _id: new ObjectId(id) },  // Finding the user by ID
    { $set: updatedUser }  // Updating the user
  )
    .then(result => {
      if (result.matchedCount === 0) {
        res.status(404).send('User not found');
        return;
      }
      res.send(`User updated: ${id}`);
    })
    .catch(err => {
      res.status(500).send('An error occurred');
    });
});

// Delete a user (DELETE)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const collection = db.collection('users');

  collection.deleteOne({ _id: new ObjectId(id) })
    .then(result => {
      if (result.deletedCount === 0) {
        res.status(404).send('User not found');
        return;
      }
      res.send(`User deleted: ${id}`);
    })
    .catch(err => {
      res.status(500).send('An error occurred');
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});