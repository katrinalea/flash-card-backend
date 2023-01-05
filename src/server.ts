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
  const text = "select name, correct, testamount, correct/testamount * 100 as percentage from leaderboard order by percentage desc limit 10";
  const dbResponse = await client.query(text);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});

app.post("/names", async (req, res) => {
  const { name, correct, testamount } = req.body;
  try {
    const text =
      "insert into leaderboard (name, correct, testamount) values ($1, $2, $3) returning *";
    const values = [name, correct, testamount];
    const dbResponse = await client.query(text, values);
    res.status(200).json({
      status: "success",
      data: dbResponse.rows,
    });
  } catch (err) {
    console.log(err, "error");
  }
});

//add a post request so that when the submit score utton is pressed, there score and name adds to the db

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
