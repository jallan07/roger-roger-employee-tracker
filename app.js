// dependencies
const figlet = require("figlet");
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const helper = require("./helpers");

// create the connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "mypasswordis6Str!pes",
	database: "employees_db",
});

// connect to the database, and init the welcomePrompt
connection.connect(function (err) {
	if (err) throw err;
	welcomePrompt();
});

// create the welcomePrompt function
function welcomePrompt() {
	// add lines above the ascii art
	console.log("\r", "-".repeat(54));
	// display ascii art using the figlet package
	figlet("R  O  G  E  R", function (err, data) {
		if (err) {
			console.log("Something went wrong...");
			console.dir(err);
			return;
		}
		console.log(data);
		figlet("R  O  G  E  R", function (err, data) {
			if (err) {
				console.log("Something went wrong...");
				console.dir(err);
				return;
			}
			console.log(data);
		});
		// add lines under the ascii art
		console.log("\r", "-".repeat(54));
		console.log(
			"With Roger Roger, you can update, track, and delete team members from your employee database. Let's get started."
		);
		console.log("\r", "-".repeat(54));
		mainMenu();
	});
}

// function that shows the app's main menu
function mainMenu() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "What would you like to do?",
				choices: [
					"Add a department",
					"Add a role",
					"Add an employee",
					// "Delete a department",
					// "Delete a role",
					// "Delete an employee",
					// "Update an employee",
					// "Update a manager",
					// "View a department",
					// "View a role",
					// "View an employee",
					// "View employees by manager",
					// "View total utilized budget for a department",
					"Exit",
				],
				name: "main",
			},
		])
		.then((answer) => {
			switch (answer.main) {
				case "Add a department":
					helper.addDepartment();
					mainMenu();
					break;
				case "Exit":
					connection.end();
					break;
			}
		});
}

// =============================
// =============================