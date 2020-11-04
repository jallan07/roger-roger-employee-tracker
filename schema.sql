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
    PRIMARY KEY (id)
);

-- create the employees table
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL REFERENCES roles(id),
    manager_id INT NULL REFERENCES employees(id),
    PRIMARY KEY (id)
);

-- -- add some dummy data to the departments tables
-- INSERT INTO departments (name)
-- VALUES ("Finance");

-- INSERT INTO departments (name)
-- VALUES ("Operations");

-- INSERT INTO departments (name)
-- VALUES ("Dev");

-- INSERT INTO departments (name)
-- VALUES ("Sales");

-- -- add some dummy data to the roles tables
-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Senior Financial Analyst", "105,300.23", "1");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("General Manager", "63,872.15", "2");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Software Engineer IV", "54,101.78", "3");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Web Designer I", "92,102.50", "3");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Account Executive", "81,683.91", "4");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Junior Financial Analyst", "77,642.87", "1");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Assistant General Manager", "90,883.07", "2");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Assistant General Manager", "90,883.07", "2");





-- ================
-- add some dummy data to the employees tables
INSERT INTO employees (first_name, last_name, role_id)
VALUES ("");