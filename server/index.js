const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const connectDB = require('./config/db.js');
const colors = require('colors');
const schema = require('./schema/schema.js');
require('dotenv').config();

// PORT
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// express app
const app = express();
app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);
// server running port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
