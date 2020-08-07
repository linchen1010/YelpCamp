require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

let port = process.env.PORT || 3000;
let url =
  'mongodb+srv://shilinchen:B1coU2K72unN9hJ3@cluster0.zvwnr.mongodb.net/YelpCamp?retryWrites=true&w=majority' ||
  'mongodb://localhost/yelp_camp_v11';

// requring routes
let commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

// connect to mongodb
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONGIFURATION
app.use(
  require('express-session')({
    secret: 'Once again Rusty wins cutest dog!',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, (err) => {
  console.log(`Listen on port: ${port}`);
});
