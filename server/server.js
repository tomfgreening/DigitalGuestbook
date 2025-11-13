import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pg from "pg"

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

app.listen(8080, ()=> {
    console.log("Server running on port 8080");
});

app.get("/", (request, response) => {
    response.json({message: "Root route"});
});                                                                                               //ROOT ROUTE

const dbConnectionString = process.env.DATABASE_URL;

const db = new pg.Pool({
    connectionString: dbConnectionString,
});

app.get("/guestBookEntries", async (request, response) => {
    const query = await db.query('SELECT * FROM aroundtheworldinaclickguestbook');
    response.json(query.rows);
});                                                                                              // READ ROUTE

app.post("/newEntry", async (request, response) => {
    const data = request.body.formValues;
    const query = await db.query(
        'INSERT INTO aroundtheworldinaclickguestbook (col2, col3, col4, col5) VALUES ($1, $2, $3, $4)',
        [data.input1, data.input2, data.input3, data.input4]
    );
    await response.json(query);
});                                                     // POST ROUTE (awaiting form to be built, client-side)