var bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	express 				= require("express"),
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

app.get("/", function(req,res) {
	res.render("index");
});

app.listen(process.env.PORT || 3000, function() {
	console.log("Metagods");
});
