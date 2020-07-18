var BodyParser =  require("body-parser");
var express    =  require("express");
var MongoClient=  require("mongodb").MongoClient;
var session    =  require("express-session");
var http       =  require("http");
var events     =  require("./router");
const { url,PORT } 		=  require("../Conexion/config");
require("../Conexion/config");

var app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));
app.use(express.static("client"));
app.use(session({
	secret: "truequemund@12345Sesi@n",
	resave: false,
	saveUninitialized: false
}));

//creo el servidor 
http.createServer(app);

//eschucho el inicio de sesion 
app.post("/login", (req, res)=>{
	//almacenos los datos en variables
	var user = req.body.user;
	var pass = req.body.pass;
	//* conecto a la base de datos 
	MongoClient.connect(url, function (err, db){
		if (err)throw err; // gestiono el erro
		var base = db.db("truequeMundo");
		var coleccion = base.collection("usuarios");
		coleccion.findOne({email: user, password: pass,estado:"activo"}, (error, user)=>{
			if (error) throw error;
			if (user){
				req.session.email_user = user.email;
				res.send("Validado");
			}else{
				console.log(user);
				res.send("Usuario o contraseña no son correctos o la cuenta esta inactiva");
			}
		});
		  db.close();
	});
}); 

app.use("/events", events);
app.listen(PORT, ()=>{
	console.log("El servidor de truequeMundo está corriendo por el servidor : " + PORT);
});

