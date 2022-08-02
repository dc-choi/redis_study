var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require("connect-redis")(session);
var { createClient } = require("redis");
var crypto = require("crypto");
var base64url = require("base64url");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
  })
)

app.use('/', (req, res, next) => {
	var random = crypto.randomBytes(32).toString('base64');
	req.session.userId = random;
	req.session.save();
	redisClient.get('sess:' + req.sessionID, (err, session) => {
		console.log('GET Data In Redis', session);
	})
	console.log(req.session);
	console.log(req.session.id);
	console.log(req.sessionID);
	// req.session.destroy(() => {
		// 	console.log('session done');
	// })
});

module.exports = app;
