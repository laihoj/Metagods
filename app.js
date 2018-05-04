var bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	express 				= require("express"),
	_						= require("underscore");
	app						= express();

app.use(require("express-session")({
	secret: process.env.SECRET || "SECRETSTRING",
	resave: false,
	saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(flash());

var url = process.env.DATABASEURL;
mongoose.connect(url);

app.use(function(req, res, next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/", function(req,res) {
	res.render("index");
});

app.get("/api", function(req,res) {
	res.send("API");
});

app.listen(process.env.PORT || 3000, function() {
	console.log("Metagods");
});
