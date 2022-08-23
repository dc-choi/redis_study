var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
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
);

// var options ={
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'rhdwl9685*',
//     database: 'idp'
// };
// var sessionStore = new MySQLStore(options);

// app.use(session({
//   secret:"asdfasffdas",
//   resave:false,
//   saveUninitialized:true,
//   store: sessionStore
// }));

app.use('/', async (req, res, next) => {
	var random = crypto.randomBytes(32).toString('base64');
	req.session.userId = random;
	req.session.save();
	console.log(1);
	const getSession = new Promise(function (resolve, reject) {
		// do something async here..
		req.sessionStore.get(req.sessionID, (error, session) => {
			if (error) {
				reject(error);
			} else {
				resolve(session);
			}
		});
	});
	await getSession.then((session) => {
		console.log(session);
	});
	console.log(3);
	// console.log(req.session);
	// console.log(req.session.id);
	// console.log(req.sessionID);
	// req.session.destroy(() => {
		// 	console.log('session done');
	// })
});

module.exports = app;
