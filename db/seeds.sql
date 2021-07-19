INSERT INTO Department (name)
VALUES
('Sales'),
('Marketing'),
('Finance'),
('Warehouse');

INSERT INTO Role (title, salary, department_id)
VALUES 
('Head of Sales', 120.000, 1),
('Salesman', 75.000, 1),
('Marketing Director', 145.000, 2),
('Accountant', 110.000, 3),
('Project Management', 95.000, 4),
('Warehouse Laborer', 65.000, 4),
('Driver', 75.000, 4);

INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES 
('Michael', 'Myers', 2, 2),
('Freddy', 'Krueger', 1, NULL),
('Jason', 'Vorhees', 3, NULL),
('Patrick', 'Bateman', 4, NULL),
('Hannibal', 'Lectar', 4, NULL),
('Jack', 'Torrance', 2, 2),
('Norman', 'Bates', 6, 8),
('Laurie', 'Strode', 5,NULL),
('Damien', 'Thorn', 7, 8),
('Ashley', 'Williams', 6, 8),
('Bill', 'Overbeck', 7, 8);