var bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	express 				= require("express"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose"),
	app						= express();

app.use(require("express-session")({
	secret: process.env.SECRET || "SECRETSTRING",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(flash());

var url = process.env.DATABASEURL || "mongodb://jaakko:laiho@ds261929.mlab.com:61929/metagods";
mongoose.connect(url);

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

var User = require("./models/user");
var Deck = require("./models/deck");


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/api", function(req,res) {
	res.send("API");
});

app.get("/deck/:deck", function(req,res){
	res.send("decklist get found");
});

app.post("/deck", function(req,res){
	Deck.create(req.body.deck, function(err, newDeck) {
		if(err) {
			console.log(err);
			req.flash("error", "Deck not added");
			res.redirect("/");
		} else {
			console.log("Deck added");
			req.flash("success", "New Deck Added");
			res.redirect("/");
		}
	});
});

app.get("/player", isAuthenticated, function(req,res){
	res.render("profile");
});

app.post("/player", function(req,res){
	var newPlayer = {
		username: req.body.username,
		decks: []
	};
	User.register(new User(newPlayer), req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			res.redirect("/");
		} else {
			passport.authenticate("local")(req, res, function() {
				res.redirect(req.session.redirectTo || '/');
				delete req.session.redirectTo;
			}
		)}
	});
});

app.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), function(req, res) {
	if(!req.user) {
		req.flash("error", "Issue signing up");
		res.redirect("/login");
	} else {
		req.flash("success", "Logged in");
		res.redirect(req.session.redirectTo || '/');
		delete req.session.redirectTo;
	}
});

app.get("/login", function(req, res) {
	res.render('login');
});

app.get("/register", function(req, res) {
	res.render('register');
});

app.get("/logout",function(req, res){
	req.logout();
	req.flash("success", "Logged out");
	res.redirect("/");
});

app.get("/", function(req,res) {
	res.render("index");
});

function isAuthenticated(req,res,next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.session.redirectTo = req.path;
	req.flash("error", "Please login first");
	res.redirect("/login");
}


app.listen(process.env.PORT || 3000, function() {
	console.log("Metagods");
});
