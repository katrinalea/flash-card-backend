import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg"; 

dotenv.config();
const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect();
const app = express();
app.use(express.json());
app.use(cors());

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: "hello",
  });
});
// GET /items
app.get("/names", async (req, res) => {
  const text = "select * from leaderboard";
  const dbResponse = await client.query(text);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});


app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
  
