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
var total = 0;

function update(err, response)
{
	if (err)
		throw err;

	console.log("YOUR TOTAL IS: " + total);
	connection.end();
}

function select(err, response)
{
	if (err)
		throw err;

	if (response[0].stock_quantity < amount) {
		console.log("INSUFFICIENT QUANTITY");
		connection.end();
	} else {
		var quantity = response[0].stock_quantity;
		total = response[0].price * amount;
		connection.query("UPDATE products SET ? WHERE ?",
			[{stock_quantity: quantity - amount}, {item_id: id}],
			update);
	}
}

function select_product(response)
{
	id = response.id;
	amount = response.amount;
	connection.query("select * from products where item_id=?", id, select);
}

function print_product(value)
{
	console.log(sprintf("| %-9d | %-28.28s | %-9.2f |", value.item_id, value.product_name, value.price));
}

function print_products(err, response)
{
	if (err)
		throw err;

	console.log("|  ITEM ID  |         PRODUCT NAME         |   PRICE   |");
	console.log("| --------- | ---------------------------- | --------- |");
	response.forEach(print_product);
	inquirer.prompt([{
		type: "number",
		name: "id",
		message: "ENTER ID OF PRODUCT TO BUY:"
	},
	{
		type: "number",
		name: "amount",
		message: "ENTER NUMBER OF UNITS TO BUY:"
	}]).then(select_product);
}

function connect(err, response)
{
	if (err)
		throw err;

	connection.query("select * from products", print_products);
}

connection.connect(connect);
