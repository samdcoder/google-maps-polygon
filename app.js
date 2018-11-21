const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; 
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Points = require('./models/Points')
const env = require('./env');


const db_url = 'mongodb+srv://'+env.mongo_username+':'+env.mongo_pw+'@cluster0-xg3gi.mongodb.net/test?retryWrites=true'

mongoose.connect(db_url, function(err){
	if(err)
		throw err;
}, { useNewUrlParser: true });


app.use(bodyParser.json());

app.get('/set', function(req, res){
	res.sendFile(path.join(__dirname + '/public/set.html'));
})

app.post('/api/data', function(req, res){
	let data = req.body.data;
	const record = new Points({
				_id: new mongoose.Types.ObjectId(),
				points: data
				});
	
	record.save(function(err, result){
	if(err){
		console.log("Error: ", err);
		res.status(400).send('error storing in the database');
	}
	console.log("result = ", result);
	
	});
	res.status(200).send('success');
})


app.get('/api/getLatest', function(req, res){
	Points.findOne({}, {}, { sort: { field : 'asc', _id: -1 } }, function(err, polygon) {
 		 if(polygon == null){
 		 	res.send({'data': null})
 		 }
 		 else{
 		 	polygon = polygon.points;
 		    let data = [];
 		    for(var i = 0; i < polygon.length; i++){
 		 	  let obj = {
 		 	   	'lat': polygon[i].lat,
 		 	 	'long': polygon[i].long
 		 	}
 		 	data.push(obj);
 		  }
 		 res.send({'data': data});	
 		 }
 		 
	});
})


app.listen(PORT, function(){
	console.log("Server listening on port "+PORT);
});

