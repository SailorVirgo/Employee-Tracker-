import client from './connection';

export const viewAllDepartments = async () => {
    const res = await client.query('SELECT * FROM department');
    return res.rows;
};

export const viewAllRoles = async () => {
    const res = await client.query(`SELECT role.id, role.title, department.name AS department, role.salary 
                                    FROM role 
                                    JOIN department ON role.department_id = department.id`);
    return res.rows;
};

export const viewAllEmployees = async () => {
    const res = await client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                                    manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
                                    FROM employee
                                    JOIN role ON employee.role_id = role.id
                                    JOIN department ON role.department_id = department.id
                                    LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    return res.rows;
};

export const addDepartment = async (name: string) => {
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
};

export const addRole = async (title: string, salary: number, department_id: number) => {
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
};

export const addEmployee = async (first_name: string, last_name: string, role_id: number, manager_id: number | null) => {
    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
        [first_name, last_name, role_id, manager_id]);
};

export const updateEmployeeRole = async (employee_id: number, role_id: number) => {
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
};
