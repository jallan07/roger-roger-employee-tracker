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
    salary DECIMAL (10, 2),
    department_id INT NOT NULL REFERENCES departments(id),
    -- maybe add foreign key in the future
    PRIMARY KEY (id)
);

-- create the employees table
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL REFERENCES roles(id),
    manager_id INT NULL REFERENCES managers(id),
    PRIMARY KEY (id)
);

-- create the managers table
CREATE TABLE managers (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60),
    PRIMARY KEY (id)
);