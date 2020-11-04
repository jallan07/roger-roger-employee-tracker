// dependencies
const figlet = require("figlet");
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");

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
					"View all employees",
					// "View all employees by department",
					"Add a department",
					"Exit",
				],
				name: "main",
			},
		])
		.then((answer) => {
			switch (answer.main) {
				case "View all employees":
					viewAllEmployees();
					break;
				case "Add a department":
					addDepartment();
					break;
				case "Exit":
					connection.end();
					break;
			}
		});
}

// add a department
function addDepartment() {
	console.log("this is the department...");
	inquirer
		.prompt([
			{
				type: "input",
				message: "What department would you like to add?",
				name: "name",
				validate: function (value) {
					if (!value) {
						console.log("Please enter a name for the department.");
						return false;
					}
					return true;
				},
			},
		])
		.then((response) => {
			let query = connection.query(
				"INSERT INTO departments SET ?",
				{
					name: response.name,
				},
				function (err, res) {
					if (err) throw err;
					console.log(
						chalk.bgCyan(
							`${response.name} was department added to the department list!\nBelow is a list of all departments within your organization:`
						)
					);
				}
			);
			connection.query("SELECT * FROM departments", function (err, res) {
				if (err) throw err;
				console.table(res);
				connection.end();
			});
		});
}

// view all employees
function viewAllEmployees() {
	console.log("Path not yet finished...");
	let query = connection.query(
		"SELECT employees.first_name, employees.last_name, roles.title FROM employees INNER JOIN roles ON (employees.role_id = roles.title)",
		function (err, res) {
			if (err) throw err;
			console.log(res);
		}
	);
}

// =============================
// =============================
