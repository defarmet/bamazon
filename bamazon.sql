drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id int not null auto_increment,
	product_name text,
	department_name text,
	price double,
	stock_quantity int,
    primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity) values
("Valve Index", "Gaming", 999.99, 17),
("Toilet Paper", "Home", 19.99, 1)