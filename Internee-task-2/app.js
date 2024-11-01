const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 5000; // Define the port to listen on

// Get MongoDB URI from environment variables or use a default
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin';

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('MongoDB connected successfully'); // Log successful connection
})
.catch(err => {
    console.error('MongoDB connection error:', err); // Log connection error
});

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!'); // Response for the root URL
});

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Log server start message
});
