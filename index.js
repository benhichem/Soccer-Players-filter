const express = require("express");
const app = express();
const GetTable = require("./GetData");
const form_handler = require("./form_handler");

const port = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const formhandling = await form_handler(data);
    console.log(formhandling);
    const Table = await GetTable(formhandling);
    res.status(200).json({ response: Table });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`[+] Server is Up on port ${port}`);
});
