
-- Pre-populating departments
INSERT INTO department (name) VALUES 
('Sales'), 
('Engineering'), 
('Finance');

-- Pre-populating roles
INSERT INTO role (title, salary, department_id) VALUES 
('Sales Manager', 80000, 1), 
('Salesperson', 50000, 1), 
('Software Engineer', 100000, 2), 
('Lead Engineer', 120000, 2), 
('Accountant', 70000, 3), 
('Chief Financial Officer', 150000, 3);

-- Pre-populating employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL), 
('Jane', 'Smith', 2, 1), 
('Eric', 'Casanova', 3, NULL), 
('Bob', 'Brown', 4, 3), 
('Charlie', 'Davis', 5, NULL), 
('Eve', 'Wilson', 6, 5);

