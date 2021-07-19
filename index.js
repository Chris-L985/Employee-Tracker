// link to Dependencies
const inquirer = require("inquirer");
const db = require("./db/connections");
const consTable = require("console.table");

// Function to update and use list
const updateEmployeesList = () => {
    return inquirer
      .prompt({
        // Initial prompt questions
        type: "list",
        name: "initialPrompt",
        message: "How can I help you?",
        choices: [
          "Return",
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      })
      // View Departments option
      .then((inqProceed) => {
        if (inqProceed.initialPrompt === "View all departments") {
          db.query(`SELECT * FROM Department`, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            updateEmployeesList();
          });
        //  else if to view roles
        } else if (inqProceed.initialPrompt === "View all roles") {
          db.query(
            `SELECT role.id, role.title, role.salary, department.name AS department
                    FROM role
                    LEFT JOIN department ON role.department_id = department.id`,
            (err, rows) => {
              if (err) throw err;
              console.table(rows);
              updateEmployeesList();
            }
          );
          //else if to go to employees
        } else if (inqProceed.initialPrompt === "View all employees") {
          db.query(
            `SELECT e.id, e.first_name, e.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(m.first_name," ",m.last_name) AS manager
                    FROM employee e
                    LEFT JOIN role ON e.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee m on e.manager_id = m.id;`,
            (err, rows) => {
              if (err) throw err;
              console.table(rows);
              updateEmployeesList();
            }
          );
          // else if to add a department
        } else if (inqProceed.initialPrompt === "Add a department") {
          return inquirer
            .prompt({
              type: "input",
              name: "department",
              message: "New Department:",
            })
            .then((addDepartment) => {
              const param = [addDepartment.department];
              db.query(
                `INSERT INTO department (name)
                        VALUES (?)`,
                param,
                (err, result) => {
                  if (err) {
                    console.log("This department already exists");
                    updateEmployeesList();
                  } else {
                    console.log(`${param} has been added to the list`);
                    updateEmployeesList();
                  }
                }
              );
            });
            // else if to add a role
        } else if (inqProceed.initialPrompt === "Add a role") {
          db.query(`SELECT DISTINCT * FROM department`, (err, row) => {
            if (err) {
              console.log(`Error: ${err}`);
              updateEmployeesList();
            } else {
                // new role information input
              return inquirer
                .prompt([
                  {
                    type: "input",
                    name: "title",
                    message: "New Role:",
                  },
                  {
                    type: "input",
                    name: "salary",
                    message: "Salary:",
                  },
                  {
                    type: "list",
                    name: "department",
                    choices: function () {
                      let choiceArray = [];
                      row.forEach((item) => choiceArray.push(item));
                      return choiceArray;
                    },
                    message: "Department for new role:",
                  },
                ])
                .then((addRole) => {
                  const param = [addRole.department];
                  db.query(
                    `SELECT id FROM department WHERE name = ?`,
                    param,
                    (err, row) => {
                      if (err) {
                        console.log(`Error: ${err}`);
                        updateEmployeesList();
                      } else {
                        let departmentId = row[0].id;
                        const param = [
                          addRole.title,
                          addRole.salary,
                          departmentId,
                        ];
                        db.query(
                          `INSERT INTO role (title, salary, department_id)
                                VALUES (?,?,?)`,
                          param,
                          (err, result) => {
                            if (err) {
                              console.log(
                                "Role may already exist or salary is not a decimal number"
                              );
                              updateEmployeesList();
                            } else {
                              console.log(
                                `The ${addRole.title} role has been added to the ${addRole.department} department`
                              );
                              updateEmployeesList();
                            }
                          }
                        );
                      }
                    }
                  );
                });
            }
          });
          // inquire adding new employee information
        } else if (inqProceed.initialPrompt === "Add an employee") {
          let sql = `SELECT * FROM role; SELECT id, CONCAT(first_name," ",last_name) AS full_name FROM employee`;
          db.query(sql, (err, row) => {
            if (err) {
              console.log(`Error: ${err}`);
              updateEmployeesList();
            } else {
                // new employee input
              return inquirer
                .prompt([
                  {
                    type: "input",
                    name: "firstName",
                    message: "First Name:",
                  },
                  {
                    type: "input",
                    name: "lastName",
                    message: "Last Name:",
                  },
                  {
                    type: "list",
                    name: "role",
                    choices: function () {
                      let choiceArray = [];
                      row[0].forEach((item) => choiceArray.push(item.title));
                      return choiceArray;
                    },
                    message: "Role:",
                  },
                  {
                    type: "list",
                    name: "manager",
                    choices: function () {
                      let choiceArray = ["None"];
                      row[1].forEach((item) => choiceArray.push(item.full_name));
                      return choiceArray;
                    },
                    message: "Manager:",
                  },
                ])
                // add employee manager info
                .then((addEmployee) => {
                  if (addEmployee.manager === "None") {
                    const param = [addEmployee.role];
                    let sql = `SELECT id FROM role WHERE title = ?`;
                    db.query(sql, param, (err, row) => {
                      if (err) {
                        console.log(`Error: ${err}`);
                        updateEmployeesList();
                      } else {
                        let roleId = row[0].id;
                        const param = [
                          addEmployee.firstName,
                          addEmployee.lastName,
                          roleId,
                          null,
                        ];
                        db.query(
                          `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?,?,?,?)`,
                          param,
                          (err, result) => {
                            if (err) {
                              console.log(`Error: ${err}`);
                              updateEmployeesList();
                            } else {
                              console.log(
                                `${addEmployee.firstName} ${addEmployee.lastName} has been added to the list.`
                              );
                              updateEmployeesList();
                            }
                          }
                        );
                      }
                    });
                  } else {
                    let managerArray = addEmployee.manager.split(" ", 2);
                    const param = [
                      addEmployee.role,
                      managerArray[0],
                      managerArray[1],
                    ];
                    let sql = `SELECT id FROM role WHERE title = ?; SELECT id FROM employee WHERE first_name = ? AND last_name = ? `;
                    db.query(sql, param, (err, row) => {
                      if (err) {
                        console.log(`Error: ${err}`);
                        updateEmployeesList();
                      } else {
                        let roleId = row[0][0].id;
                        let managerId = row[1][0].id;
                        const param = [
                          addEmployee.firstName,
                          addEmployee.lastName,
                          roleId,
                          managerId,
                        ];
                        db.query(
                          `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?,?,?,?)`,
                          param,
                          (err, result) => {
                            if (err) {
                              console.log(`Error: ${err}`);
                              updateEmployeesList();
                            } else {
                              console.log(
                                `${addEmployee.firstName} ${addEmployee.lastName} has been added to the list.`
                              );
                              updateEmployeesList();
                            }
                          }
                        );
                      }
                    });
                  }
                });
            }
          });
        } else if (inqProceed.initialPrompt === "Update an employee role") {
          let sql = `SELECT * FROM role; SELECT id, CONCAT(first_name," ",last_name) AS full_name FROM employee`;
          db.query(sql, (err, row) => {
            if (err) {
              console.log(`Error: ${err}`);
              updateEmployeesList();
            } else {
              return inquirer
                .prompt([
                  {
                    type: "list",
                    name: "employee",
                    choices: function () {
                      let choiceArray = [];
                      row[1].forEach((item) => choiceArray.push(item.full_name));
                      return choiceArray;
                    },
                    message: "Whose information would you like to update?",
                  },
                  {
                    type: "list",
                    name: "role",
                    choices: function () {
                      let choiceArray = [];
                      row[0].forEach((item) => choiceArray.push(item.title));
                      return choiceArray;
                    },
                    message: "What new role would you like applied?",
                  },
                ])
                .then((newEmployeeRole) => {
                  let employeeArray = newEmployeeRole.employee.split(" ", 2);
                  const param = [
                    newEmployeeRole.role,
                    employeeArray[0],
                    employeeArray[1],
                  ];
                  let sql = `SELECT id FROM role WHERE title = ?; SELECT id FROM employee WHERE first_name = ? AND last_name = ? `;
                  db.query(sql, param, (err, row) => {
                    if (err) {
                      console.log(`Error: ${err}`);
                      updateEmployeesList();
                    } else {
                      let roleId = row[0][0].id;
                      let employeeId = row[1][0].id;
                      const param = [roleId, employeeId];
                      db.query(
                        `UPDATE employee SET role_id = ? WHERE id = ?`,
                        param,
                        (err, result) => {
                          if (err) {
                            console.log(`Error: ${err}`);
                            updateEmployeesList();
                          } else {
                            console.log(
                              `${newEmployeeRole.employee}'s role has been changed to ${newEmployeeRole.role}`
                            );
                            updateEmployeesList();
                          }
                        }
                      );
                    }
                  });
                });
            }
          });
        } else {
          console.log(
            "Type 'node index.js' to try again."
          );
          db.end();
        }
      });
  };
  
  updateEmployeesList();