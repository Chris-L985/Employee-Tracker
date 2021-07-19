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
('Michael', 'Myers', 2, 1),
('Freddy', 'Krueger', 1, 1),
('Jason', 'Vorhees', 3, 2),
('Patrick', 'Bateman', 3, 2),
('Hannibal', 'Lectar', 4, 2),
('Jack', 'Torrance', 2, 1),
('Norman', 'Bates', 1, 2),
('Laurie', 'Strode', 5, 2),
('Damien', 'Thorn', 7, 4),
('Ashley', 'Williams', 6, 2),
('Bill', 'Overbeck', 7, 4);