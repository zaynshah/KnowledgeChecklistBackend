import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v2.5.0/mod.ts";
import { abcCors } from "https://deno.land/x/cors/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const app = new Application();
const db = new DB("./knowledge_checklist.db");
const PORT = 8080;
const allowedHeaders = ["Authorization", "Content-Type", "Accept", "Origin", "User-Agent"];

app.use(allowCors()).get("/:cohort/LOs", getLOs).post("/users", postSignup).post("/sessions", postLogin).start({ port: PORT });
console.log(`Server running on http://localhost:${PORT}`);

function allowCors() {
  return abcCors({
    origin: `http://localhost:3000`,
    headers: allowedHeaders,
    credentials: true,
  });
}

async function getLOs(server) {
  const { cohort } = await server.params;
  const query = `
    SELECT *
    FROM learning_objectives
    WHERE cohort_id = ?
  `;
  const LOs = [...(await db.query(query, [cohort]).asObjects())];
  if (LOs.length !== 0) {
    return server.json(LOs, 200);
  } else {
    return server.json({ error: "Cohort does not exist" }, 400);
  }
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

  if (checkRepeatEmails[0][0]) {
    return server.json({ error: "Email already in use" }, 400);
  }

  db.query(
    "INSERT INTO users (email, cohort_id, encrypted_password, created_at, updated_at, admin) VALUES (?, ?,?, datetime('now'), datetime('now'), 0)",
    [email, cohort_id, passwordEncrypted]
  );

  const check = [
    ...db.query(
      "SELECT users.email,users.cohort_id,learning_objectives.topic,learning_objectives.learning_objective FROM learning_objectives JOIN users ON users.cohort_id = learning_objectives.cohort_id WHERE users.email =?",
      [email]
    ),
  ];
  check.forEach((i) => db.query(`INSERT INTO results (email,cohort_id,topic,learning_objective) VALUES ('${i[0]}','${i[1]}','${i[2]}','${i[3]}')`));

  server.json({ success: true }, 200);
}

async function postLogin(server) {
  const { email, password } = await server.body;
  const authenticated = [...db.query("SELECT * FROM users WHERE email = ?", [email]).asObjects()];
  if (authenticated.length && (await bcrypt.compare(password, authenticated[0].encrypted_password))) {
    makeSession(authenticated[0].id, authenticated[0].email, server);
    server.json({ success: true });
  } else {
    server.json({ success: false });
  }
}

async function makeSession(userID, e, server) {
  const sessionID = v4.generate();
  await db.query(`INSERT INTO sessions (id, user_id,email, created_at) VALUES (?, ?,?, datetime('now'))`, [sessionID, userID, e]);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 1);
  server.setCookie({
    name: "sessionId",
    value: sessionID,
    expires: expiryDate,
  });
  server.setCookie({ name: "userID", value: userID, expires: expiryDate });
  server.setCookie({ name: "email", value: e, expires: expiryDate });
}
