// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const path = require('path');
const express = require('express');
const cors = require('cors');
// Start up an instance of app
const app = express();
console.log(__dirname);
/* Middleware*/
//Here we are configuring express as middle-ware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

// Setup Server
const PORT = 8081;
app.listen(8081, () => {
  console.log(`listening on port: ${PORT}`);
});
