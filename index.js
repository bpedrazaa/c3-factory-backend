const express = require('express');
const cors = require('cors');
const mysql =require('mysql');
const bodyParser = require('body-parser');


const app = express();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var connection = mysql.createConnection({
	host: "factory-database.cvbyqpqy6eav.us-east-1.rds.amazonaws.com",
	user: "admin",
	password: "db1001001.",
	port: "3306",
	database: "factory_database"
})

var createConnection = async () => {
	await connection.connect((err) => {
		if(err){
			console.error("Database connection failed: " + err.stack);
		}
		console.log("Connected to the database");
	});
}


// Tool function to convert the query request a promise.
function query_promise (query){
	return new Promise((resolve, reject) => {
		connection.query(query, (err, result)=> {
			if(err) return reject(err);
			resolve(result)
		});
	});
}


async function getDefects(){
	var queryString = "select * from defect";

	var result = await query_promise(queryString);
	return result;
}

async function addDefect(body){
	var queryString = `insert into defect(employeeId, defect, levelUrgency, timeRepair, image) values (${body.employeeId}, "${body.defect}", "${body.levelUrgency}", ${body.timeRepair}, "${body.image}");`

	await query_promise(queryString);
}

app.get('/', (request, response) => {
	  response.send('Welcome to the Factory Backend');
});

app.get('/api/defect', async (req, res) => {
	const defects = await getDefects();
	res.send(defects);
});

app.post('/api/defect', async(req, res) => {
	var newDefect = req.body;
	await addDefect(newDefect);
	res.send(newDefect);
});

app.listen(PORT, () => console.log(`The factory backend is running in port: :${PORT}`));
