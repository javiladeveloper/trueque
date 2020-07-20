var express 		=  require("express");
var MongoClient		=  require("mongodb").MongoClient;
const { url } 		=  require("../Conexion/config");
var router			=  express.Router();

//Consulta para buscar los productos por categoria, tipo y nombre (Core Busqueda) /events/all
router.get("/all", (req, res) =>{
	//conecto la base de datos 
		var catProducto=req.body.categoria;
		var nomProducto=req.body.nombreProducto;
		var tipoProducto=req.body.tipo;
		var condicionProducto=req.body.condicion;
		var usuarioProducto=req.body.fk_usuario;
		var estadoProducto=req.body.estado;
		MongoClient.connect(url, (err, db) =>{ 
			var base = db.db("truequeMundo");
			var coleccion = base.collection("producto");
			coleccion.find({ 
				tipo:new RegExp(tipoProducto), //Producto o Servicio
				categoria:new RegExp(catProducto), //Informatica,hogar,resposteria,estilista,electrodomestico,etc...	
				nombreProducto: new RegExp(`^${nomProducto}`,'i'), //Nombre del producto busca con las primeras letras que ponga
				condicion:new RegExp(condicionProducto), //la condicion si es un producto es decir estoy tomando como valores del 0 al 10..donde 10 es nuevo y 0 inutil
				fk_usuario:new RegExp(usuarioProducto,'i'), //cada producto esta ligado a un usuario, yo podria buscar todos los productos de un mismo usuario por Correo elec.
				estado:new RegExp(estadoProducto) //si esta disponible o Truequeado 
			}).toArray(
				(error, eventos) =>{
				if (error) throw erro;				
				res.send(eventos);
				console.log(eventos)
			});
		  db.close();	
		});
});

//Consulta para obtener los productos de un usuario especifico  /events/all_producto
router.get("/all_producto", (req, res) =>{
	//conecto la base de datos
	if (req.session.email_user){
		var catProducto=req.body.categoria;
		var nomProducto=req.body.nombreProducto;
		var tipoProducto=req.body.tipo;
		var estadoProducto=req.body.estado;
		MongoClient.connect(url, (err, db) =>{ 
			var base = db.db("truequeMundo");
			var coleccion = base.collection("producto");
			coleccion.find({
				fk_usuario: req.session.email_user,
				tipo:new RegExp(tipoProducto),
				categoria:new RegExp(catProducto),
				nombreProducto: new RegExp(`^${nomProducto}`,'i'),
				estado:new RegExp(estadoProducto)
			}).toArray(
				(error, eventos) =>{
				if (error) throw erro;				
				res.send(eventos);
			});
		  db.close();	
		});
	}else{
		res.send("noLOGIN");
	}
});

router.post("/new_usuario", (req, res)=>{
	MongoClient.connect(url,(err, db)=>{
		if (err) throw err;
		var base = db.db("truequeMundo");
		var coleccion = base.collection("usuarios");
		var nID = req.body.title.trim() + Math.floor(Math.random(0),100 )+1;
		coleccion.save({
			_id:nID, 
			codigo:req.body.codigo, 
			nombre:req.body.nombre,
			apellido: req.body.apellido,
			email: req.body.email,
			password: req.body.password, 
            telefono: req.body.telefono,
            celular: req.body.celular,
            foto: req.body.foto,
            fechaNacimiento: req.body.fechaNacimiento,
            sexo: req.body.sexo,
            pais: req.body.pais,
            ciudad: req.body.ciudad,
			direccion: req.body.direccion,
			estado:"activo"
		});
		res.send("El evento a sido creado con exito!");
		db.close();
	});
});


router.post("/update_usuario", (req, res)=>{
	MongoClient.connect(url,(err, db)=>{
		if (err) throw err;
		var base = db.db("truequeMundo");
		var coleccion = base.collection("usuarios");
		try {
			;
			coleccion.update(
				{_id:req.body.id },
				{$set:{
                    nombre:req.body.nombre,
                    apellido: req.body.apellido,
                    email: req.body.email,
                    telefono: req.body.telefono,
                    celular: req.body.celular,
                    foto: req.body.foto,
                    body: req.body.fechaNacimiento,
                    pais: req.body.pais,
                    ciudad: req.body.ciudad,
					direccion: req.body.direccion,
					estado:req.body.estado    
					}
				}
			);
			res.send("El evento se a cambiado con exito!");
		} catch(e){
			console.log(e);
		}
		db.close();
	});
});



router.post("/new_producto", (req, res)=>{
	if (req.session.email_user){
		MongoClient.connect(url,(err, db)=>{
			if (err) throw err;
			var base = db.db("truequeMundo");
			var coleccion = base.collection("producto");
			var nID = req.body.title.trim() + Math.floor(Math.random(0),100 )+1;
			
			coleccion.save({
				_id:nID, 
				codigo:req.body.codigo, 
				nombreProducto:req.body.nombre,
				tipo: req.body.tipo,
				categoria: req.body.categoria,
				descripcion: req.body.descripcion,
				condicion: req.body.condicion,
				fk_usuario: req.session.fk_usuario,
				estado: req.body.estado
			});
			res.send("El evento a sido creado con exito!");
			db.close();
		});
	}	else{
		res.send("noLOGIN");
	}
	
	});
	
	
	router.post("/update_producto", (req, res)=>{
	
		MongoClient.connect(url,(err, db)=>{
			if (err) throw err;
			var base = db.db("truequeMundo");
			var coleccion = base.collection("producto");
			try {
				;
				coleccion.update(
					{_id:req.body.id },
					{$set:{
						nombreProducto:req.body.nombre,
						tipo: req.body.tipo,
						categoria: req.body.categoria,
						descripcion: req.body.descripcion,
						condicion: req.body.condicion,
						estado: req.body.estado
						}
					}
				);
				res.send("El evento se a cambiado con exito!");
			} catch(e){
				console.log(e);
			}
	
	
			db.close();
		});
	});

	router.post("/delete_producto", (req, res)=>{

		MongoClient.connect(url, (err, db)=>{
			if (err) throw err;
			var base = db.db("truequeMundo");
			var coleccion = base.collection("producto");
			
			try{
			coleccion.remove({
				_id:req.body.id, 
				fk_usuario: req.session.email_user
			});
			res.send("Evento borrado con exito!");
			}catch (err){
				res.send(err);		
			}	
			db.close();
		});
	});
	
    router.post("/new_fotoProducto", (req, res)=>{
		if (req.session.email_user){
			MongoClient.connect(url,(err, db)=>{
				if (err) throw err;
				var base = db.db("truequeMundo");
				var coleccion = base.collection("fotoProducto");
				var nID = req.body.title.trim() + Math.floor(Math.random(0),100 )+1;
				
				coleccion.save({
					_id:nID, 
					codigo:req.body.codigo,
					foto:req.body.foto,
					fk_producto:req.body.fk_producto
				});
				res.send("El evento a sido creado con exito!");
				db.close();
			});
		}	else{
			res.send("noLOGIN");
		}
		
		});
	
		router.post("/delete_producto", (req, res)=>{
	
			MongoClient.connect(url, (err, db)=>{
				if (err) throw err;
				var base = db.db("truequeMundo");
				var coleccion = base.collection("producto");
				
				try{
				coleccion.remove({
					_id:req.body.id, 
					fk_usuario: req.session.email_user
				});
				res.send("Evento borrado con exito!");
				}catch (err){
					res.send(err);		
				}	
				db.close();
			});
		});
		
router.get("/logout", (req,res)=>{
	req.session.email_user= false;
	req.session.destroy((err) =>{
  			res.send("adios");
	})
});


module.exports = router;