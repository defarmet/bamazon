require("dotenv").config();
var inquirer = require("inquirer");
var sprintf = require("sprintf-js").sprintf;
var mysql = require("mysql");

var config = {
	host: "localhost",
	port: 3306,
	user: "root",
	password: process.env.SQL_PASS,
	database: "bamazon"
}
var connection = mysql.createConnection(config);

function added(err, response)
{
	if (err)
		throw err;

	console.log("DEPARTMENT ADDED");
	connection.end();
}

function add_department(response)
{
	connection.query("insert into departments set ?",
		{
			department_name: response.department,
			over_head_costs: response.cost
		}, added);
}

function print_department(value)
{
	console.log(sprintf("| %-13d | %-15.15s | %-14.2f | %-9.2f | %-10.2f |",
		value.department_id, value.department_name,
		value.over_head_costs, value.product_sales,
		value.product_sales - value.over_head_costs));
}

function print_departments(err, departments)
{
	if (err)
		throw err;

	for (var i = 0; i < departments.length - 1; i++) {
		if (departments[i].department_id === departments[i + 1].department_id) {
			departments[i].product_sales += departments[i + 1].product_sales;
			departments.splice(i + 1, 1);
			i--;
		}
	}

	console.log("| DEPARTMENT ID | DEPARTMENT NAME | OVERHEAD COSTS |   SALES   |   PROFIT   |");
	console.log("| ------------- | --------------- | -------------- | --------- | ---------- |");
	departments.forEach(print_department);
	connection.end();
}

function choice(response)
{
	switch (response.choice) {
	case "VIEW PRODUCT SALES BY DEPARTMENT":
		connection.query("select * from departments inner join products on departments.department_name = products.department_name order by departments.department_id", print_departments);
		break;

	case "CREATE NEW DEPARTMENT":
		inquirer.prompt([{
			type: "input",
			name: "department",
			message: "ENTER DEPARTMENT NAME:"
		},
		{
			type: "number",
			name: "cost",
			message: "ENTER OVERHEAD COST:"
		}]).then(add_department);
	}
}

function connect(err)
{
	if (err)
		throw err;

	inquirer.prompt({
		type: "list",
		name: "choice",
		message: "SUPERVISOR CONSOLE:",
		choices: ["VIEW PRODUCT SALES BY DEPARTMENT", "CREATE NEW DEPARTMENT"]
	}).then(choice);
}

connection.connect(connect);
