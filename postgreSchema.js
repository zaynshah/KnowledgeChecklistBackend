import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts";

// try {
//   await Deno.remove("knowledge_checklist.db");
// } catch {
//   // nothing to remove
// }
// let config;

// You can use the connection interface to set the connection properties
// config = {
//   database: "knowledge",
//   user: "postgres",
// };

const client = new Client("postgres://iwiyqnnt:Z1YjV6TH1xzQBUsFQo8YR94_ZC01ILsQ@tai.db.elephantsql.com/iwiyqnnt");
await client.connect();
// await client.queryArray(`
//   CREATE TABLE learning_objectives(
//     id SERIAL UNIQUE PRIMARY KEY,
//     cohort_id INTEGER NOT NULL,
//     topic TEXT NOT NULL,
//     learning_objective TEXT NOT NULL,
//     not_confident TEXT DEFAULT '.',
//     confident TEXT DEFAULT '.'
//   )`);

// await client.queryArray(
//   `CREATE TABLE users (
//     id SERIAL UNIQUE PRIMARY KEY,
//     email TEXT UNIQUE NOT NULL,
//     cohort_id INTEGER NOT NULL,
//     encrypted_password TEXT NOT NULL,
//     created_at DATE NOT NULL,
//     updated_at DATE NOT NULL,
//     admin BOOLEAN NOT NULL
//   )`
// );

// await client.queryArray(
//   `CREATE TABLE sessions (
//     id TEXT PRIMARY KEY NOT NULL,
//     created_at DATE NOT NULL,
//     user_id INTEGER NOT NULL,
//     email TEXT NOT NULL,
//     isAdmin BOOLEAN NOT NULL
//   )`
// );

// await client.queryArray(
//   `CREATE TABLE results (
//     id SERIAL UNIQUE PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     email TEXT NOT NULL,
//     cohort_id INTEGER NOT NULL,
//     topic TEXT NOT NULL,
//     learning_objective TEXT NOT NULL,
//     score INTEGER DEFAULT 1,
//     isActive BOOLEAN DEFAULT FALSE,
//     not_confident TEXT NOT NULL,
//     confident TEXT NOT NULL,
//     dark_mode BOOLEAN DEFAULT FALSE
//     )`
// );
// let A = [
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'React', 'Accurately recall the React component lifecycle','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'React', 'Pass props to a React component from another','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'React', 'Pass a function as a prop to a React component to act as a callback','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'React', 'Understand what state is and how to use it to updata a react component','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'React', 'Use setState() to update the state of a React component','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'React', 'Use map to convert a JS object into a React component or HTML element','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'SQL', 'To Understand and define what a relational database is','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'SQL', 'Know how to write an SQL query to retrieve all data from a table ','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'SQL', 'Be able to retrieve data from multiple table at the same time by using the join operator','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective, not_confident) VALUES (1, 'GIT', 'Know how to make a directory','https://reactjs.org/docs/react-component.html')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (1, 'React', 'Understand what state is and how to use it')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'HTML/CSS', 'Understand what parent and child is')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'HTML/CSS', 'Can create and link a stylesheet')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'Javascript', 'Be able to link a Javascript file in your project')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'Javascript', 'Be able to do a console.log()')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'Javascript', 'Be able to use built-in object methods like .keys()')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'Javascript', 'Be able to loop over an object with for...in')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'Javascript', 'Be able to convert an object into an array')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'React', 'Understand the difference between class and functional components')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (2, 'React', 'Be able to create a React application with create-react-app')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (3, 'HTML/CSS', 'Understand what parent and child is')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (3, 'HTML/CSS', 'Can create and link a stylesheet')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (3, 'Javascript', 'Be able to link a Javascript file in your project')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (3, 'Javascript', 'Be able to do a console.log()')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (3, 'React', 'Understand the difference between class and functional components')`,
//   `INSERT INTO learning_objectives(cohort_id, topic, learning_objective) VALUES (3, 'React', 'Be able to create a React application with create-react-app')`,
// ];
// await client.queryArray({
//   text: `INSERT INTO users(email, cohort_id, encrypted_password, created_at, updated_at, admin) VALUES('admin@sigmalabs.co.uk', 0, '$2a$08$1pO8zSzvfNwvyW/IRRdgk.Ac7cYQHKEob4kjGEZZqcVUfS/VyikKm', current_timestamp,current_timestamp, true)`,
// });

// A.forEach((i) => {
//   client.queryArray({
//     text: i,
//   });
// });

// await client.queryArray({
//   text: "DELETE * from sessions",
// });
