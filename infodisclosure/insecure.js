const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/infodisclosure', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);

// Route to authenticate user (VULNERABLE TO NOSQL INJECTION)
app.get('/userinfo', async (req, res) => {
  const { username } = req.query;

  // Vulnerable code: Directly using user-provided values in the query
  const user = await User.findOne({ username: username }).exec();

  if (user) {
    res.send(`User: ${user}`);
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// here we can embed mongoose query in the req side. So it could be some mongodb condition or anything on those lines
// again sanitize input to avoid Cross side scripting attack. Both tampering and info disclosure happening here.