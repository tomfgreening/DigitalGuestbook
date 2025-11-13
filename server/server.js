// Express server functionality and interactiviety with the database will run from here. 

//import packages
//start or configure packages
//tell server to use JSON
//set up a port for the server by listening...
//set up your database pool
//create a root route

//=============================================
//I need a route to READ data from the database
//I need a route to CREATE new data in the database

import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pg from "pg"

const app = express();
app.use(cors());
dotenv.config();