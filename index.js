const express = require('express');
const cors = require('cors');
const mysql =require('mysql');


const app = express();
const PORT = 4000;
app.use(express.json());
app.use(cors());

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
	var defects = [];

	var result = await query_promise(queryString)
	for(var i in result){
		var defectData = {
			defectId: result[i].defectId,
			defect: result[i].defect,
			employeeId: result[i].employeeId,
			levelUrgency: result[i].levelUrgency,
			timeRepair: result[i].timeRepair,
			image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.TNFTciYlwsdDgrFHrzB1xwHaHa%26pid%3DApi&f=1"
		}
		defects.push(defectData);
	}
	return defects;
}

app.get('/', (request, response) => {
	  response.send('Welcome to the Factory Backend');
});

app.get('/api/defect', async (req, res) => {
	createConnection();
	const defects = await getDefects();
	res.send(defects);
});

app.listen(PORT, () => console.log(`The factory backend is running in port: :${PORT}`));
