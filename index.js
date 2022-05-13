const express = require('express');
const cors = require('cors');
const mysql =require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const { DB_ENDPOINT, DB_NAME, DB_PASS, DB_USER, DB_PORT, PORT } = process.env;

var connection = mysql.createConnection({
	host: DB_ENDPOINT, 
	user: DB_USER,
	password: DB_PASS,
	port: DB_PORT,
	database: DB_NAME
})

var createConnection = async () => { await connection.connect((err) => {
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

app.listen(process.env.PORT, () => console.log(`The factory backend is running in port: :${process.env.PORT}`));
