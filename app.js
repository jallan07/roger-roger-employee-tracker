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
		console.log("\r\n", "-".repeat(54));
		console.log(
			"\r\nWith Roger Roger, you can update, track, and delete \r\nteam members from your employee database. Let's get \r\nstarted."
		);
		console.log("\r\n", "-".repeat(54), "\r\n");
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
					"View all employees (by ID)",
					"View all employees (by department)",
					"View all employees (by manager)",
					"Add a department",
					"Exit",
				],
				name: "main",
			},
		])
		.then((answer) => {
			switch (answer.main) {
				case "View all employees (by ID)":
					viewAllEmployees();
					break;
				case "View all employees (by department)":
					viewAllEmployeeDepartments();
					break;
				case "View all employees (by manager)":
					viewAllEmployeeManagers();
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

// view all employees (by ID)
function viewAllEmployees() {
	console.log(
		chalk.green("\r\nHere are all employees, ordered by ID numbers:\r\n")
	);
	let query = connection.query(
		'SELECT employees.id AS "ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Position", roles.salary AS "Salary", departments.name AS "Department", employees.manager_id AS "Manager" ' +
			"FROM employees " +
			"INNER JOIN roles " +
			"ON (employees.role_id = roles.id) " +
			"INNER JOIN departments " +
			"ON (roles.department_id = departments.id)",
		function (err, res) {
			if (err) throw err;
			console.table(res);
			mainMenu();
		}
	);
}
// view all employees (by department)
function viewAllEmployeeDepartments() {
	console.log(
		chalk.green("\r\nHere are all employees, ordered by departments:\r\n")
	);
	let query = connection.query(
		'SELECT employees.id AS "ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Position", roles.salary AS "Salary", departments.name AS "Department", employees.manager_id AS "Manager" ' +
			"FROM employees " +
			"INNER JOIN roles " +
			"ON (employees.role_id = roles.id) " +
			"INNER JOIN departments " +
			"ON (roles.department_id = departments.id) " +
			"ORDER BY departments.name",
		function (err, res) {
			if (err) throw err;
			console.table(res);
			mainMenu();
		}
	);
}
// view all employees (by manager)
function viewAllEmployeeManagers() {
	console.log(
		chalk.green("\r\nHere are all employees, ordered by managers:\r\n")
	);
	let query = connection.query(
		'SELECT employees.id AS "ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Position", roles.salary AS "Salary", departments.name AS "Department", employees.manager_id AS "Manager" ' +
			"FROM employees " +
			"INNER JOIN roles " +
			"ON (employees.role_id = roles.id) " +
			"INNER JOIN departments " +
			"ON (roles.department_id = departments.id) " +
			"ORDER BY employees.manager_id",
		function (err, res) {
			if (err) throw err;
			console.table(res);
			mainMenu();
		}
	);
}

// =============================
// =============================
