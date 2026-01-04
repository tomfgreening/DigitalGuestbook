import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

app.get("/", (request, response) => {
  response.json({ message: "Root route" });
}); //ROOT ROUTE

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/guestBookEntries", async (request, response) => {
  const query = await db.query("SELECT * FROM aroundtheworldinaclickguestbook");
  response.json(query.rows);
}); // READ ROUTE

app.post("/newEntry", async (request, response) => {
  const data = request.body.formValues;
  const query = await db.query(
    "INSERT INTO aroundtheworldinaclickguestbook (name, date, country, your_message) VALUES ($1, $2, $3, $4)",
    [data.name, data.date, data.country, data.message],
    console.log(data)
  );
  await response.json(query.rows);
});
