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

let managerID;
let managerArr;
let managerFName;
let managerLName;

// =========================
// WELCOME PROMPT function
// =========================

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
		console.log("-".repeat(54));
		console.log(
			"\r\nWith Roger Roger, you can update, track, and delete \r\nteam members from your employee database. Let's get \r\nstarted."
		);
		console.log("\r\n", "-".repeat(54), "\r\n");
		mainMenu();
	});
}

// =========================
// MENU function
// =========================

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
					"Add an employee",
					"Add a department",
					"Add a position",
					"View all departments",
					"View all positions",
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
				case "Add an employee":
					addEmployee();
					break;
				case "Add a department":
					addDepartment();
					break;
				case "Add a position":
					addPosition();
					break;
				case "View all departments":
					viewDepartments();
					break;
				case "View all positions":
					viewPositions();
					break;
				case "Exit":
					connection.end();
					exitPath();
					break;
			}
		});
}

// =========================
// All ADD functions
// =========================

// add an employee
function addEmployee() {
	connection.query("SELECT * FROM roles", function (err, results) {
		if (err) throw err;
		console.log("test successful");
		inquirer
			.prompt([
				{
					type: "input",
					message: "What is the first name of the new employee?",
					name: "fname",
					validate: function (value) {
						if (!value) {
							console.log("Please enter a first name for the new employee.");
							return false;
						}
						return true;
					},
				},
				{
					type: "input",
					message: "What is the last name of the new employee?",
					name: "lname",
					validate: function (value) {
						if (!value) {
							console.log("Please enter a last name for the new employee.");
							return false;
						}
						return true;
					},
				},
				{
					type: "list",
					message: "What is their position within the organization?",
					name: "position",
					choices: function () {
						var choiceArray = [];
						for (var i = 0; i < results.length; i++) {
							choiceArray.push(results[i].title);
						}
						return choiceArray;
					},
				},
				{
					type: "list",
					message: "Who is their manager?",
					name: "manager",
					choices: getManagers(),
				},
			])
			.then((response) => {
				// slipt out the manager name into an array
				managerArr = response.manager.split(" ");
				// set the first and last name variables for the manager
				managerFName = managerArr[0];
				managerLName = managerArr[1];
				// select the proper roles id from the database
				connection.query(
					`SELECT id FROM roles WHERE title = '${response.position}'`,
					function (err, res) {
						// get the manager ID
						getManagerID();
						if (err) throw err;
						// set the values in the database
						connection.query(
							"INSERT INTO employees SET ?",
							{
								first_name: response.fname,
								last_name: response.lname,
								role_id: res[0].id,
								manager_id: managerID,
							},
							function (err, res) {
								if (err) throw err;
								console.log(
									chalk.green(
										`\r\n${response.fname} ${response.lname} was added to the employee list!`
									)
								);
								viewAllEmployees();
							}
						);
					}
				);
			});
	});
}
// add a department
function addDepartment() {
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
						chalk.green(
							`\r\n${response.name} was added to the department list!`
						)
					);
					viewDepartments();
				}
			);
		});
}
// add a position
function addPosition() {
	connection.query("SELECT * FROM departments", function (err, results) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					type: "input",
					message: "What position would you like to add?",
					name: "title",
					validate: function (value) {
						if (!value) {
							console.log("Please enter a name for the position.");
							return false;
						}
						return true;
					},
				},
				{
					type: "input",
					message: "What is the base salary?",
					name: "salary",
					validate: function (value) {
						if (isNaN(value)) {
							console.log("Please enter a number for the salary.");
							return false;
						}
						return true;
					},
				},
				{
					type: "list",
					message: "What department does this position live under?",
					choices: function () {
						var choiceArray = [];
						for (var i = 0; i < results.length; i++) {
							choiceArray.push(results[i].name);
						}
						return choiceArray;
					},
					name: "department",
				},
			])
			.then((response) => {
				connection.query(
					`SELECT id FROM departments WHERE name = '${response.department}'`,
					function (err, res) {
						if (err) throw err;
						connection.query(
							"INSERT INTO roles SET ?",
							{
								title: response.title,
								salary: response.salary,
								department_id: res[0].id,
							},
							function (err, res) {
								if (err) throw err;
								console.log(
									chalk.green(
										`\r\n${response.title} was added to the position list!`
									)
								);
								viewPositions();
							}
						);
					}
				);
			});
	});
}

// =========================
// All VIEW functions
// =========================

// view all employees (by ID)
function viewAllEmployees() {
	console.log(
		chalk.green("\r\nHere are all employees, ordered by ID numbers:\r\n")
	);
	let query = connection.query(
		`SELECT 
		e.id AS 'ID',
		CONCAT(e.first_name, ' ', e.last_name) AS Employee,
		roles.title AS 'Position',
		roles.salary AS 'Salary',
		departments.name AS Department,
		CONCAT(m.first_name, ' ', m.last_name) AS Manager
	FROM
		employees_db.employees AS e
			INNER JOIN
		roles ON (e.role_id = roles.id)
			INNER JOIN
		departments ON (roles.department_id = departments.id)
			LEFT JOIN
		employees_db.employees m ON e.manager_id = m.id;`,
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
		`SELECT 
		e.id AS 'ID',
		CONCAT(e.first_name, ' ', e.last_name) AS Employee,
		roles.title AS 'Position',
		roles.salary AS 'Salary',
		departments.name AS Department,
		CONCAT(m.first_name, ' ', m.last_name) AS Manager
	FROM
		employees_db.employees AS e
			INNER JOIN
		roles ON (e.role_id = roles.id)
			INNER JOIN
		departments ON (roles.department_id = departments.id)
			LEFT JOIN
		employees_db.employees m ON e.manager_id = m.id
		ORDER BY departments.name;`,
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
		`SELECT 
		e.id AS 'ID',
		CONCAT(e.first_name, ' ', e.last_name) AS Employee,
		roles.title AS 'Position',
		roles.salary AS 'Salary',
		departments.name AS Department,
		CONCAT(m.first_name, ' ', m.last_name) AS Manager
	FROM
		employees_db.employees AS e
			INNER JOIN
		roles ON (e.role_id = roles.id)
			INNER JOIN
		departments ON (roles.department_id = departments.id)
			LEFT JOIN
		employees_db.employees m ON e.manager_id = m.id
		ORDER BY manager;`,
		function (err, res) {
			if (err) throw err;
			console.table(res);
			mainMenu();
		}
	);
}
// view all departments within the company
function viewDepartments() {
	console.log(
		chalk.green("\r\nHere are all departments within your organization:\r\n")
	);
	let query = connection.query(
		`SELECT id AS 'ID', name AS 'Department' FROM departments;`,
		function (err, res) {
			if (err) throw err;
			console.table(res);
			mainMenu();
		}
	);
}
// view all positions within the company
function viewPositions() {
	console.log(
		chalk.green("\r\nHere are all departments within your organization:\r\n")
	);
	let query = connection.query(
		`SELECT id AS 'Job ID', title AS 'Position', salary AS 'Salary' FROM roles;`,
		function (err, res) {
			if (err) throw err;
			console.table(res);
			mainMenu();
		}
	);
}

// exit path
function exitPath() {
	// add lines above the ascii art
	console.log("\r", "-".repeat(54));
	// display ascii art using the figlet package
	figlet("B  Y  E", function (err, data) {
		if (err) {
			console.log("Something went wrong...");
			console.dir(err);
			return;
		}
		console.log(data);
		figlet("B  Y  E", function (err, data) {
			if (err) {
				console.log("Something went wrong...");
				console.dir(err);
				return;
			}
			console.log(data);
		});
		// add lines under the ascii art
		console.log("-".repeat(54));
	});
}

// =============================
// Helper functions
// =============================
function getManagers() {
	let managers = [];
	connection.query("SELECT * FROM employees", function (err, results) {
		if (err) throw err;
		for (let i = 0; i < results.length; i++) {
			managers.push(results[i].first_name + " " + results[i].last_name);
		}
		return managers;
	});
	return managers;
}

function getManagerID() {
	console.log(managerFName + " " + managerLName);
	connection.query(
		`SELECT id FROM employees WHERE first_name = '${managerFName}' AND last_name = '${managerLName}'`,
		function (err, res) {
			console.log(res[0].id);
			if (err) throw err;
			return res[0].id;
		}
	);
}
