require('dotenv').config();
// =========== APP SETUP ===========
// dependencies
const express = require('express');
const passport = require('passport');
const session  = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const housingController = require('./controllers/housing-controller');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

const routes = require('./routes');
const db = require('./models');

// =========== APP CONFIG ===========
// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// deploy
if(process.env.NODE_ENV === "production"){
  app.use(express.static("../client/build"));
}

// passport config
require('./config/passport')(passport);

app.use(session({
  // use store to persis session in deployment for new build
  store: new SequelizeStore({
    db: db,
    table: 'Session'
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    _expires: 30 * 60 * 1000,
    httpOnly: true
  }
}))

// =========== APP INIT ===========

// LOGIN
app.use(passport.initialize());
app.use(passport.session()); 

// routes
app.use(routes);

// schedule cron job for fetching housing data
// cron.schedule('* * * * *', () => {
//   housingController.fetchHousingData();
// },{
//   scheduled: true,
//   timezone: "America/Los_Angeles"
// });

// =========== APP LAUNCH ===========

db.sequelize.sync()
.then(() => { 
  app.listen(PORT, () => {
    console.log(`Buzzed. Housing Alert is running on port ${PORT}`);
  });
})
.catch(() => console.log('Database connection failed...'))
