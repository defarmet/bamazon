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

var id = 0;
var amount = 0;

function added(err, response)
{
	if (err)
		throw err;

	console.log("ITEM ADDED");
	connection.end();
}

function add_product(response)
{
	connection.query("insert into products set ?",
		{
			product_name: response.name,
			department_name: response.department,
			price: response.price,
			stock_quantity: response.quantity
		}, added);
}

function add_item()
{
	inquirer.prompt([{
		type: "input",
		name: "name",
		message: "ENTER PRODUCT NAME:"
	},
	{
		type: "input",
		name: "department",
		message: "ENTER DEPARTMENT NAME:"
	},
	{
		type: "number",
		name: "price",
		message: "ENTER ITEM PRICE:"
	},
	{
		type: "number",
		name: "quantity",
		message: "ENTER QUANTITY:"
	}]).then(add_product);
}

function print_product(value)
{
	console.log(sprintf("| %-9d | %-28.28s | %-9.2f | %-12d |", value.item_id, value.product_name, value.price, value.stock_quantity));
}

function print_products(products)
{
	console.log("|  ITEM ID  |         PRODUCT NAME         |   PRICE   |   QUANTITY   |");
	console.log("| --------- | ---------------------------- | --------- | ------------ |");
	products.forEach(print_product);
}

function updated(err, response)
{
	if (err)
		throw err;

	console.log(amount + " UNIT(S) ADDED TO ITEM ID: " + id);
	connection.end();
}

function update_inv(err, response)
{
	if (err)
		throw err;

	var quantity = response[0].stock_quantity;
	connection.query("UPDATE products SET ? WHERE ?",
		[{stock_quantity: quantity + amount}, {item_id: id}], updated);
}

function select_product(response)
{
	id = response.id;
	amount = response.amount;
	connection.query("select * from products where item_id=?", id,
		update_inv);
}

function add_inv(err, response)
{
	if (err)
		throw err;

	print_products(response);

	inquirer.prompt([{
		type: "number",
		name: "id",
		message: "ENTER ID OF PRODUCT:"
	},
	{
		type: "number",
		name: "amount",
		message: "ENTER NUMBER OF UNITS TO ADD:"
	}]).then(select_product);
}

function view(err, response)
{
	if (err)
		throw err;

	print_products(response);
	connection.end();
}

function choice(response)
{
	switch (response.choice) {
	case "VIEW PRODUCTS FOR SALE":
		connection.query("select * from products", view);
		break;

	case "VIEW LOW INVENTORY":
		connection.query("select * from products where stock_quantity < 5", view);
		break;

	case "ADD TO INVENTORY":
		connection.query("select * from products", add_inv);
		break;

	case "ADD NEW PRODUCT":
		add_item();
		break;
	}
}

function connect(err, response)
{
	if (err)
		throw err;

	inquirer.prompt({
		type: "list",
		name: "choice",
		message: "MANAGER CONSOLE:",
		choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY",
			"ADD TO INVENTORY", "ADD NEW PRODUCT"]
	}).then(choice);
}

connection.connect(connect);
