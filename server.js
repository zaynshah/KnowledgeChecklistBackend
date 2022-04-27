import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v2.5.0/mod.ts";
import { abcCors } from "https://deno.land/x/cors/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const app = new Application();
const db = new DB("./knowledge_checklist.db");
const PORT = 8080;
const allowedHeaders = ["Authorization", "Content-Type", "Accept", "Origin", "User-Agent"];

app
  .use(allowCors())
  .get("/:user_id/LOs", getLOs)
  .get("/cohorts/:cohort_id/LOs", getCohortLOs)
  .get("/cohorts", getCohorts)
  .get("/:user_id/topics", getTopicsOnly)
  .get("/cohort/:cohort_id/cohortTopics", getTopicsOnlyPerCohort)
  .get("/students/:cohort_id/results", getStudents)
  .get("/student/:user_id/data", getStudentData)
  // .post("/postLO", postLO)
  .post("/users", postSignup)
  .post("/sessions", postLogin)
  .post("/:user_id/LOs", postScore)
  // .post("/postCohort", postCohort)
  .post("/postDark", postDarkMode)
  .patch("/postNewLO", postEditLO)
  // .delete("/deleteLOs", deleteLOs)
  .start({ port: PORT });
console.log(`Server running on http://localhost:${PORT}`);

function allowCors() {
  return abcCors({
    origin: `http://localhost:3000`,
    headers: allowedHeaders,
    credentials: true,
  });
}

async function getLOs(server) {
  const { user_id } = await server.params;
  const query = `
    SELECT *
    FROM results
    WHERE user_id = ?
  `;

  const LOs = [...(await db.query(query, [user_id])).asObjects()];

  if (LOs.length !== 0) {
    return server.json(LOs, 200);
  } else {
    return server.json({ error: "Student does not exist" }, 400);
  }
}

async function getCohortLOs(server) {
  const { cohort_id } = await server.params;
  const query = `
    SELECT *
    FROM learning_objectives
    WHERE cohort_id = ?
    ORDER BY topic ASC
  `;
  // comment for my self spread return [] we want in [{}]
  const cohortLOs = [...(await db.query(query, [cohort_id]).asObjects())];
  console.log(cohortLOs);
  return server.json(cohortLOs);
}

async function getCohorts(server) {
  const query = `
    SELECT DISTINCT cohort_id 
    FROM learning_objectives
    ORDER BY cohort_id ASC
  `;
  const cohorts = [...(await db.query(query).asObjects())];
  return server.json(cohorts, 200);
}

async function getTopicsOnly(server) {
  const { user_id } = await server.params;
  const query = `
    SELECT DISTINCT topic
    FROM results
    WHERE user_id = ?
  `;

  const cohortTopics = [...(await db.query(query, [user_id]).asObjects())];

  if (cohortTopics) {
    return server.json(cohortTopics, 200);
  } else {
    return server.json({ error: "Topic list does not exist." }, 400);
  }
}

async function getTopicsOnlyPerCohort(server) {
  const { cohort_id } = await server.params;
  const query = `
    SELECT DISTINCT topic
    FROM learning_objectives
    WHERE cohort_id = ?
    
  `;
  const cohortTopics = [...(await db.query(query, [cohort_id]).asObjects())];

  if (cohortTopics) {
    return server.json(cohortTopics, 200);
  } else {
    return server.json({ error: "Topic list does not exist." }, 400);
  }
}

async function getStudents(server) {
  const { cohort_id } = await server.params;
  const query = `
    SELECT DISTINCT email, user_id
    FROM results
    WHERE cohort_id = ?
  `;
  const LOs = [...(await db.query(query, [cohort_id]).asObjects())];
  return server.json(LOs, 200);
}

async function getStudentData(server) {
  const { user_id } = await server.params;
  const query = `
  SELECT *
  FROM results
  WHERE user_id = ?
  ORDER BY topic ASC
  `;
  const LOs = [...(await db.query(query, [user_id]).asObjects())];
  return server.json(LOs, 200);
}

async function checkValidUrl(url) {
  try {
    await fetch(url);
  } catch (error) {
    return false;
  }
  return true;
}

async function postLO(server) {
  const { cohort_id, topic, learning_objective, notConfident, confident } = await server.body;
  if (learning_objective.length <= 10) {
    return server.json({ error: "learning objective must be more than 10 characters!" }, 400);
  }

  if (confident.length > 0) {
    if (!(await checkValidUrl(confident))) {
      return server.json({ error: "Invalid URL resource" }, 400);
    }
  }
  if (notConfident.length > 0) {
    if (!(await checkValidUrl(notConfident))) {
      return server.json({ error: "Invalid URL resource" }, 400);
    }
  }

  const query = `
    INSERT INTO learning_objectives(cohort_id, topic, learning_objective,not_confident,confident)
    VALUES (?, ?, ?, ? , ?)
  `;
  db.query(query, [cohort_id, topic, learning_objective, notConfident, confident]);

  const check = [
    ...db.query(
      "SELECT DISTINCT(users.email), users.cohort_id, users.id FROM learning_objectives JOIN users ON users.cohort_id = learning_objectives.cohort_id WHERE users.cohort_id=?",
      [cohort_id]
    ),
  ];

  check.forEach((i) =>
    db.query(
      `INSERT INTO results (user_id,email,cohort_id,topic,learning_objective, not_confident, confident) VALUES ('${i[2]}','${i[0]}','${i[1]}',?,?,?,?)`,
      [topic, learning_objective, notConfident, confident]
    )
  );

  return server.json({ success: "true" }, 200);
}

function validateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}

async function postSignup(server) {
  const { email, password, cohort_id } = await server.body;
  const salt = await bcrypt.genSalt(8);
  const passwordEncrypted = await bcrypt.hash(password, salt);

  if (!validateEmail(email)) {
    return server.json({ error: "Enter valid email" }, 400);
  }

  const checkRepeatEmails = [...db.query("SELECT COUNT(*) FROM users WHERE email = ?", [email])];
  console.log(checkRepeatEmails);
  if (checkRepeatEmails[0][0]) {
    return server.json({ error: "Email already in use" }, 400);
  }

  db.query(
    "INSERT INTO users (email, cohort_id, encrypted_password, created_at, updated_at, admin) VALUES (?, ?,?, datetime('now'), datetime('now'), false)",
    [email, cohort_id, passwordEncrypted]
  );

  const check = [
    ...db.query(
      "SELECT users.id, users.email,users.cohort_id,learning_objectives.topic,learning_objectives.learning_objective, learning_objectives.not_confident, learning_objectives.confident  FROM learning_objectives JOIN users ON users.cohort_id = learning_objectives.cohort_id WHERE users.email =?",
      [email]
    ),
  ];
  check.forEach((i) =>
    db.query(
      `INSERT INTO results (user_id,email,cohort_id,topic,learning_objective,not_confident,confident) VALUES ('${i[0]}','${i[1]}','${i[2]}','${i[3]}','${i[4]}','${i[5]}','${i[6]}')`
    )
  );

  server.json({ success: true }, 200);
}

async function postLogin(server) {
  const { email, password } = await server.body;
  const authenticated = [...db.query("SELECT * FROM users WHERE email = ?", [email]).asObjects()];
  console.log(authenticated);
  if (authenticated.length && (await bcrypt.compare(password, authenticated[0].encrypted_password))) {
    makeSession(authenticated[0].id, authenticated[0].email, server, authenticated[0].admin);
    server.json({ success: true });
  } else {
    server.json({ success: false });
  }
}

async function postScore(server) {
  const { userID, LO, score, isActive } = await server.body;

  db.query(`UPDATE results SET score = ?, isActive = ? WHERE user_id = ? AND learning_objective = ?`, [score, isActive, userID, LO]);

  const LOs = [...db.query("SELECT * FROM results WHERE user_id = ?", [userID]).asObjects()];
  console.log(LOs);
  return server.json({ LOs: LOs }, 200);
}

async function postCohort(server) {
  const { cohort_id } = await server.body;
  const data = [
    ["HTML/CSS", "Understand what parent and child is"],
    ["HTML/CSS", "Can create and link a stylesheet"],
    ["Javascript", "Be able to link a Javascript file in your project"],
    ["Javascript", "Be able to do a console.log()"],
    ["React", "Understand the difference between class and functional components"],
    ["React", "Be able to create a React application with create-react-app"],
  ];
  data.forEach((item) => {
    db.query(
      `
      INSERT INTO learning_objectives (cohort_id, topic, learning_objective)
      VALUES (?, '${item[0]}', '${item[1]}')
    `,
      [cohort_id]
    );
  });
  return server.json({ success: true }, 200);
}

async function postDarkMode(server) {
  const { darkMode, userID } = await server.body;
  db.query(`UPDATE results SET dark_mode = ? WHERE user_id = ?`, [darkMode, userID]);
  return server.json({ success: true }, 200);
}

async function postEditLO(server) {
  const { newLO, oldLO, newConfident, newNotConfident } = await server.body;
  if (newLO.length <= 10) {
    return server.json({ error: "learning objective must be more than 10 characters!" }, 400);
  }

  if (newConfident.length > 0) {
    if (!(await checkValidUrl(newConfident))) {
      return server.json({ error: "Invalid URL resource" }, 400);
    }
  }
  if (newNotConfident.length > 0) {
    if (!(await checkValidUrl(newNotConfident))) {
      return server.json({ error: "Invalid URL resource" }, 400);
    }
  }

  db.query(`UPDATE learning_objectives SET learning_objective = ?, not_confident = ?, confident = ? WHERE learning_objective = ?`, [
    newLO,
    newNotConfident,
    newConfident,
    oldLO,
  ]);
  db.query(`UPDATE results SET learning_objective = ?, not_confident = ?, confident = ? WHERE learning_objective = ?`, [
    newLO,
    newNotConfident,
    newConfident,
    oldLO,
  ]);
  return server.json({ success: true }, 200);
}

async function makeSession(userID, e, server, isAdmin) {
  const sessionID = v4.generate();
  await db.query(`INSERT INTO sessions (id, user_id, email, created_at, isAdmin) VALUES (?, ?, ?, datetime('now'), ?)`, [
    sessionID,
    userID,
    e,
    isAdmin,
  ]);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 1);

  server.setCookie({
    name: "sessionId",
    value: sessionID,
    expires: expiryDate,
  });
  server.setCookie({ name: "userID", value: userID, expires: expiryDate });
  server.setCookie({ name: "email", value: e, expires: expiryDate });
  server.setCookie({ name: "isAdmin", value: isAdmin, expiryDate });
}

async function deleteLOs(server) {
  const { learning_objective, cohort_id } = await server.body;
  const query = `DELETE FROM learning_objectives WHERE learning_objective = ? AND cohort_id = ?`;
  const query2 = `DELETE FROM results WHERE learning_objective = ? AND cohort_id = ?`;

  await db.query(query, [learning_objective, cohort_id]);
  await db.query(query2, [learning_objective, cohort_id]);
  server.json({ success: true }, 200);
}
