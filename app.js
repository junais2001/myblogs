// for processing env files 
require('dotenv').config();

// creating express application 
const express = require('express');
const expressLayout = require('express-ejs-layouts');  // using express layouts

// creating references 
const app = express();
const routermain = require('./routes/mainRoutes/main');
const connectDB = require('./routes/config/db');
const router = require('./routes/mainRoutes/admin');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongostore = require('connect-mongo');

// Connect to the database
connectDB();

// Setting up middlewares
app.use(express.static('public')); // for serving static files
app.use(expressLayout);  // using express layouts
app.set('layout', './layouts/main');  // setting main layout
app.set('view engine', 'ejs');  // setting EJS as the view engine

app.use(express.urlencoded({ extended: true }));  // to handle form data
app.use(express.json());  // to handle JSON data

// Middleware to use cookie-parser and session management
app.use(cookieParser());  // <-- Fix this line by calling it as a function
app.use(session({
    secret: 'Keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongostore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// Using routes
app.use(routermain);  // for main routes
app.use(router);  // for admin routes

// Define the port
const PORT = process.env.PORT || 4020;  // <-- Fix this to prioritize process.env.PORT

// Start the server
app.listen(PORT, () => {
    console.log(`The application is running on port number ${PORT}`);
});
