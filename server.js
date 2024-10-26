const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
require('./config/database');

// Controllers
const authController = require('./controllers/auth');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js');
const addUserToViews = require('./middleware/addUserToViews');
const isSignedIn = require('./middleware/isSignedIn');
const passUserToView = require('./middleware/passUserToView.js');


const app = express();
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// MIDDLEWARE

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(addUserToViews);


// Public Routes
app.get('/', async (req, res) => {
  res.render('index.ejs');
});

app.use(passUserToView)
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users', usersController);
app.use('/users/:userId/foods',foodsController);



app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`The express app is ready on port ${port}!`);
});
