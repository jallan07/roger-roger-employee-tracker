-- drop the database if it already exists
DROP DATABASE IF EXISTS employees_db;

-- create the database
CREATE database employees_db;

-- select the employees database, and use that for the following commands
USE employees_db;

-- create the departments table
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

-- create the roles table
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL REFERENCES departments(id),
    PRIMARY KEY (id)
);

-- create the roles table
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL REFERENCES roles(id),
    manager_id INT NULL,
    PRIMARY KEY (id)
);

-- add some dummy data to the departments tables
INSERT INTO departments (name)
VALUES ("marketing");

INSERT INTO departments (name)
VALUES ("sales");

INSERT INTO departments (name)
VALUES ("product");

INSERT INTO departments (name)
VALUES ("human resources");

INSERT INTO departments (name)
VALUES ("finance");

-- add some dummy data to the roles tables
INSERT INTO roles (title, salary, department_id)
VALUES ("software engineer", "90000", "3");

INSERT INTO roles (title, salary, department_id)
VALUES ("senior accountant", "100000", "5");

-- add some dummy data to the employees tables