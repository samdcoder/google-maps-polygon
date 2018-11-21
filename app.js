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

app.get('/random', function(req, res){
	console.log("in the /random");
	console.log("user name mongo = ", env.mongo_username);
	console.log("password mongo = ", env.mongo_pw);

	res.sendFile(path.join(__dirname + '/public/set.html'));
})

app.post('/api/data', function(req, res){
	console.log("in the /api/data");
	let data = req.body.data;
	//send the data to database here
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
	Points.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, polygon) {
 		 console.log("latest polygon is ",polygon);
 		 res.send({'data': polygon});
	});
})


app.listen(PORT, function(){
	console.log("Server listening on port "+PORT);
});

