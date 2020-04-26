drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id int not null auto_increment,
	product_name text,
	department_name text,
	price double not null,
	stock_quantity int not null,
    product_sales double not null default 0,
    primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity) values
("Valve Index", "Gaming", 999.99, 17),
("Toilet Paper", "Home", 19.99, 1),
("Hand Sanitizer", "Health", 15.99, 1),
("Nintendo Switch", "Gaming", 299.99, 3),
("Xbox One X", "Gaming", 399.99, 10),
("Cloth Masks", "Health", 10.99, 2);

create table departments (
	department_id int not null auto_increment,
    department_name text,
    over_head_costs double not null,
    primary key (department_id)
);

insert into departments (department_name, over_head_costs) values
("Gaming", 399),
("Home", 100);