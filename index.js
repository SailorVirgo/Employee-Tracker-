// const { Client } = require('pg');
const inquirer = require('inquirer');
const client = require('./db/connection');

/*
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'd1tto',
    port: 5432,
});

client.connect()
    .then(() => {
        console.log('Connected to the database');
        mainMenu();
    })
    .catch(err => console.error('Database connection error', err.stack));
*/


const mainMenu = () => {
    console.log('Displaying main menu...');
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ]
    }).then(({ action }) => {
        switch (action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                client.end();
                break;
        }
    }).catch(err => console.error('Error in main menu prompt', err));
};

const viewAllDepartments = async () => {
    try {
        const res = await client.query('SELECT * FROM department');
        console.table(res.rows);
        mainMenu();
    } catch (err) {
        console.error('Error viewing all departments', err);
        mainMenu();
    }
};

const viewAllRoles = async () => {
    try {
        const res = await client.query(`SELECT role.id, role.title, department.name AS department, role.salary 
                                        FROM role 
                                        JOIN department ON role.department_id = department.id`);
        console.table(res.rows);
        mainMenu();
    } catch (err) {
        console.error('Error viewing all roles', err);
        mainMenu();
    }
};

const viewAllEmployees = async () => {
    try {
        const res = await client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                                        FROM employee 
                                        JOIN role ON employee.role_id = role.id 
                                        JOIN department ON role.department_id = department.id 
                                        LEFT JOIN employee manager ON manager.id = employee.manager_id`);
        console.table(res.rows);
        mainMenu();
    } catch (err) {
        console.error('Error viewing all employees', err);
        mainMenu();
    }
};

const addDepartment = () => {
    inquirer.prompt({
        name: 'name',
        message: 'Enter the name of the department:'
    }).then(async ({ name }) => {
        try {
            await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
            console.log(`Added ${name} to the database`);
            mainMenu();
        } catch (err) {
            console.error('Error adding department', err);
            mainMenu();
        }
    }).catch(err => console.error('Error in add department prompt', err));
};

const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            name: 'department_id',
            message: 'Enter the department ID for the role:'
        }
    ]).then(async ({ title, salary, department_id }) => {
        try {
            await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
            console.log(`Added ${title} to the database`);
            mainMenu();
        } catch (err) {
            console.error('Error adding role', err);
            mainMenu();
        }
    }).catch(err => console.error('Error in add role prompt', err));
};

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            message: 'Enter the first name of the employee:'
        },
        {
            name: 'last_name',
            message: 'Enter the last name of the employee:'
        },
        {
            name: 'role_id',
            message: 'Enter the role ID for the employee:'
        },
        {
            name: 'manager_id',
            message: 'Enter the manager ID for the employee (leave blank if none):'
        }
    ]).then(async ({ first_name, last_name, role_id, manager_id }) => {
        try {
            await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
                [first_name, last_name, role_id, manager_id || null]);
            console.log(`Added ${first_name} ${last_name} to the database`);
            mainMenu();
        } catch (err) {
            console.error('Error adding employee', err);
            mainMenu();
        }
    }).catch(err => console.error('Error in add employee prompt', err));
};

const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            name: 'employee_id',
            message: 'Enter the employee ID to update:'
        },
        {
            name: 'role_id',
            message: 'Enter the new role ID for the employee:'
        }
    ]).then(async ({ employee_id, role_id }) => {
        try {
            await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
            console.log(`Updated employee's role`);
            mainMenu();
        } catch (err) {
            console.error('Error updating employee role', err);
            mainMenu();
        }
    }).catch(err => console.error('Error in update employee role prompt', err));
};

// Kick off our code 
mainMenu();